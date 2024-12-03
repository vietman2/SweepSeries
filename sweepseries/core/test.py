from rest_framework.test import APITestCase

class TestCookies(APITestCase):
    def test_cookie_deletion(self):
        ## 1. normal case
        self.client.get("/v1/notices/", HTTP_USER_AGENT="chrome")

        ## 2. sweep case
        self.client.post("/v1/login/", HTTP_USER_AGENT="sweep")
