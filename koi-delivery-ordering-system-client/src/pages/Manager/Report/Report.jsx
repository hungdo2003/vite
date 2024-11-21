import { useEffect, useState } from "react";
import StatCard from "./components/Card/ReportCard";
import Table from "./components/Card/Table";
import { Box, Grid, Paper, Typography, TablePagination } from "@mui/material";
import { HelpCircle } from "lucide-react";
import { getOrdersByStatus } from "../../../utils/axios/order";
import { getAllDeliveryStaff } from "../../../utils/axios/deliveryStaff";
import {
  getDeliveryStaffReporById,
  getTotalOrders,
} from "../../../utils/axios/report";

const Report = () => {
  // State to hold the fetched data
  const [data, setData] = useState([]);
  const [dataTotalOrders, setDatadataTotalOrder] = useState([]);
  const [dataDeliveryReport, setDataDeliveryReport] = useState([]);
  const [dataRevenue, setDataRevenue] = useState([]);
  const [staffPage, setStaffPage] = useState(0);
  const [staffRowsPerPage, setStaffRowsPerPage] = useState(5);
  const [orderPage, setOrderPage] = useState(0);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const completedOrderStatus = 8;
        const responses = await getOrdersByStatus(completedOrderStatus);
        const prices = responses.map((order) => order.price);

        // Calculate total revenue
        const totalRevenue = prices.reduce((sum, price) => sum + price, 0);
        setDataRevenue(totalRevenue); // Set total revenue here
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await getTotalOrders([]);
        setDatadataTotalOrder(responses);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const deliveryStaff = await getAllDeliveryStaff();
        const deliveryStaffIds = deliveryStaff.map((staff) => staff.id);
        const responses = await Promise.all(
          deliveryStaffIds.map((id) => getDeliveryStaffReporById(id))
        );
        console.log(responses);
        setDataDeliveryReport(responses);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const responses = await Promise.all([
          getOrdersByStatus(7),
          getOrdersByStatus(8),
        ]);

        const combinedData = [
          ...responses[0].map((item) => ({ ...item, status: "Completed" })),
          ...responses[1].map((item) => ({ ...item, status: "Failed" })),
        ];

        setData(combinedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchData();
  }, []);

  // Pagination Handlers for Delivery Staff table
  const handleChangeStaffPage = (event, newPage) => {
    setStaffPage(newPage);
  };

  const handleChangeStaffRowsPerPage = (event) => {
    setStaffRowsPerPage(parseInt(event.target.value, 10));
    setStaffPage(0);
  };

  // Pagination Handlers for Orders table
  const handleChangeOrderPage = (event, newPage) => {
    setOrderPage(newPage);
  };

  const handleChangeOrderRowsPerPage = (event) => {
    setOrderRowsPerPage(parseInt(event.target.value, 10));
    setOrderPage(0);
  };

  return (
    <Box
      sx={{ minHeight: "100vh", padding: "32px", backgroundColor: "#f5f5f5" }}
    >
      <Box mb={8}>
        <Typography
          variant="h3"
          component="h1"
          color="textPrimary"
          gutterBottom
        >
          Delivery Dashboard
        </Typography>
      </Box>

      {/* Report Cards */}
      <Grid container spacing={3} mb={8}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Orders"
            value={`${dataTotalOrders.totalOrders} Orders`}
            icon={<HelpCircle className="w-5 h-5 text-blue-500" />}
            color="#bbdefb"
            textColor="#0d47a1"
            trend="down"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Completed"
            value={`${dataTotalOrders.completedOrders} Orders`}
            icon={<HelpCircle className="w-5 h-5 text-green-500" />}
            color="#c8e6c9"
            textColor="#2e7d32"
            trend="down"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Failed"
            value={`${dataTotalOrders.failedOrders} Orders`}
            icon={<HelpCircle className="w-5 h-5 text-red-500" />}
            color="#ffcdd2"
            textColor="#c62828"
            trend="up"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Total Revenue"
            value={`${Math.floor(dataRevenue).toLocaleString()} VND`} // Format revenue to two decimal places
            icon={<HelpCircle className="w-5 h-5 text-green-500" />}
            color="#c8e6c9"
            textColor="#2e7d32"
            trend="up"
          />
        </Grid>
      </Grid>

      {/* Tables */}
      <Grid container spacing={3}>
        {/* Delivery staff orders Table */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ p: 2, backgroundColor: "#1976d2", color: "white" }}
            >
              Delivery staff orders
            </Typography>
            <Table
              headers={["Delivery Staff", "Getting Orders", "Delivering Orders"]}
              data={dataDeliveryReport
                .slice(
                  staffPage * staffRowsPerPage,
                  staffPage * staffRowsPerPage + staffRowsPerPage
                )
                .map((item) => [
                  item.deliveryStaffName,
                  item.totalGettingOrders,
                  item.totalDeliveringOrders,
                ])}
            />
            {/* Pagination for Delivery Staff Table */}
            <TablePagination
              component="div"
              count={dataDeliveryReport.length}
              page={staffPage}
              onPageChange={handleChangeStaffPage}
              rowsPerPage={staffRowsPerPage}
              onRowsPerPageChange={handleChangeStaffRowsPerPage}
            />
          </Paper>
        </Grid>

        {/* Orders delivery details Table */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ p: 2, backgroundColor: "#1976d2", color: "white" }}
            >
              Orders Detail
            </Typography>
            <Table
              headers={[
                "Order ID",
                "Sender Address",
                "Destination Address",
                "Created Date",
                "Order Status",
              ]}
              data={data
                .slice(
                  orderPage * orderRowsPerPage,
                  orderPage * orderRowsPerPage + orderRowsPerPage
                )
                .map((item) => [
                  item.id,
                  item.senderAddress,
                  item.destinationAddress,
                  new Date(item.createdDate).toLocaleDateString(),
                  item.status,
                ])}
            />
            {/* Pagination for Orders Table */}
            <TablePagination
              component="div"
              count={data.length}
              page={orderPage}
              onPageChange={handleChangeOrderPage}
              rowsPerPage={orderRowsPerPage}
              onRowsPerPageChange={handleChangeOrderRowsPerPage}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Report;
