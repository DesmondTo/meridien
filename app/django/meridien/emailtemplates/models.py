from django.db import models

class EmailTemplate(models.Model):
    name = models.CharField(max_length=256, blank=False)
    subject = models.CharField(max_length=256, blank=False)
    template = models.TextField(blank=False)
