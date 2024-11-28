from django.utils import timezone
from rest_framework.test import APITestCase

from auth.user.models import User
from auth.userprofile.models import UserProfile
from community.comment.models import Comment, ReComment
from .models import Post

class PostAPITest(APITestCase):
    fixtures = ['core/data/test/community.json', 'core/data/test/users.json']

    def setUp(self):
        self.url = '/v1/posts/'
        self.normaluser = User.objects.get(username="normaluser")
        self.profile = UserProfile.objects.get(pk=2)
        self.create_data = {
            'forum': '덕아웃',
            'tag': 1,
            'title': 'test',
            'content': 'test',
            'author': 2,
        }
        self.edit_data = {
            'title': 'test',
            'content': 'test',
        }

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
        ## 1. guest
        response = self.client.get(self.url + '2024072300000001/')
        self.assertEqual(response.status_code, 200)

        ## 2. user (view for the first time)
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url + '2024072300000001/', {'profile': self.profile.pk})
        self.assertEqual(response.status_code, 200)

        ## 3. user (view again)
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url + '2024072300000002/', {'profile': self.profile.pk})
        self.assertEqual(response.status_code, 200)

    def test_retrieve_fail(self):
        ## 1. user and profile mismatch
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url + '2024072300000001/', {'profile': 1})
        self.assertEqual(response.status_code, 403)

    def test_create(self):
        ## 1. create
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

        ## 2. create with tag 3
        data = self.create_data.copy()
        data['tag'] = 3
        data['forum'] = '드래프트'
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 201)

    def test_create_primary_key(self):
        ReComment.objects.all().delete()
        Comment.objects.all().delete()
        Post.objects.all().delete()
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. unauthenticated
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 403)

        ## 2. invalid data: no data
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 400)

        ## 3. invalid profile: DNE
        data = self.create_data.copy()
        data['author'] = 1234
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 4. invalid profile: not user
        data = self.create_data.copy()
        data['author'] = 1
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

    def test_partial_update(self):
        ## 1. update
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.patch(self.url + '2024072300000002/', self.edit_data)
        self.assertEqual(response.status_code, 200)

    def test_partial_update_fail(self):
        ## 1. unauthenticated
        response = self.client.patch(self.url + '2024072300000002/', self.edit_data)
        self.assertEqual(response.status_code, 403)

        ## 2. not owner
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.patch(self.url + '2024072300000001/', self.edit_data)
        self.assertEqual(response.status_code, 403)

        ## 3. invalid data: empty title
        data = self.edit_data.copy()
        data['title'] = ''
        response = self.client.patch(self.url + '2024072300000002/', data)
        self.assertEqual(response.status_code, 400)

        ## 4. invalid data: empty content
        data = self.edit_data.copy()
        data['content'] = ''
        response = self.client.patch(self.url + '2024072300000002/', data)
        self.assertEqual(response.status_code, 400)

        ## 5. invalid data: title too long
        data = self.edit_data.copy()
        data['title'] = 'a' * 41
        response = self.client.patch(self.url + '2024072300000002/', data)
        self.assertEqual(response.status_code, 400)

    def test_destroy(self):
        ## 1. delete
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.delete(self.url + '2024072300000002/')
        self.assertEqual(response.status_code, 200)

    def test_destroy_fail(self):
        ## 1. unauthenticated
        response = self.client.delete(self.url + '2024072300000002/')
        self.assertEqual(response.status_code, 403)

        ## 2. not owner
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.delete(self.url + '2024072300000001/')
        self.assertEqual(response.status_code, 403)

    def test_like(self):
        like_url = self.url + '2024072300000001/like/'
        ## 1. like
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(like_url, {'profile': self.profile.pk})
        self.assertEqual(response.status_code, 200)

        ## 2. unlike
        response = self.client.post(like_url, {'profile': self.profile.pk})
        self.assertEqual(response.status_code, 200)

    def test_like_fail(self):
        like_url = self.url + '2024072300000001/like/'
        ## 1. unauthenticated
        response = self.client.post(like_url)
        self.assertEqual(response.status_code, 403)

        ## 2. no profile
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(like_url)
        self.assertEqual(response.status_code, 400)

        ## 3. invalid profile
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(like_url, {'profile': 1})
        self.assertEqual(response.status_code, 400)
