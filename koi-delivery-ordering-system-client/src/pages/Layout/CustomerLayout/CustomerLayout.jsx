import { Box, Typography } from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function CustomerLayout() {
    const [titleHeader, setTitleHeader] = useState();

    const handlePageHeader = (e) => {
        setTitleHeader(e);
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh"
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

            <Box sx={{
                display: "flex",
                flex: 1,
                pt: "10%",
            }}>
                {/* Fixed Sidebar */}
                <Box
                    sx={{
                        top: "12%",
                        left: "1%",
                        width: "20%",
                        height: "90%",
                    }}
                >
                    <Sidebar pageHeaderInfo={e => handlePageHeader(e)} />
                </Box>

                {/* Main Content */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        mt: -5,
                        ml: 5
                    }}
                >
                    {/* Adding the OrderList title with an icon */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2, color: "blue" }} >
                        {titleHeader !== "Edit" && (
                            <>
                                <ListIcon sx={{ mr: 0.5, ml: 1 }} />
                                <Typography variant="h6" >
                                    Order List {titleHeader && titleHeader !== "" && (
                                        <>{">"} {titleHeader}</>
                                    )}
                                </Typography>
                            </>
                        )}
                    </Box>

                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default CustomerLayout;
