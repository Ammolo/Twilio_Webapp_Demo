from courseapp.models import CustomUser

from rest_framework import serializers
from rest_framework.validators import UniqueValidator

class CreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        # Check two passwords
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password has to be similar"})

        return data

    def create(self, validated_data):
        user = CustomUser.objects.create_user(validated_data['email'], validated_data['password1'])
        return user

    class Meta:
        model = CustomUser
        fields = ('email', 'password1', 'password2')
