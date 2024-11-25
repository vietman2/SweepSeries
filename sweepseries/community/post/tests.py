from django.utils import timezone
from rest_framework.test import APITestCase

from .models import Post

class PostAPITest(APITestCase):
    fixtures = ['core/data/test/community.json', 'core/data/test/users.json']

    def setUp(self):
        self.url = '/api/posts/'

    def test_list(self):
        ## 1. forum only
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(self.url, {'forum': '드래프트'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(self.url, {'forum': '마켓'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(self.url, {'forum': '스틸'})
        self.assertEqual(response.status_code, 200)

        ## 2. forum and tag
        response = self.client.get(self.url, {'forum': '덕아웃', 'tag': 1})
        self.assertEqual(response.status_code, 200)

        ## 3. forum and search query
        response = self.client.get(self.url, {'forum': '덕아웃', 'search': 'test'})
        self.assertEqual(response.status_code, 200)

    def test_list_time_since(self):
        ## 1. seconds ago
        post = Post.objects.get(pk=2024072300000001)
        post.created_at = timezone.now() - timezone.timedelta(seconds=30)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "방금 전")

        ## 2. minutes ago
        post.created_at = timezone.now() - timezone.timedelta(minutes=30)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "30분 전")

        ## 3. hours ago
        post.created_at = timezone.now() - timezone.timedelta(hours=3)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "3시간 전")

        ## 4. days ago
        post.created_at = timezone.now() - timezone.timedelta(days=3)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "3일 전")

        ## 5. weeks ago
        post.created_at = timezone.now() - timezone.timedelta(weeks=3)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "3주 전")

        ## 6. months ago
        post.created_at = timezone.now() - timezone.timedelta(days=90)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "3달 전")

        ## 7. years ago
        post.created_at = timezone.now() - timezone.timedelta(days=365)
        post.save()
        response = self.client.get(self.url, {'forum': '덕아웃'})
        self.assertEqual(response.data['posts'][0]['created_at'], "1년 전")

    def test_list_fail(self):
        ## 1. no forum
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

        ## 2. invalid forum
        response = self.client.get(self.url, {'forum': 'invalid'})
        self.assertEqual(response.status_code, 400)

    def test_retrieve(self):
        response = self.client.get(self.url + '1/')
        self.assertEqual(response.status_code, 405)
