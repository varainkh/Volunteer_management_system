from django.contrib import admin
from django.urls import path
from volunteers.views import (  
    RegisterView, CustomAuthToken, UserView, 
    EventListCreateView, VolunteerListView, 
    AssignVolunteerHoursView, VolunteerHoursSummaryView, 
    DeleteEventView, MarkAttendanceView, 
    VolunteerAttendanceView, VolunteerProfileView, 
    EventViewSet, reset_volunteer_password
)

urlpatterns = [
    # 🔐 Authentication
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomAuthToken.as_view(), name='token_obtain'),

    # 👤 User Info
    path('user/', UserView.as_view(), name='user'),

    # 📅 Event Management
    path('api/events/', EventListCreateView.as_view(), name='events'),  # List & Add Events
    path('api/events/list/', EventViewSet.as_view({'get': 'list_events'}), name='event-list'),  # Filtered Event List
    path('api/events/delete_event/', DeleteEventView.as_view(), name='delete_event'),  # Delete by title & date

    # 👥 Admin Panel APIs
    path('api/admin/volunteers/', VolunteerListView.as_view(), name='volunteers'),  # List/Search Volunteers
    path('api/assign_hours/', AssignVolunteerHoursView.as_view(), name='assign_hours'),  # Assign Hours
    path('api/admin/hours/summary/', VolunteerHoursSummaryView.as_view(), name='volunteers_summary'),  # Summary
    path('api/admin/attendance/mark/', MarkAttendanceView.as_view(), name='mark_attendance'),  # Mark Attendance
    path('api/admin/reset-password/', reset_volunteer_password),


    # 🙋 Volunteer (Self View)
    path('api/volunteer/attendance/', VolunteerAttendanceView.as_view(), name='volunteer_attendance'),  # Attendance View
    path('api/volunteer/profile/', VolunteerProfileView.as_view(), name='volunteer_profile'),  # Dashboard Profile
]
