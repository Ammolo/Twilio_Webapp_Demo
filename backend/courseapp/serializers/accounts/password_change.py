from courseapp.models import CustomUser

from rest_framework import serializers

class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=True, write_only=True)
    password1 = serializers.CharField(required=True, write_only=True)
    password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, data):
        # Check old password
        if not self.context['user'].check_password(data["old_password"]):
            raise serializers.ValidationError({"old_password": "Wrong password."})

        # Check two passwords
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2": "Password and password confirmation don't match."})

        return data

    def create(self, validated_data):
        self.context['user'].set_password(validated_data["password1"])
        self.context['user'].save()

        return self.context['user']

    class Meta:
        model = CustomUser
        fields = ('old_password', 'password1', 'password2') 
