import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const WaitingForConfirm = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f4f8',
                width: '100vw'
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: '50px',
                    textAlign: 'center',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{ fontWeight: 'bold', color: '#2c3e50', marginBottom: '20px' }}
                >
                    Confirm Your Email
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ color: '#7f8c8d', marginBottom: '30px', fontSize: '18px' }}
                >
                    We’ve sent a confirmation email to your inbox. Please check your email and follow the instructions to confirm your account.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                    <CircularProgress sx={{ color: '#3498db' }} />
                </Box>
                <Typography
                    variant="body2"
                    sx={{ color: '#95a5a6' }}
                >
                    If you don’t receive an email, check your spam folder or request a new confirmation link.
                </Typography>
                
                <Typography><Link to={"/"}>Back to home</Link></Typography>
            </Paper>
        </Box>
    )
}

export default WaitingForConfirm;