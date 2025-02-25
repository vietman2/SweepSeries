from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from core.utils import is_admin_page
from product.academy.models import Academy, AcademyStudent
from .models import Person
from .serializers import PersonSerializer, StudentSimpleSerializer, StudentDetailSerializer

class PersonViewSet(ModelViewSet):
    serializer_class = PersonSerializer
    queryset = Person.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    def list(self, request, *args, **kwargs):
        ## 관리자 페이지에서 접근 시, 유저 정보가 없는 사람들만 조회
        if request.user.is_superuser and is_admin_page(request):
            q = Q()
            q &= Q(user=None)

            queryset = self.get_queryset().filter(q)

            serializer = self.get_serializer(queryset, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)

        ## 그렇지 않으면, 멤버 정보 검색 (레슨 추가시 검색용)
        phone = request.query_params.get('phone', None)

        try:
            person = self.get_queryset().get(phone_number=phone)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSimpleSerializer(person)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class AcademyStudentViewSet(ModelViewSet):
    serializer_class = PersonSerializer
    queryset = Person.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']

    @extend_schema(summary="내 아카데미 수강생 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        academy = Academy.objects.get(uuid=kwargs['academy_id'])
        query = request.query_params.get('query', None)

        q = Q()

        if not query:
            students = academy.students.all()
        else:
            ## name or phone number
            q &= Q(name__icontains=query) | Q(phone_number__icontains=query)
            people = Person.objects.filter(q)
            students = AcademyStudent.objects.filter(
                academy=academy, person__in=people
            )

        student_person_objects = [student.person for student in students]

        serializer = StudentSimpleSerializer(student_person_objects, many=True)

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @extend_schema(summary="아카데미 수강생 상세 조회", tags=["수강생"])
    def retrieve(self, request, *args, **kwargs):
        academy = Academy.objects.get(uuid=kwargs['academy_id'])
        student = self.get_object()

        if not academy.students.filter(id=student.id).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = StudentDetailSerializer(student)

        return Response(serializer.data, status=status.HTTP_200_OK)
