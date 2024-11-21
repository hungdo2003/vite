import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import "./Contact.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { createFeedback } from "../../../utils/axios/rating";
import { toast } from "react-toastify";
import ToastUtil from "../../../components/toastContainer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2196f3",
    },
    secondary: {
      main: "#4caf50",
    },
  },
});

function ContactPage() {
  const [rating, setRating] = useState(0); // State to store the selected rating
  const [hover, setHover] = useState(0); // State to track hover over stars
  const [comment, setComment] = useState(""); // State to track hover over stars

  const location = useLocation();
  const { state } = location;

  const handleClick = (index) => {
    setRating(index); // Set rating when a star is clicked
  };

  const handleMouseEnter = (index) => {
    setHover(index); // Update hover state on mouse enter
  };

  const handleMouseLeave = () => {
    setHover(0); // Reset hover state on mouse leave
  };

  const handleSubmit = async () => {
    const response = await createFeedback(state.orderId, state.userId, comment, rating);
    if (response) {
      toast("Thank you for your feedback");
    } else {
      toast("Unexpected error has been occurred");
    }
  }

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #87ceeb, #87ceeb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
        }}
      >
        <ToastUtil />
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ overflow: "hidden" }}>
            <Grid container>
              <Grid
                item
                xs={12}
                md={6}
                sx={{ bgcolor: "primary.main", color: "white", p: 4 }}
              >
                <Typography variant="h4" gutterBottom>
                  Contact Info
                </Typography>
                <Typography variant="body1" paragraph>
                  If you have any questions about ordering and delivering koi
                  fish, please contact us for advice.
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    TP.HCM
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      34 Street Name, City Name, United States
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">086834782</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      hngdqse170515@fpt.ed.vn
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Ha Noi
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      34 Street Name, City Name, United States
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">086834782</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      hngdqse170515@fpt.ed.vn
                    </Typography>
                  </Box>
                </Box>

                <div>
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      style={{
                        fontSize: '2rem',
                        cursor: 'pointer',
                        color: hover >= star || rating >= star ? 'gold' : 'gray',
                      }}
                      onClick={() => handleClick(star)}
                      onMouseEnter={() => handleMouseEnter(star)}
                      onMouseLeave={handleMouseLeave}
                    >
                      ★
                    </span>
                  ))}
                  <p>Selected Rating: {rating}</p>
                </div>

                <Link to="/">Back to home page</Link>
              </Grid>

              <Grid item xs={12} md={6} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                  SEND US A MESSAGE
                </Typography>
                <TextField
                  fullWidth
                  type=""
                  label="Name"
                  variant="outlined"
                  margin="normal"
                  value={state.username}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type=""
                  variant="outlined"
                  margin="normal"
                  value={state.email}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  variant="outlined"
                  type=""
                  margin="normal"
                  value={state.phoneNumber}
                />
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  type=""
                  margin="normal"
                  multiline
                  rows={4}
                  onChange={(e) => handleCommentChange(e)}
                />
                {rating === 0 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    disabled
                  >
                    Send Message
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={() => handleSubmit()}
                  >
                    Send Message
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default ContactPage;
