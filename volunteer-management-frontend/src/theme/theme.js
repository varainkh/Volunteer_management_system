import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#031B40', // dark navy
    },
    secondary: {
      main: '#FF8C1A', // orange
    },
    info: {
      main: '#97C9F9', // sky blue
    },
    background: {
      default: '#F5F7FA',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
