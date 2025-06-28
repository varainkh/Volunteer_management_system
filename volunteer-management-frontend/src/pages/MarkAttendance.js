import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import bgImage from '../assets/online_work.png';

const AssignOnlineHours = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [selectedUsernames, setSelectedUsernames] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [onlineHours, setOnlineHours] = useState({});
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    const fetchVolunteers = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/admin/volunteers/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setVolunteers(res.data);
      } catch (err) {
        console.error("Failed to fetch volunteers", err);
      }
    };
    fetchVolunteers();
  }, []);

  const handleCheckboxChange = (username) => {
    setSelectedUsernames((prev) =>
      prev.includes(username)
        ? prev.filter((name) => name !== username)
        : [...prev, username]
    );
  };

  const handleOnlineHoursChange = (username, hours) => {
    setOnlineHours((prev) => ({
      ...prev,
      [username]: hours,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResponseMessage("");

    const volunteerHours = {};

    selectedUsernames.forEach((username) => {
      const hours = onlineHours[username];
      if (hours) {
        volunteerHours[username] = hours;
      }
    });

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/admin/attendance/mark/", {
        topic: taskName, // "topic" instead of "task_name"
        volunteer_hours: volunteerHours, // "volunteer_hours" instead of "online_hours"
      }, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
      });

      setResponseMessage(res.data.message || "Online hours assigned successfully!");
    } catch (err) {
      console.error(err);
      setResponseMessage("Failed to assign online hours");
    }

    setLoading(false);
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
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
        <Typography variant="h5" gutterBottom>
          Assign Online Hours
        </Typography>

        <TextField
          label="Task Name"
          fullWidth
          margin="normal"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <Typography variant="h6" style={{ marginTop: "2rem" }}>
          Volunteers
        </Typography>

        <Grid container spacing={2} style={{ maxHeight: "300px", overflowY: "auto" }}>
          {volunteers.map((volunteer) => (
            <Grid item xs={12} sm={6} key={volunteer.id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedUsernames.includes(volunteer.username)}
                    onChange={() => handleCheckboxChange(volunteer.username)}
                    color="primary"
                  />
                }
                label={volunteer.username}
              />
              {selectedUsernames.includes(volunteer.username) && (
                <TextField
                  label="Online Hours"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={onlineHours[volunteer.username] || ""}
                  onChange={(e) =>
                    handleOnlineHoursChange(volunteer.username, e.target.value)
                  }
                />
              )}
            </Grid>
          ))}
        </Grid>

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Hours"}
          </Button>
        </Box>

        {responseMessage && (
          <Typography
            variant="body1"
            color={responseMessage.includes("success") ? "green" : "error"}
            style={{ marginTop: "1rem" }}
          >
            {responseMessage}
          </Typography>
        )}
      </Paper>
    </Container>
    </Box>
  );
};

export default AssignOnlineHours;


