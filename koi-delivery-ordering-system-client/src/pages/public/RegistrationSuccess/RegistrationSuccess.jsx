import { Typography, Button, Box, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const RegistrationSuccess = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/login-customer');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: '40px',
          textAlign: 'center',
          borderRadius: '12px',
          backgroundColor: '#fff',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircleIcon sx={{ fontSize: '4rem', color: '#4caf50' }} />
        </Box>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Registration Successful!
        </Typography>
        <Typography variant="body1" sx={{ color: '#7f8c8d', marginBottom: '30px' }}>
          Your account has been successfully created. You can now use your account to log in and access the platform.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGoHome}
          sx={{ padding: '10px 20px', fontSize: '16px' }}
        >
          Go to Loginpage
        </Button>
      </Paper>
    </Box>
  );
};

export default RegistrationSuccess;
