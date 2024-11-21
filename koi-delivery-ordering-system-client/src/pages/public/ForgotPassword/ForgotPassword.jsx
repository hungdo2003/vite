import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ToastUtil from "../../../components/toastContainer";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import { resetPassword } from "../../../utils/axios/user";

function ForgotPassword() {
    const location = useLocation();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [userType, setUserType] = useState();

    const useQuery = () => {
        return new URLSearchParams(location.search);
    };

    const query = useQuery();

    useEffect(() => {
        const encodedEmail = query.get('email');
        const userTypeResult = query.get('userType');

        console.log(encodedEmail);
        console.log(userTypeResult);
        // Check if either parameter is missing and navigate back to "/"
        if (encodedEmail && userTypeResult) {
            setEmail(encodedEmail);
            setUserType(userTypeResult);
        } else {
            navigate("/");
        }
    }, []);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast("Passwords do not match.");
            return;
        }

        try {
            const response = await resetPassword(email, userType, password);
            if (response) {
                toast("Reset password successfully")
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (err) {
            console.log(err);
            toast("Unexpected error has been occurred");
        }
    };

    return (
        <div>
            <ToastUtil />
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100vh"
                sx={{ bgcolor: '#f9f9f9', padding: 4 }}
            >
                <Typography variant="h4" gutterBottom>
                    Reset Password
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Enter your email and new password to reset your account.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%', maxWidth: 400 }}>
                    <TextField
                        fullWidth
                        type="password"
                        label="New Password"
                        variant="outlined"
                        value={password}
                        onChange={handlePasswordChange}
                        sx={{ mb: 3 }}
                        required
                    />
                    <TextField
                        fullWidth
                        type="password"
                        label="Confirm New Password"
                        variant="outlined"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        sx={{ mb: 3 }}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Reset Password
                    </Button>
                </Box>
            </Box>
        </div>
    )
}

export default ForgotPassword;