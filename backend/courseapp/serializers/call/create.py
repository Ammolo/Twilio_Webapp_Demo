from django.utils import timezone

from courseapp.models import Call

from rest_framework import serializers

class CreateSerializer(serializers.ModelSerializer):
    start    = serializers.DateTimeField(required=True, write_only=True)
    duration = serializers.IntegerField (required=True, write_only=True)

    def validate(self, data):
        if data['start'] > timezone.now():
            raise serializers.ValidationError({"start": "Can't be older than now"})
        
        if data['duration'] <= 0:
            raise serializers.ValidationError({"duration": "Can't be negative or null!"})

        return data

    def create(self, validated_data):
        call = Call.objects.create(
            start=validated_data['start'], 
            duration=validated_data['duration'],
            manage_by=self.context['user']
        )
        return call

    class Meta:
        model = Call
        fields = ('start', 'duration')
