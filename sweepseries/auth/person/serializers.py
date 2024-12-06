from rest_framework import serializers

from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    name            = serializers.CharField(read_only=True)
    phone_number    = serializers.SerializerMethodField(read_only=True)
    birth_date      = serializers.DateField(format='%Y-%m-%d', read_only=True)
    gender          = serializers.CharField(read_only=True, source='get_gender_display')

    class Meta:
        model = Person
        fields = ['name', 'phone_number', 'birth_date', 'gender']

    def get_phone_number(self, obj):
        return obj.phone_number.as_national
