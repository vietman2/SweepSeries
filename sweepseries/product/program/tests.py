from rest_framework.test import APITestCase

from auth.user.models import User
from product.academy.models import Academy

class ProgramTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/test/coaches.json",
        "core/data/test/programs.json", "core/data/initial/facilities.json",
        "core/data/initial/programs.json", "core/data/initial/professions.json"
    ]

    def setUp(self):
        self.url = "/v1/programs/"
        self.user = User.objects.get(username="normaluser")
        self.userprofile = self.user.profiles.first()
        self.academy = Academy.objects.get(name="아카데미 1")
        self.data = {
            "name": "프로그램 1",
            "academy": str(self.academy.uuid),
            "target_id": 1,
            "positions_id": [1, 2],
            "duration": "60",
            "curriculum_data": [
                {
                    "num_lessons": 10,
                    "price": 100000,
                }
            ],
            "coach_team": {
                "select_disabled": True,
                "teams": [{
                    "coaches": [
                        {"uuid": "923e4567-e89b-12d3-a456-426614174999"},
                    ]
                }]
            }
        }
        self.edit_data = {
            "name": "프로그램 1",
            "target_id": 1,
            "positions_id": [1, 2],
            "duration": "60",
        }

    def test_targets(self):
        response = self.client.get(f"{self.url}targets/")
        self.assertEqual(response.status_code, 200)

    def test_positions(self):
        response = self.client.get(f"{self.url}positions/")
        self.assertEqual(response.status_code, 200)

    def test_list(self):
        ## 1. search by academy
        response = self.client.get(f"{self.url}?academy={self.academy.uuid}")
        self.assertEqual(response.status_code, 200)

        ## 2. search by profile (academy)
        response = self.client.get(f"{self.url}?profile={self.userprofile.id}")
        self.assertEqual(response.status_code, 200)

        ## 2. search by profile (coach)
        response = self.client.get(f"{self.url}?profile=3")
        self.assertEqual(response.status_code, 200)

    def test_list_fail(self):
        ## 1. no params
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

        ## 2. search by profile: normal user
        response = self.client.get(f"{self.url}?profile=1")
        self.assertEqual(response.status_code, 400)

        ## 3. search by profile: not found
        response = self.client.get(f"{self.url}?profile=999")
        self.assertEqual(response.status_code, 404)

    def test_retrieve(self):
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        ## 1. select disabled
        response = self.client.post(self.url, data=self.data, format="json")
        self.assertEqual(response.status_code, 201)

        ## 2. select enabled
        data = self.data.copy()
        data["name"] = "프로그램 2"
        data["coach_team"]["select_disabled"] = False
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. no params
        data = {}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 2. bad data (bad duration)
        data = self.data.copy()
        data["duration"] = "45"
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 3. bad data (invalid num lessons)
        data = self.data.copy()
        data["curriculum_data"] = [
            {
                "num_lessons": 0,
                "price": 100000,
            }
        ]
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 4. bad data (invalid price)
        data = self.data.copy()
        data["curriculum_data"] = [
            {
                "num_lessons": 10,
                "price": -100000,
            }
        ]
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 5. bad data (no academy)
        data = self.data.copy()
        data["academy"] = "923e4567-e89b-12d3-a456-426614174999"
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 6. bad data (no team)
        data = self.data.copy()
        data["coach_team"]["select_disabled"] = False
        data["coach_team"]["teams"] = []
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_edit(self):
        response = self.client.patch(f"{self.url}1/", data=self.edit_data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_edit_fail(self):
        ## 1. bad data (bad duration)
        data = self.edit_data.copy()
        data["duration"] = "45"
        response = self.client.patch(f"{self.url}1/", data=data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_delete(self):
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    def test_edit_curriculums(self):
        data = {
            "curriculums": [
                {
                    "num_lessons": 1,
                    "price": 100000,
                },
                {
                    "num_lessons": 5,
                    "price": 450000,
                },
            ]
        }

        response = self.client.patch(f"{self.url}1/curriculums/", data=data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_edit_curriculums_fail(self):
        ## 1. no data
        response = self.client.patch(f"{self.url}1/curriculums/")
        self.assertEqual(response.status_code, 400)

        ## 2. bad data (invalid num lessons)
        data = {
            "curriculums": [
                {
                    "num_lessons": 0,
                    "price": 100000,
                },
            ]
        }
        response = self.client.patch(f"{self.url}1/curriculums/", data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 3. bad data (invalid price)
        data = {
            "curriculums": [
                {
                    "num_lessons": 1,
                    "price": -100000,
                },
            ]
        }
        response = self.client.patch(f"{self.url}1/curriculums/", data=data, format="json")
        self.assertEqual(response.status_code, 400)

    def test_toggle(self):
        response = self.client.patch(f"{self.url}1/toggle/")
        self.assertEqual(response.status_code, 200)

class CoachTeamTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/test/coaches.json",
        "core/data/test/programs.json", "core/data/initial/facilities.json",
        "core/data/initial/programs.json", "core/data/initial/professions.json"
    ]

    def setUp(self):
        self.url = "/v1/programs/1/coaches/"
        self.user = User.objects.get(username="normaluser")
        self.userprofile = self.user.profiles.first()
        self.academy = Academy.objects.get(name="아카데미 1")
        self.data = {
            "uuids": ["923e4567-e89b-12d3-a456-426614174999"],
        }

    def test_create(self):
        response = self.client.post(self.url, data=self.data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. program does not exist
        response = self.client.post("/v1/programs/999/coaches/", data={}, format="json")
        self.assertEqual(response.status_code, 404)

        ## 2. no data
        response = self.client.post(self.url, data={}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_delete(self):
        self.client.post(self.url, data=self.data, format="json")
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    def test_delete_fail(self):
        ## 1. program does not exist
        response = self.client.delete("/v1/programs/999/coaches/1/")
        self.assertEqual(response.status_code, 404)

        ## 2. team does not exist
        response = self.client.delete(f"{self.url}999/")
        self.assertEqual(response.status_code, 404)
