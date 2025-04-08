from django.db.models import Q
from rest_framework import serializers

from core.utils import get_presigned_url
from product.contract.models import Contract, Review
from product.lesson.models import Session, SessionRequest
from product.program.models import Program
from .more_serializers import AcademyImageSerializer, ConvenienceSerializer
from ..models import Academy, AcademyLike
from ..utils import get_weekly_schedule, get_schedule_details

class AcademySimpleSerializer(serializers.ModelSerializer):
    rating      = serializers.SerializerMethodField()
    num_reviews = serializers.SerializerMethodField()
    num_likes   = serializers.SerializerMethodField()
    is_liked    = serializers.SerializerMethodField()
    top_review  = serializers.SerializerMethodField()
    location    = serializers.SerializerMethodField()
    logo        = serializers.SerializerMethodField()
    last_session        = serializers.SerializerMethodField()
    remaining_sessions  = serializers.SerializerMethodField()
    num_students        = serializers.SerializerMethodField()
    num_requests        = serializers.SerializerMethodField()

    class Meta:
        model = Academy
        fields = [
            "uuid", "name", "rating", "num_reviews", "location",
            "num_likes", "is_liked", "top_review", "logo",
            "last_session", "remaining_sessions", "num_students", "num_requests"
        ]

    def get_rating(self, obj):
        return obj.cached_rating

    def get_num_reviews(self, obj):
        return obj.num_reviews

    def get_num_likes(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        if user is None or not user.is_authenticated:
            return False

        return AcademyLike.objects.filter(academy=obj, user=user).exists()

    def get_top_review(self, obj):
        q = Q(contract__curriculum__program__academy=obj)
        reviews = Review.objects.filter(q)
        top_review = reviews.order_by('-academy_rating').first()
        return top_review.academy_comment if top_review else None

    def get_location(self, obj):
        return obj.address.region.get_display_name()

    def get_logo(self, obj):
        return get_presigned_url(obj.logo)

    def get_last_session(self, obj):
        ## 가장 최근에 진행된 세션
        ## mode 는 student 아니면 coach
        mode = self.context.get('mode', 'student')
        user = self.context.get('user')

        if user is None or not user.is_authenticated:
            return None

        if mode != 'student':
            return None

        q = Q(lesson__student=user.person)
        q &= Q(lesson__program__academy=obj)
        session = Session.objects.filter(q).order_by('-start_datetime').first()

        if session:
            return session.start_datetime.strftime("%Y.%m.%d.")

        return None

    def get_remaining_sessions(self, obj):
        mode = self.context.get('mode', 'student')
        user = self.context.get('user')

        if user is None or not user.is_authenticated:
            return None

        if mode != 'student':
            return None

        ## 모든 계약에서 남은 세션 수의 합
        user = self.context.get('user')
        q = Q(customer=user.person)
        q &= Q(curriculum__program__academy=obj)
        contracts = Contract.objects.filter(q)

        num_sessions = 0
        for contract in contracts:
            num_sessions += contract.scheduled_lessons - contract.completed_lessons

        return num_sessions

    def get_num_students(self, obj):
        return obj.students.count()

    def get_num_requests(self, obj):
        programs = Program.objects.filter(academy=obj)

        ## get requests that are neither accepted nor rejected
        q = Q(accepted=False) & Q(rejected=False)
        q &= Q(program__in=programs)
        return SessionRequest.objects.filter(q).count()

class AcademyDetailSerializer(serializers.ModelSerializer):
    address             = serializers.SerializerMethodField()
    logo                = serializers.SerializerMethodField()
    map                 = serializers.SerializerMethodField()
    images              = serializers.SerializerMethodField()
    rating              = serializers.SerializerMethodField()
    num_reviews         = serializers.SerializerMethodField()
    convenience         = ConvenienceSerializer(many=True)
    schedules           = serializers.SerializerMethodField()
    schedule_details    = serializers.SerializerMethodField()
    is_liked            = serializers.SerializerMethodField()

    class Meta:
        model = Academy
        fields = [
            "uuid", "name", "logo", "introduction", "address", "map", "images", "rating",
            "num_reviews", "convenience", "schedules", "schedule_details", "is_liked"
        ]

    def get_address(self, obj):
        return f"{obj.address.road_address_part1}, {obj.address.road_address_part2}"

    def get_logo(self, obj):
        return get_presigned_url(obj.logo)

    def get_map(self, obj):
        return get_presigned_url(obj.address.map_image)

    def get_images(self, obj):
        return AcademyImageSerializer(obj.images.all(), many=True).data

    def get_rating(self, obj):
        return obj.cached_rating

    def get_num_reviews(self, obj):
        return obj.num_reviews

    def get_is_liked(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        if user is None or not user.is_authenticated:
            return False

        return obj.likes.filter(user=user).exists()

    def get_schedules(self, obj):
        return get_weekly_schedule(obj)

    def get_schedule_details(self, obj):
        return get_schedule_details(obj)
