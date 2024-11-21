import { useEffect, useState } from 'react';
import { Menu, MenuItem, Box, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./sales_header.scss";
import { Button } from "antd";
import logo from "../../../../../assets/logo.png";
import default_avatar from "../../../../../assets/default-avatar.jpg";
import { useAuth } from "../../../../../authentication/AuthProvider";
import { jwtDecode } from 'jwt-decode';
import { getFileByFileId } from '../../../../../utils/axios/file';
import { getSalesStaffById } from '../../../../../utils/axios/salesStaff';

function Header() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const auth = useAuth();
    const [imagePreview, setImagePreview] = useState(default_avatar);

    const token = localStorage.getItem("token");
    let customerId;
    if (token) {
        const customerInfo = jwtDecode(token);
        customerId = customerInfo.sub.substring(2);
    }

    useEffect(() => {
        async function fetchUserData() {
            const salesStaff = await getSalesStaffById(customerId);
            if (salesStaff.file) {
                const imageResponse = await getFileByFileId(salesStaff.file.id);;
                const imgUrl = URL.createObjectURL(imageResponse);
                setImagePreview(imgUrl);
            }
            // const imageResponse = await getFileByFileId();
        }
        fetchUserData();
    }, [])

    const handleHomeBack = () => {
        navigate("/");
    }

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        setAnchorEl(null);
        auth.handleLogout();
        navigate("/");
    }

    const handleOpenEditProfile = () => {
        navigate("/sales-staff-edit-profile")
    }

    return (
        <div className="sales-header-container">
            <div className="logo">
                <img
                    onClick={() => handleHomeBack()}
                    src={logo}
                    alt="Logo"
                    style={{ width: "16vw" }}
                />
            </div>

            <div className="function">
                <Button style={{ fontSize: "1em", height: "45px", backgroundColor: "white", color: "rgb(17, 17, 162)" }} onClick={() => navigate("/")}><strong>Home</strong></Button>
                <Button style={{ fontSize: "1em", height: "45px", backgroundColor: "white", color: "rgb(17, 17, 162)" }} onClick={() => navigate("/support-page")}><strong>Support</strong></Button>
            </div>

            <div className="logo">
                <Box sx={{ ml: 2 }}>
                    <Avatar
                        src={imagePreview}
                        onClick={handleMenuOpen}
                        alt="avatar"
                        style={{ width: "5vw", height: "9vh", marginRight: "30px" }}
                    />
                    <Menu
                        style={{ marginTop: "40px" }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleOpenEditProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>

            </div>
        </div>
    );
}

export default Header;
