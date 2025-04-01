import json
from unittest.mock import patch
from botocore.exceptions import ClientError
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User
from ..models import Academy

class AcademyUpdatesTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
    ]

    def setUp(self):
        self.url = "/v1/academies/"
        self.user = User.objects.get(username="normaluser")
        self.academy = Academy.objects.get(name="아카데미 1")
        self.test_image1 = SimpleUploadedFile(
            "test1.png", b"file_content", content_type="image/png"
        )

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

        ## 2. bad data 1: invalid time
        response = self.client.patch(
            f"{self.url}{self.academy.uuid}/hours/", {"data": json.dumps(data)}
        )
        self.assertEqual(response.status_code, 400)

    @patch('django.core.files.storage.default_storage.save')
    def test_academy_lodo_update(self, mock_save):
        self.client.force_authenticate(user=self.user)
        mock_save.return_value = 'test.png'
        response = self.client.patch(f"{self.url}{self.academy.uuid}/logo/", {
            "main_logo": self.test_image1
        })
        self.assertEqual(response.status_code, 200)

    @patch('django.core.files.storage.default_storage.save')
    def test_academy_lodo_update_fail(self, mock_save):
        ## no image
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{self.academy.uuid}/logo/")
        self.assertEqual(response.status_code, 400)

        ## upload fail
        mock_save.side_effect = ClientError(error_response={}, operation_name='test')
        response = self.client.patch(f"{self.url}{self.academy.uuid}/logo/", {
            "main_logo": self.test_image1
        })
        self.assertEqual(response.status_code, 400)
