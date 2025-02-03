import json
from io import BytesIO
from unittest.mock import patch
import requests_mock
from PIL import Image
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User
from .models import Academy

def generate_photo_file():
    file = BytesIO()
    image = Image.new("RGBA", size=(100, 100), color=(155, 0, 0))
    image.save(file, "png")
    file.name = "test.png"
    file.seek(0)
    return file

class AcademyTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.url = "/v1/academies/"
        self.user = User.objects.get(username="normaluser")
        self.academy = Academy.objects.get(name="아카데미 1")
        self.test_image1 = SimpleUploadedFile(
            "test1.png", b"file_content", content_type="image/png"
        )
        self.test_image2 = SimpleUploadedFile(
            "test2.jpg", b"file_content", content_type="image/jpeg"
        )
        address_data = {
            "road_address_part1": "서울특별시 강남구 강남대로 396",
            "road_address_part2": "지하 4층",
            "building_name": "강남구청",
            "zip_code": "06164",
            "bcode": "1168010100",
        }
        self.duplicate_address = {
            "road_address_part1": "서울특별시 강남구 강남대로 396",
            "road_address_part2": "지하 1층",
            "building_name": "강남구청",
            "zip_code": "06164",
            "bcode": "1168010100",
        }
        self.data = {
            "name": "테스트 아카데미",
            "phone": "+821012345678",
            "registration_number": "123-45-67890",
            "address": json.dumps(address_data),
            "certification": self.test_image1,
            "main_logo": self.test_image2,
        }

    @requests_mock.Mocker()
    @patch('django.core.files.storage.default_storage.save')
    def test_academy_register(self, m, mock_save):
        return_address = {
            'addresses': [{
                'y': '37.517362',
                'x': '127.047323',
                'jibunAddress': '서울특별시 강남구 강남대로 396',
                'englishAddress': '396, Gangnam-daero, Gangnam-gu, Seoul'
            }]
        }
        m.get(
            'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
            content=json.dumps(return_address).encode('utf-8'),
            status_code=200
        )
        m.get(
            'https://naveropenapi.apigw.ntruss.com/map-static/v2/raster',
            content=generate_photo_file().getvalue(),
            status_code=200
        )
        mock_save.return_value = 'test.png'
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.data, format="multipart")

        self.assertEqual(response.status_code, 201)

    def test_academy_register_fail(self):
        ## 1. bad registration_number
        self.client.force_authenticate(user=self.user)
        data = self.data.copy()
        data["registration_number"] = "1234567890"
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 2. no address
        data["address"] = json.dumps({
            "road_address_part1": "",
            "road_address_part2": "",
            "building_name": "",
            "zip_code": "",
        })
        data["registration_number"] = "123-45-67890"
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, 400)

    @requests_mock.Mocker()
    @patch('django.core.files.storage.default_storage.save')
    def test_academy_register_fail2(self, m, mock_save):
        return_address = {
            'addresses': [{
                'y': '37.517362',
                'x': '127.047323',
                'jibunAddress': '서울특별시 강남구 강남대로 396',
                'englishAddress': '396, Gangnam-daero, Gangnam-gu, Seoul'
            }]
        }
        m.get(
            'https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode',
            content=json.dumps(return_address).encode('utf-8'),
            status_code=200
        )
        m.get(
            'https://naveropenapi.apigw.ntruss.com/map-static/v2/raster',
            content=generate_photo_file().getvalue(),
            status_code=200
        )
        mock_save.return_value = 'test.png'
        ## 3. duplicate registration number
        self.client.force_authenticate(user=self.user)
        data = self.data.copy()
        data["registration_number"] = "012-34-56789"
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 4. duplicate address
        new_image1 = SimpleUploadedFile(
            "test1.png",
            b"file_content1",
            content_type="image/png"
        )
        new_image2 = SimpleUploadedFile(
            "test2.jpg",
            b"file_content2",
            content_type="image/jpeg"
        )
        data["address"] = json.dumps(self.duplicate_address)
        data["registration_number"] = "123-45-67890"
        data["certification"] = new_image1
        data["main_logo"] = new_image2
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_academy_list(self):
        ## 1. no query and no auth
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        ## 2. query and no auth
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"query": "아카데미"})
        self.assertEqual(response.status_code, 200)

    def test_academy_list_admin(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        param = {'status': '승인 대기'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

        param = {'status': '승인 완료'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

        param = {'status': '승인 거부'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

    def test_academy_list_admin_fail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        param = {'status': '승인'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 400)

    def test_academy_detail(self):
        response = self.client.get(f"{self.url}{self.academy.uuid}/")
        self.assertEqual(response.status_code, 200)

        academy2 = Academy.objects.get(name="아카데미 2")
        response = self.client.get(f"{self.url}{academy2.uuid}/")
        self.assertEqual(response.status_code, 200)

        academy3 = Academy.objects.get(name="아카데미 3")
        response = self.client.get(f"{self.url}{academy3.uuid}/")
        self.assertEqual(response.status_code, 200)

    def test_my_academy(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}my/")
        self.assertEqual(response.status_code, 200)

    def test_my_academy_fail(self):
        response = self.client.get(f"{self.url}my/")
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.get(f"{self.url}my/")
        self.assertEqual(response.status_code, 404)

    def test_academy_approve(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}123e4567-e89b-12d3-a456-426614174111/approve/")
        self.assertEqual(response.status_code, 200)

    def test_academy_reject(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}123e4567-e89b-12d3-a456-426614174111/reject/", {
            "reject_reason": "이유"
        })
        self.assertEqual(response.status_code, 200)

    def test_academy_reject_fail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}123e4567-e89b-12d3-a456-426614174111/reject/")
        self.assertEqual(response.status_code, 400)

    def test_update_introduction(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.academy.uuid}/introduction/", {
            "introduction": "소개"
        })
        self.assertEqual(response.status_code, 200)

    def test_update_introduction_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.academy.uuid}/introduction/", {
            "introduction": ""
        })
        self.assertEqual(response.status_code, 400)

    def test_update_facilities(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.academy.uuid}/facilities/", {
            "facilities": [1, 2]
        })
        self.assertEqual(response.status_code, 200)

    def test_update_facilities_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.academy.uuid}/facilities/")
        self.assertEqual(response.status_code, 400)

    def test_update_business_hours(self):
        daily = {
            "open_time": "09:00",
            "close_time": "18:00",
            "is_closed": False,
            "is_allday": False,
        }
        data = {
            "monday": daily,
            "tuesday": daily,
            "wednesday": daily,
            "thursday": daily,
            "friday": daily,
            "saturday": daily,
            "sunday": daily,
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            f"{self.url}{self.academy.uuid}/hours/", {"data": json.dumps(data)}
        )
        self.assertEqual(response.status_code, 200)

    def test_update_business_hours_fail(self):
        bad_data = {
            "open_time": "30:00",
            "close_time": "30:00",
            "is_closed": False,
            "is_allday": False,
        }
        data = {
            "monday": bad_data,
            "tuesday": bad_data,
            "wednesday": bad_data,
            "thursday": bad_data,
            "friday": bad_data,
            "saturday": bad_data,
            "sunday": bad_data,
        }
        self.client.force_authenticate(user=self.user)
        ## 1. no data
        response = self.client.patch(f"{self.url}{self.academy.uuid}/hours/")
        self.assertEqual(response.status_code, 400)

        ## 2. bad data
        response = self.client.patch(
            f"{self.url}{self.academy.uuid}/hours/", {"data": json.dumps(data)}
        )
        self.assertEqual(response.status_code, 400)

    def test_academy_employees(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{self.academy.uuid}/employees/")
        self.assertEqual(response.status_code, 200)

class FacilityTestCase(APITestCase):
    fixtures = ["core/data/initial/facilities.json"]

    def setUp(self):
        self.url = "/v1/facilities/"

    def test_facility_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_facility_detail(self):
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

class AcademyNoticeTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.url = "/v1/academies/123e4567-e89b-12d3-a456-426614174999/notices/"
        self.user = User.objects.get(username="normaluser")

    def test_academy_notice_list(self):
        response = self.client.get(f"{self.url}")
        self.assertEqual(response.status_code, 200)

    def test_academy_notice_detail(self):
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    @patch('django.core.files.storage.default_storage.save')
    def test_academy_notice_create(self, mock_save):
        self.client.force_authenticate(user=self.user)
        ## 1. normal notice + no image
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "공지",
        })
        self.assertEqual(response.status_code, 201)

        ## 2. event + image
        test_image = SimpleUploadedFile(
            "test.png", b"file_content", content_type="image/png"
        )
        mock_save.return_value = 'test.png'
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "이벤트",
            "image": test_image,
        })
        self.assertEqual(response.status_code, 201)

        # 3. other + no image
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "기타",
        })
        self.assertEqual(response.status_code, 201)

    def test_academy_notice_create_fail(self):
        ## 1. empty data
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"{self.url}", {
            "title": "",
            "content": "",
        })
        self.assertEqual(response.status_code, 400)

        ## 2. no auth
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
        })
        self.assertEqual(response.status_code, 403)

        ## 3. invalid type
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "테스트",
        })
        self.assertEqual(response.status_code, 400)
