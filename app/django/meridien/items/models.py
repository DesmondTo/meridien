from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from bookings.models import Booking

class Item(models.Model):
    name = models.CharField(max_length=256, blank=False)
    quantity = models.PositiveIntegerField(default=0)
    item_status = models.CharField(max_length=256, default='N/A')
    remarks = models.TextField(default='-')
    category = models.CharField(max_length=256, default='-')
    deposit = models.DecimalField(default=0.00, decimal_places=2, max_digits=10, validators=[MinValueValidator(0.00), MaxValueValidator(200.00)])

    def __str__(self):
        return self.name
    
class BookedItem(models.Model):
    ACCEPTED = 'ACC'
    REJECTED = 'REJ'
    PENDING = 'PEN'

    BOOKING_STATUSES = [
        (ACCEPTED, 'Accepted'),
        (REJECTED, 'Rejected'),
        (PENDING, 'Pending')
    ]
    
    booking_source = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='booked_items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE) #if the item is no longer offered, just put up an announcement or smth liddat
    quantity = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=32, blank=False, choices=BOOKING_STATUSES, default=PENDING)

    def __str__(self):
        return f"Booking for {self.quantity} {self.item.name}"
