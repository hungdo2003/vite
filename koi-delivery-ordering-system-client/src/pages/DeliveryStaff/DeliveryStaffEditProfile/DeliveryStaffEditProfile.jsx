import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  ListItemIcon,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import default_avatar from "../../../assets/default-avatar.jpg";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { PhotoCamera } from "@mui/icons-material";
import { useAuth } from "../../../authentication/AuthProvider";
import { getFileByFileId } from "../../../utils/axios/file";
import ToastUtil from "../../../components/toastContainer";
import ListIcon from "@mui/icons-material/List";
import {
  deliveryStaffUpdateProfile,
  deliveryStaffUpdateProfileImage,
  getDeliveryStaffById,
} from "../../../utils/axios/deliveryStaff";

function DeliveryStaffEditProfile() {
  const [delivery_staff, setUser] = useState({
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
  let deliveryStaffId;
  if (token) {
    const deliveryStaffInfo = jwtDecode(token);
    deliveryStaffId = deliveryStaffInfo.sub.substring(2);
  }

  useEffect(() => {
    async function fetchUserData() {
      const deliveryStaffData = JSON.parse(localStorage.getItem("userData"));
      setUser(deliveryStaffData);
      setDisplayPhoneNumber(formatPhoneNumber(deliveryStaffData.phoneNumber));
      const deliveryStaff = await getDeliveryStaffById(deliveryStaffId);
      if (deliveryStaff.file) {
        const imageResponse = await getFileByFileId(deliveryStaff.file.id);
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
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
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
    setDisplayPhoneNumber(formatPhoneNumber(delivery_staff.phoneNumber));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
    if (name === "phoneNumber") {
      setDisplayPhoneNumber(value); // Update displayPhoneNumber while typing
    }
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  function handleDeliveryStaffHomeNavigation() {
    navigate("/delivery-order-home");
  }

  async function handleSubmit() {
    try {
      let response = null;
      const formattedPhoneNumber = delivery_staff.phoneNumber.replace(/-/g, "");
      if (updatePassword === false) {
        response = await deliveryStaffUpdateProfile(
          deliveryStaffId,
          delivery_staff.email,
          delivery_staff.username,
          formattedPhoneNumber,
          "" //If do not update password, set to empty string
        );
      } else {
        response = await deliveryStaffUpdateProfile(
          deliveryStaffId,
          delivery_staff.email,
          delivery_staff.username,
          formattedPhoneNumber,
          delivery_staff.password
        );
      }

      if (selectedImage) {
        const imageResponse = await deliveryStaffUpdateProfileImage(
          deliveryStaffId,
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
    } catch (error) {
      toast.error(error);
    }
  }

  const handleUpdatePasswordState = () => {
    setUpdatePassword(!updatePassword);
  };

  return (
    delivery_staff && (
      <Box>
        <Box
          style={{ marginLeft: "10px" }}
          display="flex"
          alignItems="center"
          mb={3}
          marginLeft={-4}
          color="blue"
        >
          <ListItemIcon sx={{ color: "blue", marginRight: "-2%" }}>
            <ListIcon />
          </ListItemIcon>
          <Typography variant="h6">Edit Profile</Typography>
        </Box>

        <Container maxWidth="md" style={{ marginTop: "120px" }}>
          <ToastUtil />
          <Paper elevation={3} sx={{ padding: 4 }}>
            <Grid container spacing={4}>
              {/* Avatar Section */}
              <Grid item xs={12} sm={4} sx={{ textAlign: "center" }}>
                <Avatar
                  alt={delivery_staff.username}
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
                        value={delivery_staff.username}
                        onChange={handleChange}
                        type="email"
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        name="email"
                        value={delivery_staff.email}
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        type="email"
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
                            type="email"
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            label="Confirm Password"
                            name="confirm Password"
                            onChange={handleConfirmPasswordChange}
                            type="email"
                            fullWidth
                          />
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Box sx={{ mt: 3, display: "flex", gap: "16px" }}>
                    <Button
                      variant="outlined"
                      onClick={() => handleDeliveryStaffHomeNavigation()}
                      fullWidth
                    >
                      Cancel
                    </Button>
                    {delivery_staff.email &&
                    delivery_staff.username &&
                    delivery_staff.phoneNumber &&
                    (updatePassword
                      ? confirmPassword === delivery_staff.password
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
      </Box>
    )
  );
}

export default DeliveryStaffEditProfile;
