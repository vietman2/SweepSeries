
import json
from io import BytesIO
from unittest.mock import patch
import requests_mock
from PIL import Image
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User

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
        "core/data/test/academies.json"
    ]

    def setUp(self):
        self.url = "/v1/academies/"
        self.user = User.objects.get(username="normaluser")
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
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        response = self.client.get(self.url, {"query": "테스트"})
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
