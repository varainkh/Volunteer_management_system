import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableContainer,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  OutlinedInput,
} from '@mui/material';

const AdminVolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordResetMessage, setPasswordResetMessage] = useState('');

  const fetchVolunteers = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/volunteers/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const dataWithFlags = response.data.map((vol) => ({
        ...vol,
        showAllEvents: false,
        showAllMeetings: false,
      }));
      setVolunteers(dataWithFlags);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleOpenResetDialog = (username) => {
    setSelectedUsername(username);
    setNewPassword('');
    setPasswordResetMessage('');
    setOpenResetDialog(true);
  };

  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
    setSelectedUsername('');
    setNewPassword('');
  };

  const handleResetPassword = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/admin/reset-password/',
        {
          username: selectedUsername,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setPasswordResetMessage(response.data.message || 'Password reset successfully.');
      setTimeout(() => {
        handleCloseResetDialog();
      }, 1000);
    } catch (error) {
      console.error('Password reset error:', error);
      setPasswordResetMessage('Error resetting password.');
    }
  };

  const filteredVolunteers = volunteers.filter((volunteer) =>
    volunteer.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        List of Volunteers
      </Typography>
      <TextField
        label="Search Volunteers by Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Total Hours</strong></TableCell>
              <TableCell><strong>Events Attended</strong></TableCell>
              <TableCell><strong>Online Work</strong></TableCell>
              <TableCell><strong>Phone Number</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredVolunteers.map((vol, index) => (
              <TableRow key={index}>
                <TableCell>{vol.username}</TableCell>
                <TableCell>{vol.email}</TableCell>
                <TableCell>{vol.total_hours}</TableCell>
                <TableCell>
                  {vol.events_attended.length === 0 ? (
                    '—'
                  ) : (
                    <>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        {(vol.showAllEvents
                          ? vol.events_attended
                          : vol.events_attended.slice(0, 3)
                        ).map((event, i) => (
                          <li key={i}>{event}</li>
                        ))}
                      </ul>
                      {vol.events_attended.length > 3 && (
                        <Button
                          size="small"
                          style={{ textTransform: 'none', padding: 0 }}
                          onClick={() => {
                            const updated = [...volunteers];
                            updated[index].showAllEvents = !vol.showAllEvents;
                            setVolunteers(updated);
                          }}
                        >
                          {vol.showAllEvents ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell>
                  {vol.meetings_attended.length === 0 ? (
                    '—'
                  ) : (
                    <>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        {(vol.showAllMeetings
                          ? vol.meetings_attended
                          : vol.meetings_attended.slice(0, 3)
                        ).map((meeting, i) => (
                          <li key={i}>
                            {meeting.topic} – {meeting.online_hours} hrs
                          </li>
                        ))}
                      </ul>
                      {vol.meetings_attended.length > 3 && (
                        <Button
                          size="small"
                          style={{ textTransform: 'none', padding: 0 }}
                          onClick={() => {
                            const updated = [...volunteers];
                            updated[index].showAllMeetings = !vol.showAllMeetings;
                            setVolunteers(updated);
                          }}
                        >
                          {vol.showAllMeetings ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell>{vol.phone_number || '—'}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenResetDialog(vol.username)}
                  >
                    Reset Password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Password Reset Dialog */}
      <Dialog open={openResetDialog} onClose={handleCloseResetDialog}>
        <DialogTitle>Reset Password for {selectedUsername}</DialogTitle>
        <DialogContent>
          <InputLabel>New Password</InputLabel>
          <OutlinedInput
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="dense"
          />
          {passwordResetMessage && (
            <Typography color="error" variant="body2" style={{ marginTop: '0.5rem' }}>
              {passwordResetMessage}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetDialog}>Cancel</Button>
          <Button onClick={handleResetPassword} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminVolunteerList;





