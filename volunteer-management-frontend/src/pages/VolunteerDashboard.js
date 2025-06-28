import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axios';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const VolunteerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/api/volunteer/profile/', {
          headers: { Authorization: `Token ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 2 }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#022347',
          color: 'white',
          p: 2,
          borderRadius: 1,
          mb: 3,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '2.5rem' }}>
          Volunteer Dashboard
        </Typography>
        <Box sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}>
          <Button variant="outlined" color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* Volunteer Instructions Button */}
      <Box textAlign="center" mb={2}>
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{ backgroundColor: '#FF8E00', color: 'white' }}
        >
          View Code of Conduct & Certification Policy
        </Button>
      </Box>

      {/* Profile Info */}
      <Paper sx={{ p: 3, mb: 3, border: '2px solid', borderColor: '#FF8E00' }}>
        <Typography variant="h6" gutterBottom>Profile Info</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}><strong>Username:</strong> {profile.username}</Grid>
          <Grid item xs={12} sm={4}><strong>Email:</strong> {profile.email}</Grid>
          <Grid item xs={12} sm={4}><strong>Phone:</strong> {profile.phone_number || 'N/A'}</Grid>
        </Grid>
      </Paper>

      {/* Summary */}
      <Paper sx={{ p: 3, mb: 3, border: '2px solid', borderColor: '#FF8E00' }}>
        <Typography variant="h6" gutterBottom>Participation Summary</Typography>
        <Box sx={{ mb: 2 }}>
          <strong>Total Hours Worked:</strong> {profile.hours_worked}
        </Box>
        <Box>
          <Typography variant="subtitle1" gutterBottom>Events Attended:</Typography>
          <List>
            {profile.events_attended?.length > 0 ? (
              profile.events_attended.map((event, index) => (
                <ListItem key={index}>
                  <ListItemText primary={event.title} secondary={event.date} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No events attended yet." />
              </ListItem>
            )}
          </List>
        </Box>
      </Paper>

      {/* Upcoming Events */}
      <Paper sx={{ p: 3, mb: 3, border: '2px solid', borderColor: '#FF8E00' }}>
        <Typography variant="h6" gutterBottom>Upcoming Events</Typography>
        <List>
          {profile.upcoming_events?.length > 0 ? (
            profile.upcoming_events.map((event, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`${event.title} (${event.date} at ${event.time})`}
                  secondary={event.description}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No upcoming events." />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Online Work */}
      <Paper sx={{ p: 3, mb: 3, border: '2px solid', borderColor: '#FF8E00' }}>
        <Typography variant="h6" gutterBottom>Online Work</Typography>
        <List>
          {profile.attendance?.length > 0 ? (
            profile.attendance.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Topic: ${record.topic}`}
                  secondary={`Hours: ${record.hours}`}
                />
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No attendance records." />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Instructions Popup */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#022347', color: 'white' }}>
          Volunteer Code of Conduct & Certification Policy
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            At Prabhav Trust, we believe that true impact is created through compassion, commitment, and clear communication. Our volunteers are the heart of our movement, and we’re committed to providing a respectful, inclusive, and growth-oriented environment for everyone involved.
          </Typography>
          <Typography gutterBottom>
            To maintain transparency and accountability, we request all volunteers to adhere to the following rules and guidelines:
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>1. Monthly Hour Commitment</Typography>
          <Typography gutterBottom>
            • Volunteers must complete the following minimum hours each month: 10 hours of on-ground volunteering + online meetings + department-specific work (e.g., content creation, PR, fundraising, research, etc.)<br />
            • Timely submission of all departmental work is essential.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>2. Communication Protocol</Typography>
          <Typography gutterBottom>
            • All communication must be clear, respectful, and timely.<br />
            • Every message shared in official groups must be acknowledged.<br />
            • Any absence, delay, or issue in task execution must be communicated proactively.<br />
            • Open communication fosters trust—please don’t hesitate to reach out when in doubt.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>3. Social Media Engagement</Typography>
          <Typography gutterBottom>
            • Follow and engage with all official social media platforms.<br />
            • Mention <strong>@prabhavtrust</strong> in your Instagram bio.<br />
            • Social links: <a href="https://linktr.ee/PrabhavTrust" target="_blank" rel="noopener noreferrer">https://linktr.ee/PrabhavTrust</a>
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>4. Weekly Online Meetings</Typography>
          <Typography gutterBottom>
            • Attendance in weekly virtual team meetings is compulsory.<br />
            • Cameras must be on during meetings.<br />
            • Max two absences per month allowed with prior intimation.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>5. Respect & Grievance Redressal</Typography>
          <Typography gutterBottom>
            • Concerns must be addressed directly to the Founder or Coordinators.<br />
            • No negative commentary or bad-mouthing of the organization is tolerated.<br />
            • All concerns will be addressed sincerely and thoroughly.
          </Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>Certification & Letter of Appreciation Policy</Typography>
          <Typography gutterBottom>
            • Minimum 3 months of active and disciplined participation.<br />
            • At least 50 hours of combined work (on-ground + meetings + department tasks).<br />
            • Consistent professionalism and alignment with the Trust’s values.
          </Typography>

          <Typography sx={{ mt: 3 }}><strong>Thank you for being a part of the Prabhav family.</strong><br />— Team Prabhav Trust</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VolunteerDashboard;

