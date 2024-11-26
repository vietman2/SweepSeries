from rest_framework.test import APITestCase

from auth.user.models import User
from auth.userprofile.models import UserProfile

class CommentAPITest(APITestCase):
    fixtures = ['core/data/test/community.json', 'core/data/test/users.json']

    def setUp(self):
        self.url = '/v1/comments/'
        self.normaluser = User.objects.get(username="normaluser")
        self.profile = UserProfile.objects.get(pk=2)

    def test_like(self):
        self.client.force_authenticate(user=self.normaluser)
        like_url = '/v1/comments/1/like/'
        ## 1. like
        response = self.client.post(like_url, {'profile': self.profile.id})
        self.assertEqual(response.status_code, 200)

        ## 2. unlike
        response = self.client.post(like_url, {'profile': self.profile.id})
        self.assertEqual(response.status_code, 200)

    def test_like_fail(self):
        like_url = '/v1/comments/1/like/'

        ## 1. like without login
        response = self.client.post(like_url, {'profile': self.profile.id})
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(user=self.normaluser)
        ## 2. like without profile
        response = self.client.post(like_url)
        self.assertEqual(response.status_code, 400)

        ## 2. like with wrong profile
        response = self.client.post(like_url, {'profile': 1})
        self.assertEqual(response.status_code, 400)

class ReCommentAPITest(APITestCase):
    fixtures = ['core/data/test/community.json', 'core/data/test/users.json']

    def setUp(self):
        self.url = '/v1/recomments/'
        self.normaluser = User.objects.get(username="normaluser")
        self.profile = UserProfile.objects.get(pk=2)

    def test_like(self):
        self.client.force_authenticate(user=self.normaluser)
        like_url = '/v1/recomments/1/like/'
        ## 1. like
        response = self.client.post(like_url, {'profile': self.profile.id})
        self.assertEqual(response.status_code, 200)

        ## 2. unlike
        response = self.client.post(like_url, {'profile': self.profile.id})
        self.assertEqual(response.status_code, 200)

    def test_like_fail(self):
        like_url = '/v1/recomments/1/like/'

        ## 1. like without login
        response = self.client.post(like_url, {'profile': self.profile.id})
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(user=self.normaluser)
        ## 2. like without profile
        response = self.client.post(like_url)
        self.assertEqual(response.status_code, 400)

        ## 2. like with wrong profile
        response = self.client.post(like_url, {'profile': 1})
        self.assertEqual(response.status_code, 400)
