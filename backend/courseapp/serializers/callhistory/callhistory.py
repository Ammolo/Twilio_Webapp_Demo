from courseapp.models import Call
from rest_framework import serializers


class CreateSerializer(serializers.ModelSerializer):
    manage_by = serializers.StringRelatedField()

    class Meta:
        model = Call
        fields = ['id', 'answer_type', 'start', 'duration', 'manage_by', 'receive_by']
