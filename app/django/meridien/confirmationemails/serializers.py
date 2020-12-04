from rest_framework import serializers
from confirmationemails.models import ConfirmationEmail


class ConfirmationEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConfirmationEmail
        fields = '__all__'
