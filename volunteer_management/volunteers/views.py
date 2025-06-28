from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import generics, permissions, filters
from django.contrib.auth.models import User
from django.db.models import Sum
from .serializers import (
    RegisterSerializer, UserSerializer, EventSerializer, VolunteerHoursSerializer
)
from .models import Event, VolunteerHours
from datetime import date
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.views import APIView, status
from rest_framework.decorators import action
from .models import AttendanceRecord
from .serializers import AttendanceSerializer
from datetime import datetime
from django.utils.timezone import now
from rest_framework.filters import SearchFilter
from django.db.models import Q


# ✅ User Registration View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


# ✅ Custom Token Authentication (DRF Token Auth)
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username,
            'is_staff': user.is_staff,  # ✅ This line is required
        })


# ✅ Retrieve User Info
class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        name = request.GET.get("name", "")
        if not name:
            return Response({"error": "Name parameter is required"}, status=400)

        user = User.objects.filter(username__iexact=name).first()
        if not user:
            return Response({"error": "Volunteer not found"}, status=404)

        hours_worked = VolunteerHours.objects.filter(volunteer=user).aggregate(total_hours=Sum('hours'))['total_hours'] or 0
        events_attended = Event.objects.filter(volunteers=user).values("title", "date")

        # ✅ List of meeting topics where user has online_hours > 0
        topics_attended = AttendanceRecord.objects.filter(
            volunteer=user, online_hours__gt=0
        ).values_list("topic", flat=True)

        phone_number = getattr(user.profile, "phone_number", None)

        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "phone_number": phone_number,
            "hours_worked": hours_worked,
            "events_attended": list(events_attended),
            "topics_attended": list(topics_attended),  # 🔄 now a list of strings
        })





# ✅ Event Management (Admin Only)
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAdminUser]


# ✅ List Volunteers (Admin Only)
class VolunteerListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.filter(is_staff=False)
    filter_backends = [filters.SearchFilter]
    search_fields = ['username']


from rest_framework.permissions import IsAdminUser
from django.shortcuts import get_object_or_404
# ✅ Assign Volunteer Hours (Admin Only)
class AssignVolunteerHoursView(APIView):
    permission_classes = [IsAdminUser]  # ✅ Only admins can assign hours

    def post(self, request):
        volunteer_username = request.data.get("volunteer")
        event_title = request.data.get("event")
        event_date = request.data.get("event_date")
        hours = request.data.get("hours")

        # Validate input data
        if not all([volunteer_username, event_title, event_date, hours]):
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch volunteer (user) by username
        volunteer = get_object_or_404(User, username=volunteer_username)

        # Fetch event by title and date
        event = get_object_or_404(Event, title=event_title, date=event_date)

        # ✅ Ensure volunteer is linked to event
        if not event.volunteers.filter(id=volunteer.id).exists():
            event.volunteers.add(volunteer)  # ✅ Auto-link volunteer to event

        # ✅ Create or update VolunteerHours entry
        volunteer_hours, created = VolunteerHours.objects.update_or_create(
            volunteer=volunteer,
            event=event,
            defaults={'hours': hours}
        )

        return Response({"message": "Volunteer hours assigned successfully"}, status=status.HTTP_201_CREATED)
    
class EventPermissions(permissions.BasePermission):
    """
    Custom permission:
    - Admins can create, update, delete, and view all events.
    - Volunteers can only view upcoming events.
    - All authenticated users should be allowed to view events.
    """

    def has_permission(self, request, view):
        # If the user is trying to LIST events, allow them if they are authenticated
        if view.action in ['list', 'retrieve']:  # 'list' -> GET /events/, 'retrieve' -> GET /events/{id}/
            return request.user.is_authenticated  # Allow all logged-in users to see events

        # Only admins can create, update, or delete events
        return request.user.is_staff  # Only allow if user is an admin

    def has_object_permission(self, request, view, obj):
        # Admins can do anything, volunteers can only read
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return request.user.is_staff  # Only allow modifications if admin




