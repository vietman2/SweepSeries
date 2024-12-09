import re
import uuid
from django.core.files.storage import default_storage
from django.db import transaction
from rest_framework import serializers
from phonenumber_field.validators import validate_international_phonenumber

from auth.user.serializers import UserRelatedSerializer
from core.utils import get_presigned_url
from product.address.models import Address, Sigungu
from product.address.utils import get_coordinates, fetch_map_image
from .models import Academy

class AcademySimpleSerializer(serializers.ModelSerializer):
    rating      = serializers.SerializerMethodField()
    num_reviews = serializers.SerializerMethodField()
    num_likes   = serializers.SerializerMethodField()
    is_liked    = serializers.SerializerMethodField()
    top_review  = serializers.SerializerMethodField()
    location    = serializers.SerializerMethodField()
    logo        = serializers.SerializerMethodField()

    class Meta:
        model = Academy
        fields = [
            "uuid", "name", "rating", "num_reviews", "location",
            "num_likes", "is_liked", "top_review", "logo"
        ]

    def get_rating(self, obj):
        ## TODO: rating 계산
        return 0.0

    def get_num_reviews(self, obj):
        ## TODO: 리뷰 개수 계산
        return 0

    def get_num_likes(self, obj):
        ## TODO: 좋아요 개수 계산
        return 0

    def get_is_liked(self, obj):
        ## TODO: 좋아요 여부 계산
        return False

    def get_top_review(self, obj):
        ## TODO: 최상위 리뷰 계산
        return "좋은 시설과 친절한 코치들이 많아요!"
    
    def get_location(self, obj):
        return obj.address.region.get_display_name()

    def get_logo(self, obj):
        return get_presigned_url(obj.logo)

class AcademyStatusSerializer(serializers.ModelSerializer):
    owner           = UserRelatedSerializer(read_only=True)
    certification   = serializers.SerializerMethodField()
    verified_at     = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Academy
        fields = [
            "uuid", "name", "owner", "is_verified", "is_rejected", "certification", "verified_at",
            "reject_reason"
        ]

    def get_certification(self, obj):
        return get_presigned_url(obj.certificate)

class AcademyRegisterSerializer(serializers.ModelSerializer):
    registration_number = serializers.CharField()
    phone               = serializers.CharField()
    address            = serializers.JSONField()
    certification       = serializers.FileField()
    main_logo           = serializers.FileField()

    class Meta:
        model = Academy
        fields = ["name", "phone", "registration_number", "certification", "main_logo", "address"]

    def validate_registration_number(self, value):
        ## 사업자 등록번호 중복 확인
        if Academy.objects.filter(registration_number=value).exists():
            raise serializers.ValidationError("이미 등록된 사업자 등록번호입니다.")
        ## 사업자 등록번호 형식 확인 (xxx-xx-xxxxx)
        if not re.match(r"^\d{3}-\d{2}-\d{5}$", value):
            raise serializers.ValidationError("올바른 사업자 등록번호 형식이 아닙니다.")

        return value

    def validate_phone(self, value):
        validate_international_phonenumber(value)
        return value

    def validate_address(self, value):
        if value is None or value['road_address_part1'] == '' or value['road_address_part2'] == '':
            raise serializers.ValidationError('주소를 입력해주세요.')

        return value

    def validate(self, attrs):
        if Address.objects.filter(
            road_address_part1=attrs['address']['road_address_part1'],
            road_address_part2=attrs['address']['road_address_part2']
        ).exists():
            raise serializers.ValidationError({
                'address': '이미 등록된 주소입니다.\n관리자에게 문의해주세요.'
            })

        return attrs

    def upload_certificate(self, **kwargs):
        new_id = kwargs['uuid']
        file = self.validated_data['certification']
        filename = file.name.split('/')[-1]
        path = f"products/academies/{new_id}/certification/{filename}"
        default_storage.save(path, file)
        return path

    def upload_main_logo(self, **kwargs):
        new_id = kwargs['uuid']
        file = self.validated_data['main_logo']
        filename = file.name.split('/')[-1]
        path = f"products/academies/{new_id}/main_logo/{filename}"
        default_storage.save(path, file)
        return path

    def create_address(self, **kwargs):
        new_id = kwargs['uuid']
        input_data = self.validated_data['address']
        query = input_data['road_address_part1']
        bcode = input_data['bcode']

        lat, lng, jibun_address, english_address = get_coordinates(query)
        sigungu = Sigungu.objects.get_sigungu_from_bcode(bcode)

        image = fetch_map_image(lat, lng)
        path = f"products/academies/{new_id}/map_image.png"
        default_storage.save(path, image)

        address = {
            'region': sigungu,
            'road_address_part1': query,
            'road_address_part2': input_data['road_address_part2'],
            'building_name': input_data['building_name'],
            'zip_code': input_data['zip_code'],
            'latitude': lat,
            'longitude': lng,
            'jibun_address': jibun_address,
            'eng_address': english_address,
            'map_image': path,
        }

        return address

    def save(self, **kwargs):
        with transaction.atomic():
            new_id = uuid.uuid4()
            uploaded_certificate = self.upload_certificate(uuid=new_id)
            uploaded_logo = self.upload_main_logo(uuid=new_id)
            address_data = self.create_address(uuid=new_id)

            address = Address.objects.create(**address_data)

            academy = Academy.objects.create(
                uuid=new_id,
                name=self.validated_data['name'],
                owner=self.context['request'].user,
                academy_phone_number=self.validated_data['phone'],
                registration_number=self.validated_data['registration_number'],
                certificate=uploaded_certificate,
                logo=uploaded_logo,
                address=address,
            )

            return academy
