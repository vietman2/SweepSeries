from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Agreement

class AgreementsAPITestCase(APITestCase):
    fixtures = ["core/data/test/agreements.json"]

    def setUp(self):
        self.url = "/v1/agreements/"

    def test_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_agreements_retrieve(self):
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_privacy_policy(self):
        ## 1. normal
        response = self.client.get("/v1/privacy_policy/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. with version (DNE)
        response = self.client.get("/v1/privacy_policy/?version=999")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "약관 버전이 존재하지 않습니다.")

        ## 3. with version (valid)
        response = self.client.get("/v1/privacy_policy/?version=6")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Sample Privacy Policy")

    def test_privacy_policy_fail(self):
        privacy_policy = Agreement.objects.get(title="Catch B 개인정보 처리방침")
        privacy_policy.delete()
        response = self.client.get("/v1/privacy_policy/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_terms_of_service(self):
        ## 1. normal
        response = self.client.get("/v1/terms_of_service/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. with version (DNE)
        response = self.client.get("/v1/terms_of_service/?version=999")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "약관 버전이 존재하지 않습니다.")

        ## 3. with version (valid)
        response = self.client.get("/v1/terms_of_service/?version=7")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Sample Terms of Service")

    def test_terms_of_service_fail(self):
        terms_of_service = Agreement.objects.get(title="Catch B 서비스 이용약관")
        terms_of_service.delete()
        response = self.client.get("/v1/terms_of_service/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_version_dne(self):
        ## ONLY FOR COVERAGE. SHOULD NOT BE REACHED IN PRODUCTION
        terms_of_service = Agreement.objects.get(title="Catch B 서비스 이용약관")
        terms_of_service.versions.all().delete()
        response = self.client.get("/v1/terms_of_service/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "약관 버전이 존재하지 않습니다.")
