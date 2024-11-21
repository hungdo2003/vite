import { Box } from "@mui/material";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";

function BasicLayout() {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            {/* Header */}
            <Header />

            <Box sx={{ display: "flex", flex: 1 }}>
                {/* Main Content */}
                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 2, mt: "64px", display: "flex" }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default BasicLayout;