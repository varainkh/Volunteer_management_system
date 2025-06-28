// src/pages/AssignHours.js

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';
import bgImage from '../assets/assign_hours.png';

const AssignHours = () => {
  const [username, setUsername] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [hours, setHours] = useState('');

  const token = localStorage.getItem('token');

  const handleAssign = async () => {
    try {
      const payload = {
        volunteer: username,    // ✅ match backend
        event: eventTitle,      // ✅ match backend
        event_date: eventDate,  // ✅ match backend
        hours: parseFloat(hours),
      };
  
      await axios.post(
        'http://127.0.0.1:8000/api/assign_hours/',
        payload,
        {
          headers: { Authorization: `Token ${token}` },
        }
      );    
  
      alert('Hours assigned successfully!');
      setUsername('');
      setEventTitle('');
      setEventDate('');
      setHours('');
    } catch (err) {
      console.error('Error assigning hours:', err.response?.data || err.message);
      alert('Failed to assign hours.');
    }
  };
  
  return (
    <Box
          sx={{
            minHeight: '100vh',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            pt : 6,
            px: 2,
          }}
        >
      <Container>
        <Box my={4}>
          <Typography variant="h4" gutterBottom>
           Assign Volunteer Hours
          </Typography>

          <Paper elevation={3} sx={{ padding: 3 }}>
            <TextField
            fullWidth
            label="Volunteer Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Event Title"
            margin="normal"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />

          <TextField
            fullWidth
            label="Event Date (YYYY-MM-DD)"
            margin="normal"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />

          <TextField
            fullWidth
            label="Number of Hours"
            type="number"
            margin="normal"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            disabled={!username || !eventTitle || !eventDate || !hours}
            sx={{ mt: 2 }}
          >
            Assign Hours
          </Button>
        </Paper>
      </Box>
    </Container>
  </Box>
  );
};

export default AssignHours;

