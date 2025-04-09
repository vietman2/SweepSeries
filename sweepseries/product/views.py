from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from product.academy.models import Academy
from product.academy.serializers import AcademyProfileSerializer
from product.coach.models import Coach
from product.coach.serializers import CoachProfileSerializer

class MyPromodeProfilesView(GenericAPIView):
    """
        프로모드 프로필 조회: url은 /v1/pro/my/
    """
    permission_classes = [IsAuthenticated, ]
    http_method_names = ['get']

    @extend_schema(summary="프로모드 프로필 조회", tags=["프로모드"])
    def get(self, request):
        user = request.user

        my_academies = Academy.objects.filter(owner=user)
        academies_serializer = AcademyProfileSerializer(my_academies, many=True)

        my_coach_profiles = Coach.objects.filter(person=user.person)
        coach_profiles_serializer = CoachProfileSerializer(my_coach_profiles, many=True)

        return Response({
            "academies": academies_serializer.data,
            "coach": coach_profiles_serializer.data
        }, status=status.HTTP_200_OK)
