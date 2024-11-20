from rest_framework import status
from rest_framework.test import APITestCase

class CheckUsernameEmailAPITestCase(APITestCase):
    def setUp(self):
        self.url = "/api/check-username-email/"
        self.data = {
            "username": "test",
            "first_name": "test",
            "last_name": "test",
            "email": "test@test.com",
            "phone_number": "010-1234-5678",
            "password": "passpass1234!",
            "password2": "passpass1234!",
        }
        self.data2 = {
            "username": "test",
            "first_name": "test2",
            "last_name": "test2",
            "email": "test2@test.com",
            "phone_number": "010-1234-5679",
            "password": "passpass12345!",
            "password2": "passpass12345!",
        }

    def test_unallowed_method(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_check_username_email_success(self):
        response = self.client.get(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class CheckPasswordAPITestCase(APITestCase):
    def setUp(self):
        self.url = "/api/check-password/"
        self.data = {
            "password": "passpass1234!",
            "password2": "passpass1234!",
        }

    def test_unallowed_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.put(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.patch(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_check_password_success(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_check_password_fail(self):
        ## 1. password is not included
        self.data["password"] = ""
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. password is not matched
        self.data["password"] = "passpass1234!"
        self.data["password2"] = "passpass12345!"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. password is too short
        self.data["password"] = "test"
        self.data["password2"] = "test"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 4. password doesn't contain alphabets
        self.data["password"] = "12341234!!"
        self.data["password2"] = "12341234!!"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 5. password doesn't contain numbers
        self.data["password"] = "asdfasdf!!"
        self.data["password2"] = "asdfasdf!!"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 6. password doesn't contain special characters
        self.data["password"] = "asdfasdf1234"
        self.data["password2"] = "asdfasdf1234"
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
