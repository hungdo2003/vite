import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getFishesByOrderId } from "../../../utils/axios/fish";
import { getOrderById } from "../../../utils/axios/order";
import dateTimeConvert from "../../../components/utils";
import { useLocation, useNavigate } from "react-router-dom";

const Invoice = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const query = useQuery();
  const orderId = query.get('orderId');
  const userId = query.get('userId');
  const username = query.get('username');
  const email = query.get('email');
  const phoneNumber = query.get('phoneNumber');

  const [fish, setFish] = useState([]);
  const [order, setOrder] = useState([]);

  const taxes = 0;
  const shipping = 0;
  const discount = 0;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getOrderById(orderId);
        setOrder(response);
      } catch (error) {
        console.error("Error fetching order data", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getFishesByOrderId(orderId);
        setFish(response);
      } catch (error) {
        console.error("Error fetching fish data", error);
      }
    }

    fetchData();
  }, []);

  const handleNavigateFeedback = () => {
    navigate('/contact-us', {
      state: {
        orderId,
        userId,
        username,
        email,
        phoneNumber
      }
    })
  }
  
  const totalFishPrice = fish.reduce((total, item) => total + item.price, 0);
  const totalAmount = totalFishPrice + taxes + shipping - discount;

  return fish && order && (
    <Box
      sx={{
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        maxWidth: "800px",
        width: "100%",
        margin: "0 auto",
        transform: "scale(0.8)",
      }}
    >
      <Box sx={{ textAlign: "left", mb: 2 }}>
        <img
          src="./src/assets/logo.png"
          alt="Company Logo"
          style={{ width: "23%" }}
        />
      </Box>

      {/* Invoice Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            Koi Invoice
          </Typography>
          <Typography variant="body2" color="text.secondary">
            RECEIPT # {order.id} •{" "}
            {new Date(order.createdDate).toLocaleDateString()}
          </Typography>
        </Box>

        {/*  Customer Details */}
        <Box sx={{ ml: 10 }}>
          <Typography variant="h6" sx={{ display: "inline" }}>
            INVOICE TO:
          </Typography>
          <Typography>Sender address:</Typography>
          <Typography>Destination address: </Typography>
          <Typography>Order created date:</Typography>
        </Box>

        <Box sx={{ textAlign: "left", ml: -3 }}>
          <Typography
            variant="h6"
            sx={{ display: "inline", fontWeight: "bold", mb: 3 }}
          >
            {order.name}
          </Typography>

          <Typography>{order.senderAddress}</Typography>
          <Typography>{order.destinationAddress}</Typography>

          <Typography>
            {new Date(order.createdDate).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Items Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="right">Age</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Weight</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fish.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: "50%",
                      width: 20,
                      height: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.id}
                  </Box>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell align="right">{item.age}</TableCell>
                <TableCell align="right">{item.size}</TableCell>
                <TableCell align="right">{item.weight}</TableCell>
                <TableCell align="right">${item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Invoice Total */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ width: "48%" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {order.description}
          </Typography>
        </Box>
        <Box sx={{ width: "30%" }}>
          {[
            { label: "Subtotal", value: totalFishPrice },
            { label: "Taxes", value: taxes },
            { label: "Shipping", value: shipping },
            { label: "Discount", value: discount },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography>{item.label}</Typography>
              <Typography>${item.value.toFixed(2)}</Typography>
            </Box>
          ))}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              p: 1,
              borderRadius: 1,
              mt: 1,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              TOTAL
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              ${totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">PAYMENT DUE DATE</Typography>
          <Typography>{dateTimeConvert(order.finishDate)}</Typography>
        </Box>

        <Box>
          <Button variant="contained" onClick={() => handleNavigateFeedback()}>Please give us your feedback</Button>
        </Box>
      </Box>

      {/* Terms and Conditions */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">TERMS AND CONDITIONS</Typography>
        <Typography variant="body2" color="text.secondary">
          Payment must be made within 30 days from the invoice date. Any
          disputes must be addressed within 15 days. Shipping times may vary
          depending on location. For more information, contact our support team
          at hungdqse170515@fpt.edu.vn
        </Typography>
      </Box>

      {/* Footer */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6">THANK YOU FOR YOUR PURCHASING!</Typography>
        <Typography>
          For inquiries, contact us at 0868394782 or email us at
          hungdqse170515@fpt.edu.vn
        </Typography>
      </Box>
    </Box>
  );
};

export default Invoice;
