import { Box } from "@mui/material";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function SalesStaffLayout() {
  const [titleHeader, setTitleHeader] = useState("");

  useEffect(() => {
    const storedTitle = localStorage.getItem("titleHeader");
    if (storedTitle) {
      setTitleHeader(storedTitle);
    }
  }, []);

  // Update local storage only if titleHeader changes
  const handlePageHeader = (title) => {
    if (title !== titleHeader) {
      setTitleHeader(title);
      localStorage.setItem("titleHeader", title);
    }
  };

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
          <Sidebar pageHeaderSales={handlePageHeader} />

        </Box>

        {/* Main Content */}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Outlet context={{ titleHeader }} />
        </Box>
      </Box>
    </Box>
  );
}

export default SalesStaffLayout;
