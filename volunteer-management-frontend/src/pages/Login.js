import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import backgroundImage from '../assets/login_page.png'; // ✅ Make sure this path is correct

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/token/', formData);

      const { token, user_id, username, is_staff } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('username', username);
      localStorage.setItem('is_staff', is_staff);
      localStorage.setItem('role', is_staff ? 'admin' : 'volunteer');

      navigate(is_staff ? '/admin/dashboard' : '/volunteer/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start', // Align to top
        paddingTop: '6vh',        // 2-3 cm from top approx
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 3,
          width: 500,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#022347', fontSize: '2.5rem', fontWeight: 'bold' }} >
          PRABHAVi
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
  fullWidth
  label="Username"
  name="username"
  value={formData.username}
  onChange={handleChange}
  margin="normal"
  required
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FF8E00', // ✅ Border color
        borderWidth: '2px',
      },
    },
  }}
/>

<TextField
  fullWidth
  label="Password"
  name="password"
  type="password"
  value={formData.password}
  onChange={handleChange}
  margin="normal"
  required
  sx={{
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#FF8E00',
        borderWidth: '2px',
      },
    },
  }}
/>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Register here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;


