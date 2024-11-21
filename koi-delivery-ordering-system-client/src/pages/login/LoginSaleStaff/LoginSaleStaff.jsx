import { useNavigate } from "react-router-dom";
import { userLogin } from "../../../utils/axios/customer";
import { useAuth } from "../../../authentication/AuthProvider";
import "./LoginSaleStaff.scss";
import { useState } from "react";
import ToastUtil from "../../../components/toastContainer";
import { toast } from "react-toastify";
import { forgotPassword } from "../../../utils/axios/user";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";

const modalStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "40px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 250,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

function LoginSaleStaff() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const handleForgotPasswordOpen = () => setForgotPasswordModalOpen(true);
  const handleForgotPasswordClose = () => setForgotPasswordModalOpen(false);

  const navigate = useNavigate();
  const auth = useAuth();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function handleForgotPasswordSend() {
    const userType = 2;
    const response = await forgotPassword(forgotPasswordEmail, userType);
    if (response) {
      toast("We have send you a form to reset password through your email");
      setForgotPasswordEmail("");
      setForgotPasswordModalOpen(false);
    } else {
      toast("Unexpected error has been occurred");
    }
  }

  async function handleLogin(roleId) {
    try {
      const data = await userLogin(email, password, roleId);
      if (data) {
        auth.handleLogin(data);
        navigate("/sales-staff-home");
        toast("Login successfully");
      }
    } catch (error) {
      toast.error(error);
    }
  }

  const handleGoBack = () => {
    navigate("/login-customer");
  };

  return (
    <div className="login-sale-container">
      <ToastUtil />

      <Modal
        open={forgotPasswordModalOpen}
        onClose={handleForgotPasswordClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={modalStyle} style={{ padding: "40px 70px" }}>
          <TextField
            fullWidth
            type=""
            label="Input your email"
            onChange={(e) => setForgotPasswordEmail(e.target.value)}
          />
          {forgotPasswordEmail.length > 0 ? (
            <Button
              variant="outlined"
              onClick={() => handleForgotPasswordSend()}
            >
              <Typography>Confirm</Typography>
            </Button>
          ) : (
            <Button variant="outlined" disabled>
              <Typography>Confirm</Typography>
            </Button>
          )}
        </Box>
      </Modal>

      <div className="card">
        <h3 className="text-center">
          <strong>Sale Staff Login</strong>
        </h3>
        <div className="form-group">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Type your email"
            onChange={(e) => handleEmailChange(e)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => handlePasswordChange(e)}
            placeholder="Type your password"
          />
        </div>

        <div className="text-end">
          <a className="small-link" onClick={() => handleForgotPasswordOpen()}>
            Forgot password?
          </a>
        </div>

        <div className="btn">
          <button type="submit" onClick={() => handleLogin(2)}>
            Login
          </button>
        </div>

        <button className="back-button" onClick={() => handleGoBack()}>
          &#8592; Back to customer login
        </button>
      </div>
    </div>
  );
}

export default LoginSaleStaff;
