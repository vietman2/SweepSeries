from rest_framework import serializers

from .models import Address

class AddressSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()

    class Meta:
        model = Address
        fields = ["region", "address", "building_name", "longitude", "latitude", "map_image"]

    def get_address(self, obj):
        return f"{obj.road_address_part1} {obj.road_address_part2}"
