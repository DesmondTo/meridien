# Generated by Django 3.0.6 on 2020-05-23 13:57

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookings', '0003_auto_20200523_2026'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='deposit_left',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10, validators=[django.core.validators.MinValueValidator(0.0), django.core.validators.MaxValueValidator(200.0)]),
        ),
    ]
