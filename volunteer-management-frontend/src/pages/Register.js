import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backgroundImage from '../assets/register.png';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false); // For popup

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone_number,
      });

      if (response.status === 201 || response.status === 200) {
        setSuccess("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        "Registration failed.";
      setError(errorMsg);
    }
  };

  // Popup handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        paddingTop: '20vh',        // 2-3 cm from top approx
      }}
    >
      <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem" }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#022347', fontSize: '2.5rem', fontWeight: 'bold' }}>
          Volunteer Registration
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Button to open instructions popup */}
        <Grid container justifyContent="center" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{ backgroundColor: '#FF8E00', color: 'white', width: '100%' }}
          >
            View Volunteer Instructions
          </Button>
        </Grid>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                type="tel"
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: '0.25cm' }}>
                Register
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Instructions Popup Dialog */}
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
      </Paper>
    </Container>
  );
};

export default Register;

