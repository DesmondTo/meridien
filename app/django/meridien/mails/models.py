from django.db import models

class Mail(models.Model):
    to = models.CharField(max_length=256, blank=False)
    subject = models.CharField(max_length=256, blank=False)
    message = models.TextField()
    
