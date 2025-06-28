// src/components/Navbar.js
import React from 'react';
import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from '../assets/logo.png';

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#0A1D3A', // dark navy blue
});

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  alignItems: 'center',
});

const Logo = styled('img')({
  height: 40,
  marginRight: 10,
  borderRadius: '50%',
  backgroundColor: 'white',
});

const Navbar = () => {
  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Logo src={logo} alt="Logo" />
        <Typography variant="h6" component="div">
          Prabhav Volunteer System
        </Typography>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
