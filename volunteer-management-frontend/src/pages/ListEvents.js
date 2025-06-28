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
  IconButton,
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';

const ListEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Format date to YYYY-MM-DD
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchEvents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/events/list/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const dataWithFlags = response.data.map((event) => ({
        ...event,
        showAllVolunteers: false,
      }));

      setEvents(dataWithFlags);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (title, date) => {
  const token = localStorage.getItem('token');
  const formattedDate = new Date(date).toISOString().split('T')[0];

  try {
    const response = await axios.delete('http://127.0.0.1:8000/api/events/delete_event/', {
      headers: {
        Authorization: `Token ${token}`,
      },
      params: {
        event_name: title,
        event_date: formattedDate,
      },
    });

    // Filter out the deleted event from the state
    setEvents((prev) =>
      prev.filter((e) => e.title !== title || new Date(e.date).toISOString().split('T')[0] !== formattedDate)
    );
  } catch (error) {
    console.error('Error deleting event:', error.response?.data || error.message);
    alert('Failed to delete the event');
  }
};


  useEffect(() => {
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        List of Events
      </Typography>

      <TextField
        label="Search Events by Title"
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
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Time</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Volunteers</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredEvents.map((event, index) => (
              <TableRow key={index}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.time}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>
                  {event.volunteers.length === 0 ? (
                    '—'
                  ) : (
                    <>
                      <ul style={{ paddingLeft: '1.2rem', margin: 0 }}>
                        {(event.showAllVolunteers
                          ? event.volunteers
                          : event.volunteers.slice(0, 5)
                        ).map((vol, i) => (
                          <li key={i}>{vol}</li>
                        ))}
                      </ul>
                      {event.volunteers.length > 5 && (
                        <Button
                          size="small"
                          style={{ textTransform: 'none', padding: 0 }}
                          onClick={() => {
                            const updated = [...events];
                            updated[index].showAllVolunteers = !event.showAllVolunteers;
                            setEvents(updated);
                          }}
                        >
                          {event.showAllVolunteers ? 'Show less' : 'Show more'}
                        </Button>
                      )}
                    </>
                  )}
                </TableCell>

                <TableCell>
                  <IconButton
                    onClick={() => handleDelete(event.title, event.date)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>
    </div>
  );
};

export default ListEvents;





