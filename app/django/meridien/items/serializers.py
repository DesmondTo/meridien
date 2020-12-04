from rest_framework import serializers
from items.models import BookedItem
from items.models import Item

from bookings.serializers import BookingSerializer
        
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'

class BookedItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedItem
        fields = '__all__'
    def to_representation(self, instance):
        self.fields['item'] = ItemSerializer(read_only=True)
        self.fields['booking_source'] = BookingSerializer(read_only=True)
        return super().to_representation(instance)