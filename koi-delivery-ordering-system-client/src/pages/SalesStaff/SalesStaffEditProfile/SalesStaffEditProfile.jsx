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
  import { useNavigate, useOutletContext } from "react-router-dom";
  import { jwtDecode } from "jwt-decode";
  import { toast } from "react-toastify";
  import { PhotoCamera } from "@mui/icons-material";
  import { useAuth } from "../../../authentication/AuthProvider";
  import { getFileByFileId } from "../../../utils/axios/file";
  import ListIcon from "@mui/icons-material/List";
  import ToastUtil from "../../../components/toastContainer";
  import {
    getSalesStaffById,
    salesStaffUpdateProfile,
    salesStaffUpdateProfileImage,
  } from "../../../utils/axios/salesStaff";

  function SalesStaffEditProfile() {
    const { titleHeader } = useOutletContext();

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
    let salestaffId;
    if (token) {
      const customerInfo = jwtDecode(token);
      salestaffId = customerInfo.sub.substring(2);
    }

    useEffect(() => {
      async function fetchUserData() {
        try {
          const userData = JSON.parse(localStorage.getItem("userData"));
          setUser(userData);
          const customer = await getSalesStaffById(salestaffId);
          if (customer.file) {
            const imageResponse = await getFileByFileId(customer.file.id);
            const imgUrl = URL.createObjectURL(imageResponse);
            setImagePreview(imgUrl);
          }
        } catch (error) {
          toast.error(error);
        }
      }
      fetchUserData();
    }, []);

    const handleImageChange = (event) => {
      try {
        const file = event.target.files[0];
        if (file) {
          setSelectedImage(file);
          setImagePreview(URL.createObjectURL(file)); // Create a preview URL for the selected image
        }
      } catch (error) {
        toast.error(error);
      }
    };

    useEffect(() => {
      async function fetchUserData() {
        try {
          const userData = JSON.parse(localStorage.getItem("userData"));
          setUser(userData);
          setDisplayPhoneNumber(formatPhoneNumber(userData.phoneNumber));
        } catch (error) {
          toast.error(error);
        }
      }
      fetchUserData();
    }, []);

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
        setDisplayPhoneNumber(value); // Update displayPhoneNumber while typing
      }
    };

    const handleConfirmPasswordChange = (e) => {
      setConfirmPassword(e.target.value);
    };

    function handleSalesStaffHomeNavigation() {
      navigate("/sales-staff-home");
    }

    async function handleSubmit() {
      try {
        let response = null;
        const formattedPhoneNumber = user.phoneNumber.replace(/-/g, "");
        if (updatePassword === false) {
          response = await salesStaffUpdateProfile(
            salestaffId,
            user.email,
            user.username,
            formattedPhoneNumber,
            "" //If do not update password, set to empty string
          );
        } else {

          try{
          response = await salesStaffUpdateProfile(
            salestaffId,
            user.email,
            user.username,
            user.phoneNumber,
            formattedPhoneNumber
          );
        }catch(error){
            toast.error(error);
          }
        }

        if (selectedImage) {
          const imageResponse = await salesStaffUpdateProfileImage(
            salestaffId,
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
        toast.error( error);
      }
    }



    const handleUpdatePasswordState = () => {
      setUpdatePassword(!updatePassword);
    };

    return (
      user && (
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
            <Typography variant="h6">{titleHeader}</Typography>
          </Box>
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
                        onClick={() => handleSalesStaffHomeNavigation()}
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
        </Box>
      )
    );
  }

  export default SalesStaffEditProfile;
