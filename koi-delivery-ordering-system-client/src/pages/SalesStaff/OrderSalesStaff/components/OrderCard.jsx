import {
  Button,
  TextField,
  Box,
  Typography,
  ListItemIcon,

} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import "./sales_card.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dateTimeConvert from "../../../../components/utils";

// eslint-disable-next-line react/prop-types
const OrderCard = ({ orders, titleHeader }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewDetail = (order) => {
    navigate(`/sales-order-detail/${order.id}`, { state: order });
  };

  const filteredOrders = (orders || []).filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="order-container-sale">
      {/* Dynamic Header */}
      <Box style={{ marginLeft: "10px" }} display="flex" alignItems="center" mb={3} marginLeft={-4} color="blue">
        <ListItemIcon sx={{ color: "blue", marginRight: "-2%" }}>
          <ListIcon />
        </ListItemIcon>
        <Typography variant="h6">{titleHeader}</Typography>
      </Box>

      {/* Search Bar */}
      <Box display="flex" justifyContent="center" mb={7}>
        <TextField
          className="order-container-sale-search"
          label="Search by name"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{
            maxWidth: 450,
            backgroundColor: "#f5f5f5",
            boxSizing: "unset",
          }}
        />
      </Box>

      {/* Order List */}
      {filteredOrders && filteredOrders.length > 0 ? (
        <div className="order-container">
          <div className="order-card">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-item">
                <div className="order-content">
                  <h3 className="order-title">{order.name}</h3>
                  <p className="order-description">
                    Created Date: {dateTimeConvert(order.createdDate)}
                  </p>
                  <p className="order-description">
                    Expected Finish Date:{" "}
                    {dateTimeConvert(order.expectedFinishDate)}
                  </p>
                  <div className="order-footer">
                    <Button
                      variant="contained"
                      onClick={() => handleViewDetail(order)}
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default OrderCard;
