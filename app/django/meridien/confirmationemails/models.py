from django.db import models


class ConfirmationEmail(models.Model):
    link_string = models.CharField(max_length=256, blank=False)
    subject = models.CharField(max_length=256, blank=False)
    template = models.TextField(blank=False)

