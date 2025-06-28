// src/pages/AdminDashboard.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button
} from '@mui/material';

import GroupIcon from '@mui/icons-material/Group';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import bgImage from '../assets/admin_area.png'; // ✅ adjust the path if needed

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const adminOptions = [
    {
      title: "Volunteer's List",
      icon: <GroupIcon sx={{ fontSize: 50 }} />,
      route: '/admin/volunteers',
    },
    {
      title: 'Add Event',
      icon: <AddBoxIcon sx={{ fontSize: 50 }} />,
      route: '/admin/events/add',
    },
    {
      title: "Event's List",
      icon: <ListAltIcon sx={{ fontSize: 50 }} />,
      route: '/admin/events',
    },
    {
      title: 'Assign Volunteer Hours',
      icon: <AccessTimeIcon sx={{ fontSize: 50 }} />,
      route: '/admin/hours/assign',
    },
    {
      title: 'Assign Online Work',
      icon: <CheckBoxIcon sx={{ fontSize: 50 }} />,
      route: '/admin/attendance/mark',
    },
  ];

  return (
    <Box
      sx={{
        mt: 0,
        px: 2,
        py: 6,
        minHeight: '100vh',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logout Button */}
      <Box display="flex" justifyContent="flex-end" mb={25}>
        
        <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
      </Box>

      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: 'white',
          textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        }}
      >
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {adminOptions.map((option, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                height: '100%',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-3px)',
                  transition: '0.3s ease',
                },
              }}
              onClick={() => navigate(option.route)}
            >
              <IconButton color="primary" sx={{ fontSize: 60 }}>
                {option.icon}
              </IconButton>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                {option.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;



