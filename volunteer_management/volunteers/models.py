from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField(default="00:00:00")  # ✅ Added default value
    volunteers = models.ManyToManyField(User, related_name="events_attended")

    def __str__(self):
        return f"{self.title} - {self.date} {self.time}"


class VolunteerHours(models.Model):
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE)  # This is the 'volunteer' field (already correct)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    hours = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.volunteer.username} - {self.event.title} - {self.hours} hours"
    
class AttendanceRecord(models.Model):
    volunteer = models.ForeignKey(User, on_delete=models.CASCADE)
    topic = models.CharField(max_length=255, null= True)
    online_hours = models.DecimalField(max_digits=5, decimal_places=2, null = True)

    def __str__(self):
        return f"{self.volunteer.username} - {self.topic} ({self.online_hours} hrs)"


    
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} Profile"
    

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()