from django.test import TestCase

from .models import Sido, Sigungu

class AddressModelsTestCase(TestCase):
    fixtures = ["core/data/initial/regions.json"]

    def test_sido_str(self):
        sido = Sido.objects.get(label="서울")
        self.assertEqual(str(sido), '서울특별시')

    def test_sigungu_str(self):
        sigungu = Sigungu.objects.get(sigungu_name='강남구')
        self.assertEqual(str(sigungu), '강남구')
