import { Box, Button, Divider } from "@mui/material";
import "./Header.scss"
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../../authentication/AuthProvider";
import { useState } from "react";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Input, Modal } from "antd";
import { managerUpdateProfile } from "../../../../utils/axios/manager";

function Header() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");
  const userData = token ? jwtDecode(token) : null;

  const handleLogout = () => {
    auth.handleLogout();
    navigate("/");
  }

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  }

  async function handleEditManagers() {
    const response = await managerUpdateProfile(
      userData.sub.substring(2),
      email, username, phoneNumber, password
    );
    if (response) {
      toast("Update profile successfully");
    } else {
      toast("Unexpected error has been occurred");
    }

    handleClose();
  }

  const handleClose = () => {
    setIsEditModalOpen(false);
    setEmail("");
    setUsername("");
    setPhoneNumber("");
  };

  return (
    <div>
      <Modal
        title={"Edit Profile"}
        visible={isEditModalOpen}
        onCancel={handleClose}
        onOk={() => handleEditManagers()}
        okButtonProps={{ disabled: !username || !email || !phoneNumber}} // Disable OK button if fields are empty
      >
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ marginBottom: 16 }}
        />
         <Input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: 16 }}
        />
      </Modal>
      <div className="header">
        <div className="header-left">
          {/* <h3>Dashboard</h3>   */}
          <h3>Koi Fish Deliveries</h3>
        </div>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: "1%",
            gap: "20px"
          }}
        >
          <Button onClick={() => handleEditProfile()} variant="contained">Edit Profile</Button>
          <Button onClick={() => handleLogout()} variant="contained">Logout</Button>
        </Box>
      </div>
      <Divider />
    </div>
  );
}

export default Header;
