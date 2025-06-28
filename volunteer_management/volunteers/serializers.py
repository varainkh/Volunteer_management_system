from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Event, VolunteerHours
from django.db.models import Sum

from .models import AttendanceRecord

class AttendanceSerializer(serializers.ModelSerializer):
    volunteer_username = serializers.CharField(source="volunteer.username", read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ["volunteer", "volunteer_username", "meeting_topic", "online_hours"]




# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    total_hours = serializers.SerializerMethodField()
    events_attended = serializers.SerializerMethodField()
    meetings_attended = serializers.SerializerMethodField()  # ✅ Updated
    phone_number = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'total_hours', 'events_attended', 'meetings_attended', 'phone_number']

    def get_total_hours(self, obj):
        total_hours = VolunteerHours.objects.filter(volunteer=obj).aggregate(total=Sum('hours'))['total']
        return total_hours or 0

    def get_events_attended(self, obj):
        events = VolunteerHours.objects.filter(volunteer=obj).values_list('event__title', flat=True).distinct()
        return list(events)

    def get_meetings_attended(self, obj):
        records = AttendanceRecord.objects.filter(volunteer=obj, online_hours__gt=0).values("topic", "online_hours")
        return [
            {
                "topic": r["topic"],
                "online_hours": float(r["online_hours"])
            }
            for r in records
        ]

    def get_phone_number(self, obj):
        return obj.profile.phone_number if hasattr(obj, 'profile') else None


# ✅ User Registration Serializer
class RegisterSerializer(serializers.ModelSerializer):
    phone_number = serializers.CharField(write_only=True, required=False)  # ✅ Add this line

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone_number']  # ✅ Add to fields
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        phone_number = validated_data.pop('phone_number', '')  # ✅ Get phone number safely
        user = User.objects.create_user(**validated_data)
        Token.objects.create(user=user)
        user.profile.phone_number = phone_number
        user.profile.save()
        return user

# ✅ Event Serializer
class EventSerializer(serializers.ModelSerializer):
    volunteers = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        many=True,
        required=False,  # ✅ Volunteers field remains optional
        slug_field='username'  # ✅ Replaces ID with username
    )

    class Meta:
        model = Event
        fields = "__all__"
        

# ✅ Volunteer Hours Serializer
class VolunteerHoursSerializer(serializers.ModelSerializer):
    volunteer_username = serializers.CharField(write_only=True)  # Accept volunteer's username
    event_title = serializers.CharField(write_only=True)  # Accept event title
    event_date = serializers.DateField(write_only=True)  # Accept event date

    class Meta:
        model = VolunteerHours
        fields = ['id', 'volunteer_username', 'event_title', 'event_date', 'hours']

    def create(self, validated_data):
        volunteer_username = validated_data.pop('volunteer_username')
        event_title = validated_data.pop('event_title')
        event_date = validated_data.pop('event_date')  # Get event date

        # Fetch volunteer (user) by username
        try:
            volunteer = User.objects.get(username=volunteer_username)
        except User.DoesNotExist:
            raise serializers.ValidationError({"volunteer_username": "User not found."})

        # Fetch event by title and date
        try:
            event = Event.objects.get(title=event_title, date=event_date)
        except Event.DoesNotExist:
            raise serializers.ValidationError({"event": "Event not found with this title and date."})

        # Create VolunteerHours entry
        volunteer_hours = VolunteerHours.objects.create(volunteer=volunteer, event=event, **validated_data)
        return volunteer_hours


class VolunteerProfileSerializer(serializers.ModelSerializer):
    phone_number = serializers.SerializerMethodField()  # ✅ Add this line

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number']  # ✅ Include field

    def get_phone_number(self, obj):  # ✅ Add this method
        return obj.profile.phone_number if hasattr(obj, 'profile') else None