class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [EventPermissions]
    queryset = Event.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']  # Enable search by event title

    @action(detail=False, methods=["get"], url_path="list", url_name="list")
    def list_events(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
        
    # ✅ DELETE Event by Name and Date
@action(detail=False, methods=['delete'], permission_classes=[permissions.IsAdminUser])
def delete_event(self, request):
    event_name = request.query_params.get("event_name")
    event_date = request.query_params.get("event_date")

    if not event_name or not event_date:
        return Response({"error": "Event name and date are required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        event = Event.objects.get(title=event_name, date=event_date)
        event.delete()
        return Response({"message": "Event deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)


# ✅ Volunteer Hours Summary (Admin Only)
class VolunteerHoursSummaryView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, *args, **kwargs):
        volunteers = User.objects.filter(is_staff=False).annotate(
            total_hours=Sum('volunteerhours__hours')
        )

        data = [
            {
                "id": v.id,
                "username": v.username,
                "email": v.email,
                "total_hours": v.total_hours or 0
            }
            for v in volunteers
        ]
        
        return Response(data)

class DeleteEventView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request):
        event_name = request.query_params.get("event_name")
        event_date = request.query_params.get("event_date")

        if not event_name or not event_date:
            return Response({"error": "Both event_name and event_date are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            events = Event.objects.filter(title=event_name, date=event_date)

            if not events.exists():
                return Response({"error": "No matching events found"}, status=status.HTTP_404_NOT_FOUND)

            deleted_count, _ = events.delete()
            return Response({"message": f"{deleted_count} event(s) deleted successfully"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    

# ✅ Admin: Mark Attendance
class MarkAttendanceView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        topic = request.data.get("topic")
        volunteer_hours = request.data.get("volunteer_hours", {})  # Dict of {username: hours}

        if not topic:
            return Response({"error": "Topic is required."}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(volunteer_hours, dict):
            return Response({"error": "Invalid format for volunteer_hours."}, status=status.HTTP_400_BAD_REQUEST)

        all_volunteers = User.objects.filter(is_staff=False)

        for volunteer in all_volunteers:
            username = volunteer.username
            if username in volunteer_hours:
                try:
                    hours = float(volunteer_hours[username])
                except ValueError:
                    return Response({"error": f"Invalid hours for {username}."}, status=status.HTTP_400_BAD_REQUEST)

                AttendanceRecord.objects.create(
                    volunteer=volunteer,
                    topic=topic,
                    online_hours=hours
                )

        return Response({"message": "Online hours logged successfully."}, status=status.HTTP_200_OK)


    
# ✅ Volunteer: View Attendance
class VolunteerAttendanceView(generics.ListAPIView):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AttendanceRecord.objects.filter(volunteer=self.request.user).order_by("-id")  # latest first



from .models import Event, VolunteerHours, AttendanceRecord

class VolunteerProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        hours_worked = VolunteerHours.objects.filter(volunteer=user).aggregate(total_hours=Sum('hours'))['total_hours'] or 0
        events_attended = Event.objects.filter(volunteers=user).values("title", "date")
        upcoming_events = Event.objects.filter(date__gte=date.today()).values("title", "date", "time", "description")
        
        attendance_records = AttendanceRecord.objects.filter(volunteer=user).order_by("-id").values(
            "topic", "online_hours"
        )

        phone_number = getattr(user.profile, "phone_number", None)

        response_data = {
            "username": user.username,
            "email": user.email,
            "phone_number": phone_number,
            "hours_worked": hours_worked,
            "events_attended": list(events_attended),
            "upcoming_events": list(upcoming_events),
            "attendance": [
                {
                    "topic": record["topic"],
                    "hours": float(record["online_hours"]) if record["online_hours"] is not None else 0
                }
                for record in attendance_records
            ],
        }

        return Response(response_data, status=200)

from rest_framework.decorators import api_view, permission_classes

@api_view(['POST'])
@permission_classes([IsAdminUser])
def reset_volunteer_password(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')

    if not username or not new_password:
        return Response({'error': 'Username and new password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password reset successfully.'})
    except User.DoesNotExist:
        return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)