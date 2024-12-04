from rest_framework.test import APITestCase

class FAQListAPITestCase(APITestCase):
    fixtures = ["core/data/test/faqs.json"]

    def test_faq_list(self):
        ## no query
        response = self.client.get("/v1/faqs/")
        self.assertEqual(response.status_code, 200)

        ## all categories
        response = self.client.get("/v1/faqs/", {"category": "전체"})
        self.assertEqual(response.status_code, 200)

        ## with category
        response = self.client.get("/v1/faqs/", {"category": "예약"})
        self.assertEqual(response.status_code, 200)

    def test_faq_list_fail(self):
        ## invalid category
        response = self.client.get("/v1/faqs/", {"category": "invalid"})
        self.assertEqual(response.status_code, 400)
