from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from dj_rest_auth.views import LoginView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminOnly
from .models import User
from .serializers import UserSerializer

class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AdminOnly]
    http_method_names = ['get']

    def list(self, request, *args, **kwargs):
        #role = request.query_params.get('role', None)
        q = Q()
        q &= Q(is_superuser=False)

        queryset = self.get_queryset().filter(q)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

class UserLoginView(LoginView):
    def post(self, request, *args, **kwargs):
        admin_page_url = settings.ADMIN_PAGE_URL
        if request.META.get('HTTP_ORIGIN') == admin_page_url:
            q = Q()
            q &= Q(username=request.data['username'], is_superuser=True)
            if not User.objects.filter(q).exists():
                return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)

        response = super().post(request, *args, **kwargs)

        user = User.objects.get(username=request.data['username'])
        user.last_login = timezone.now()
        user.save()

        return response
