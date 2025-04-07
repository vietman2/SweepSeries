from django.test import TestCase

from ..models import Agreement, AgreementVersion

class AgreementModelTest(TestCase):
    fixtures = ["core/data/test/agreements.json"]

    def test_agreement_str(self):
        agreement = Agreement.objects.get(pk=1)
        self.assertEqual(str(agreement), "Mandatory without content")

    def test_agreement_version_str(self):
        version = AgreementVersion.objects.get(pk=1)
        self.assertEqual(str(version), "Mandatory without content - 2024-11-30")
