import  { useState } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  IconButton,
  Stack,
  Grid,
  TextField,
  Button,
  MenuItem,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import { BackwardOutlined } from "@ant-design/icons";
const theme = createTheme({
  palette: {
    primary: {
      main: "#f97316",
    },
    background: {
      default: "#f9fafb",
    },
  },
});

const faqs = [
  {
    question: "How do I track my delivery?",
    answer:
      "You can track your delivery by clicking the tracking link in your confirmation email or by entering your order number on our tracking page.",
  },
  {
    question: "What are your delivery hours?",
    answer: "We deliver 7 days a week from 10:00 AM to 10:00 PM local time.",
  },
  {
    question: "How can I change my delivery address?",
    answer:
      "To change your delivery address, please contact our support team at least 2 hours before the scheduled delivery time.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer full refunds for orders cancelled before the restaurant starts preparing your food. For other issues, please contact our support team.",
  },
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    issue: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          "input[type=text]": {
            boxSizing: "content-box",
          },
        }}
      >
        {/* Header Section */}
        <Box sx={{ bgcolor: "white", boxShadow: 1, mb: 4 }}>
          <Container maxWidth="100%">
            <Box
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "5%",
              }}
            >
              {/* Back Button */}
              <Button
                size="medium"
                onClick={() => navigate(-1)}
                startIcon={<BackwardOutlined />}
                style={{
                  marginRight: "16px",
                  backgroundColor: "#f97316",
                  color: "white",
                  border: "none",
                }}
              >
                Back
              </Button>

              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                color="primary"
              >
                KOI Delivery Support
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mb: 6, flex: 1 }}>
          <Grid container spacing={4}>
            {/* Contact Form */}
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  Contact Support
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Order Number"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        select
                        label="Issue Type"
                        name="issue"
                        value={formData.issue}
                        onChange={handleChange}
                      >
                        <MenuItem value="">Select an issue</MenuItem>
                        <MenuItem value="delivery">Delivery Problem</MenuItem>
                        <MenuItem value="order">Order Issue</MenuItem>
                        <MenuItem value="technical">Technical Support</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={4}
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        sx={{ mt: 2 }}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* FAQs */}
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <Paper elevation={3} sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  component="h2"
                  gutterBottom
                  color="primary"
                >
                  Frequently Asked Questions
                </Typography>
                <Box sx={{ mt: 3 }}>
                  {faqs.map((faq, index) => (
                    <Accordion key={index} sx={{ mb: 1 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Immediate Assistance Section */}
          <Box sx={{ mt: 8, textAlign: "center" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Need Immediate Assistance?
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Our support team is available 24/7
            </Typography>
            <Stack
              direction="row"
              spacing={4}
              justifyContent="center"
              sx={{ mt: 3 }}
            >
              <IconButton
                href="tel:1800KOIDEL"
                color="primary"
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <PhoneIcon />
                <Typography variant="caption">086834782</Typography>
              </IconButton>
              <IconButton
                href="mailto:support@koidel.com"
                color="primary"
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <EmailIcon />
                <Typography variant="caption">
                  koideliveringsystemswp@gmail.com
                </Typography>
              </IconButton>
            </Stack>
          </Box>
        </Container>

        {/* Footer */}
        <Box sx={{ bgcolor: "grey.900", mt: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="body2" color="grey.500">
                © 2024 KOI Delivery. All rights reserved.
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
