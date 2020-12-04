from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from datetime import date


class Booking(models.Model):
    UNCONFIRMED = 'UNC'
    PENDING = 'PEN'
    EVALUATING = 'EVA'
    PROCESSED = 'PRO'
    RETRIEVED = 'GET'
    RETURNED = 'RET'

    PROCESS_STATUSES = [
        (PENDING, 'Pending'),
        (EVALUATING, 'Evaluating'),
        (PROCESSED, 'Processed'),
        (UNCONFIRMED, 'Unconfirmed'),
        (RETRIEVED, 'Retrieved'),
        (RETURNED, 'Returned')
    ]

    phone_number_validator = RegexValidator(r'(8[1-8][0-9]{6}|9[0-8][0-9]{6})', 'Invalid phone number.')
    
    name = models.CharField(max_length=256, blank=False, default='N/A')
    email = models.EmailField(blank=False, default='N/A')
    organization = models.CharField(max_length=1000, blank=False, default='N/A')
    phone_no = models.CharField(blank=False, default='00000000', validators=[phone_number_validator], max_length=8)
    reason = models.TextField(blank=False, default='-')
    time_booked = models.DateTimeField(auto_now_add=True)
    loan_start_time = models.DateField(blank=False, default=date.fromtimestamp(0))
    loan_end_time = models.DateField(blank=False, default=date.fromtimestamp(0))
    deposit_left = models.DecimalField(default=0.00, decimal_places=2, max_digits=10, validators=[MinValueValidator(0.00), MaxValueValidator(200.00)])
    amount_paid = models.DecimalField(default=0.00, decimal_places=2, max_digits=10, validators=[MinValueValidator(0.00), MaxValueValidator(200.00)])
    status = models.CharField(max_length=32, blank=False, choices=PROCESS_STATUSES, default=UNCONFIRMED)

    def __str__(self):
        return f"Booking by {self.name} made on {self.time_booked.strftime('%Y-%m-%d %H:%M')}"
