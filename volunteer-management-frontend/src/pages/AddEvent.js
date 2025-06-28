import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Container,
} from '@mui/material';
import axios from 'axios';
import dayjs from 'dayjs';
import bgImage from '../assets/add_event.png'; // ✅ Make sure this path is correct

const AddEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const formattedDate = dayjs(formData.date, ['DD-MM-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD');

    const eventData = {
      ...formData,
      date: formattedDate,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://127.0.0.1:8000/api/events/',
        eventData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      setSuccessMessage('Event added successfully!');
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
      });
    } catch (error) {
      console.error('Error response:', error.response?.data);
      const detail = error.response?.data?.detail || JSON.stringify(error.response?.data);
      setErrorMessage(`Failed to add event: ${detail}`);
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
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ padding: 4, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
          <Typography variant="h5" align="center" gutterBottom>
            Add New Event
          </Typography>

          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              required
              margin="normal"
              value={formData.title}
              onChange={handleChange}
            />
            <TextField
              label="Date"
              name="date"
              type="date"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
            />
            <TextField
              label="Time"
              name="time"
              type="time"
              fullWidth
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.time}
              onChange={handleChange}
            />
            <TextField
              label="Location"
              name="location"
              fullWidth
              required
              margin="normal"
              value={formData.location}
              onChange={handleChange}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={formData.description}
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: '#001F3F', color: 'white' }}
            >
              ADD EVENT
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddEvent;
