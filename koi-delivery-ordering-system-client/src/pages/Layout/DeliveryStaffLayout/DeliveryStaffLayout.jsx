import { Box } from "@mui/material";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function DeliveryStaffLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Fixed Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "10%",
          zIndex: 1000,
        }}
      >
        <Header />
      </Box>

      <Box sx={{ display: "flex", flex: 1, pt: "10%" }}>
        {/* Fixed Sidebar */}
        <Box
          sx={{
            top: "14%",
            left: 0,
            width: "20%",
            height: "90%",
          }}
        >
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box component="main" sx={{
          flexGrow: 1,
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default DeliveryStaffLayout;