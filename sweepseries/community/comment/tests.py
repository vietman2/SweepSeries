from rest_framework.test import APITestCase

from auth.user.models import User
from auth.userprofile.models import UserProfile
from community.comment.models import Comment
from community.post.models import Post

class CommentAPITest(APITestCase):
    fixtures = ['core/data/test/community.json', 'core/data/test/users.json']

    def setUp(self):
        self.url = '/v1/comments/'
        self.normaluser = User.objects.get(username="normaluser")
        self.profile = UserProfile.objects.get(pk=2)
        self.post = Post.objects.first()
        self.data = {
            'post': self.post.id,
            'profile': self.profile.id,
            'content': 'test comment',
        }
        self.report_data = {
            'report_reason': '욕설/비방',
            'report_content': '욕설이 있어요',
        }

    def test_unauthenticated(self):
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 403)

        response = self.client.patch(f'{self.url}1/', {'content': 'edited comment'})
        self.assertEqual(response.status_code, 403)

        response = self.client.delete(f'{self.url}1/')
        self.assertEqual(response.status_code, 403)

        response = self.client.post(f'{self.url}1/like/', {'profile': self.profile.id})
        self.assertEqual(response.status_code, 403)

        response = self.client.post(f'{self.url}1/like/', {'profile': self.profile.id})
        self.assertEqual(response.status_code, 403)

        response = self.client.post(f'{self.url}1/report/', self.report_data)
        self.assertEqual(response.status_code, 403)

    def test_create(self):
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        self.client.force_authenticate(user=self.normaluser)
        ## 1. no data
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 400)

        ## 2. no post
        data = self.data.copy()
        data.pop('post')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 3. post dne
        data['post'] = 100
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 4. no profile
        data = self.data.copy()
        data.pop('profile')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 5. profile dne
        data['profile'] = 100
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 6. profile and user mismatch
        data['profile'] = 1
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

    def test_delete(self):
        self.client.force_authenticate(user=self.post.author.user)
        response = self.client.delete(f'{self.url}2/')
        self.assertEqual(response.status_code, 200)

    def test_delete_fail(self):
        ## 1. not owner
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.delete(f'{self.url}2/')
        self.assertEqual(response.status_code, 403)

    def test_edit(self):
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.patch(f'{self.url}1/', {'content': 'edited comment'})
        self.assertEqual(response.status_code, 200)

    def test_edit_fail(self):
        ## no content
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.patch(f'{self.url}1/')
        self.assertEqual(response.status_code, 400)

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
        self.client.force_authenticate(user=self.normaluser)
        ## 1. like without profile
        response = self.client.post(like_url)
        self.assertEqual(response.status_code, 400)

        ## 2. like with wrong profile
        response = self.client.post(like_url, {'profile': 1})
        self.assertEqual(response.status_code, 400)

    def test_report(self):
        self.client.force_authenticate(user=self.normaluser)
        report_url = '/v1/comments/1/report/'
        response = self.client.post(report_url, self.report_data)
        self.assertEqual(response.status_code, 201)

    def test_report_fail(self):
        report_url = '/v1/comments/1/report/'
        self.client.force_authenticate(user=self.normaluser)
        ## 1. no data
        response = self.client.post(report_url)
        self.assertEqual(response.status_code, 400)

        ## 2. invalid report_reason
        response = self.client.post(report_url, {'report_reason': "invalid"})
        self.assertEqual(response.status_code, 400)

        ## 3. already reported
        self.client.post(report_url, self.report_data)
        response = self.client.post(report_url, self.report_data)
        self.assertEqual(response.status_code, 400)

class ReCommentAPITest(APITestCase):
    fixtures = ['core/data/test/community.json', 'core/data/test/users.json']

    def setUp(self):
        self.url = '/v1/recomments/'
        self.normaluser = User.objects.get(username="normaluser")
        self.profile = UserProfile.objects.get(pk=2)
        self.comment = Comment.objects.first()
        self.data = {
            'comment': self.comment.id,
            'profile': self.profile.id,
            'content': 'test recomment',
        }
        self.report_data = {
            'report_reason': '폭력/협박/위협',
            'report_content': '욕설이 있어요',
        }

    def test_create(self):
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. unauthenticated
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, 403)

        ## 2. no data
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 400)

        ## 3. no comment
        data = self.data.copy()
        data.pop('comment')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 4. comment dne
        data['comment'] = 0
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 5. no profile
        data = self.data.copy()
        data.pop('profile')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 6. profile dne
        data['profile'] = 0
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 7. profile and user mismatch
        data['profile'] = 1
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

    def test_delete(self):
        self.client.force_authenticate(user=self.comment.author.user)
        response = self.client.delete(f'{self.url}1/')
        self.assertEqual(response.status_code, 200)

    def test_delete_fail(self):
        ## 1. unauthenticated
        response = self.client.delete(f'{self.url}1/')
        self.assertEqual(response.status_code, 403)

        ## 2. not owner
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.delete(f'{self.url}2/')
        self.assertEqual(response.status_code, 403)

    def test_edit(self):
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.patch(f'{self.url}1/', {'content': 'edited recomment'})
        self.assertEqual(response.status_code, 200)

    def test_edit_fail(self):
        ## 1. unauthenticated
        response = self.client.patch(f'{self.url}1/', {'content': 'edited recomment'})
        self.assertEqual(response.status_code, 403)

        ## 2. no content
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.patch(f'{self.url}1/')
        self.assertEqual(response.status_code, 400)

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

    def test_report(self):
        self.client.force_authenticate(user=self.normaluser)
        report_url = '/v1/recomments/1/report/'
        response = self.client.post(report_url, self.report_data)
        self.assertEqual(response.status_code, 201)

    def test_report_fail(self):
        report_url = '/v1/recomments/1/report/'
        self.client.force_authenticate(user=self.normaluser)
        ## 1. no data
        response = self.client.post(report_url)
        self.assertEqual(response.status_code, 400)

        ## 2. invalid report_reason
        response = self.client.post(report_url, {'report_reason': "invalid"})
        self.assertEqual(response.status_code, 400)

        ## 3. already reported
        self.client.post(report_url, self.report_data)
        response = self.client.post(report_url, self.report_data)
        self.assertEqual(response.status_code, 400)
