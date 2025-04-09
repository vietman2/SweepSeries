import json
from unittest.mock import patch, MagicMock
from django.core.files.uploadedfile import SimpleUploadedFile
import requests_mock
from rest_framework.test import APITestCase

from core.utils import generate_photo_file
from auth.user.models import User

class AcademyRegisterTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
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
        self.duplicate_address = {
            "road_address_part1": "서울특별시 강남구 강남대로 396",
            "road_address_part2": "지하 1층",
            "building_name": "강남구청",
            "zip_code": "06164",
            "bcode": "1168010100",
        }
        address_data = {
            "road_address_part1": "서울특별시 강남구 강남대로 396",
            "road_address_part2": "지하 4층",
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
    @patch('product.academy.utils.default_storage')
    @patch('django.core.files.storage.default_storage.save')
    def test_academy_register(self, m, mock_save, mock_default_storage):
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
        mock_s3_client = MagicMock()
        mock_default_storage.connection.meta.client = mock_s3_client

        fake_bucket = MagicMock()
        fake_bucket.name = "test-bucket"
        mock_default_storage.bucket = fake_bucket

        expected_path = f"users/{self.user.uuid}/profiles/test1.jpg"
        fake_url = f"https://test.com/{expected_path}"
        mock_default_storage.url.return_value = fake_url

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
