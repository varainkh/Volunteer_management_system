# Generated by Django 5.1.6 on 2025-04-07 11:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('volunteers', '0006_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='attendancerecord',
            name='meeting_time',
            field=models.TimeField(default='00:00:00'),
        ),
    ]
