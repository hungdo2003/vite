import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import default_avatar from "../../../assets/default-avatar.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  getCustomerById,
  userUpdateProfile,
  userUpdateProfileImage,
} from "../../../utils/axios/customer";
import { toast } from "react-toastify";
import { PhotoCamera } from "@mui/icons-material";
import { useAuth } from "../../../authentication/AuthProvider";
import { getFileByFileId } from "../../../utils/axios/file";
import ToastUtil from "../../../components/toastContainer";

function CustomerEditProfile() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(default_avatar);
  const [updatePassword, setUpdatePassword] = useState(false);
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState("");

  const auth = useAuth();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let customerId;
  if (token) {
    const customerInfo = jwtDecode(token);
    customerId = customerInfo.sub.substring(2);
  }

  useEffect(() => {
    async function fetchUserData() {
      const userData = JSON.parse(localStorage.getItem("userData"));
      setUser(userData);
      setDisplayPhoneNumber(formatPhoneNumber(userData.phoneNumber));
      const customer = await getCustomerById(customerId);
      if (customer.file) {
        const imageResponse = await getFileByFileId(customer.file.id);
        const imgUrl = URL.createObjectURL(imageResponse);
        setImagePreview(imgUrl);
      }
    }
    fetchUserData();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleBlur = () => {
    setDisplayPhoneNumber(formatPhoneNumber(user.phoneNumber));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    if (name === "phoneNumber") {
      setDisplayPhoneNumber(value); 
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  function handleCustomerHomeNavigation() {
    navigate("/customer-home");
  }

  async function handleSubmit() {
    let response = null;
    const formattedPhoneNumber = user.phoneNumber.replace(/-/g, "");
    console.log(user);
    if (updatePassword === false) {
      response = await userUpdateProfile(
        customerId,
        user.email,
        user.username,
        formattedPhoneNumber,
        "" //If do not update password, set to empty string
      );
    } else {
      response = await userUpdateProfile(
        customerId,
        user.email,
        user.username,
        formattedPhoneNumber,
        user.password
      );
    }

    if (selectedImage) {
      const imageResponse = await userUpdateProfileImage(
        customerId,
        selectedImage
      );
      if (imageResponse) {
        toast(imageResponse);
      }
    }

    if (response) {
      toast(response);
      auth.handleLogout();
      navigate("/");
    } else {
      toast("Unexpected error has been occurred");
    }
  }

  const handleUpdatePasswordState = () => {
    setUpdatePassword(!updatePassword);
  };

  return (
    user && (
      <Container maxWidth="md" style={{ marginTop: "120px" }}>
        <ToastUtil />
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Grid container spacing={4}>
            {/* Avatar Section */}
            <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
              <Avatar
                alt={user.username}
                src={imagePreview}
                sx={{ width: 180, height: 180, margin: "0 auto" }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleImageChange}
                />
                <PhotoCamera />
              </IconButton>
              <Button></Button>
              <Button
                variant="outlined"
                size="small"
                onClick={handleUpdatePasswordState}
              >
                Update password
              </Button>
            </Grid>

            {/* Form Section */}
            <Grid item xs={12} sm={8}>
              <Typography variant="h5" component="h1" gutterBottom>
                Edit Profile
              </Typography>
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                      type=""
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      type="email"
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone Number"
                      name="phoneNumber"
                      value={displayPhoneNumber}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type=""
                      fullWidth
                      required
                    />
                  </Grid>
                  {updatePassword && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          label="Password"
                          name="password"
                          onChange={handleChange}
                          type="password"
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Confirm Password"
                          name="confirm Password"
                          onChange={handleConfirmPasswordChange}
                          type="password"
                          fullWidth
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
                <Box sx={{ mt: 3, display: "flex", gap: "16px" }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleCustomerHomeNavigation()}
                    fullWidth
                  >
                    Cancel
                  </Button>
                  {user.email &&
                  user.username &&
                  user.phoneNumber &&
                  (updatePassword
                    ? confirmPassword === user.password
                    : true) ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      fullWidth
                    >
                      Save Changes
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      fullWidth
                      disabled
                    >
                      Save Changes
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    )
  );
}

export default CustomerEditProfile;
