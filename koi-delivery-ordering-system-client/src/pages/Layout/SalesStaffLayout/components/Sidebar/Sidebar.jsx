/* eslint-disable react/prop-types */
import { Avatar, Divider, ListItem, ListItemText, styled, Typography } from "@mui/material";
import { List } from "antd";
import "./sales_sidebar.scss";
import { useEffect, useState } from "react";
import default_avatar from "../../../../../assets/default-avatar.jpg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { getFileByFileId } from "../../../../../utils/axios/file";
import { getSalesStaffById } from "../../../../../utils/axios/salesStaff";

const InfoHeader = styled(Typography)(() => ({
  margin: "0px",
  color: "#252c6d",
  fontSize: "12px",
}));

function Sidebar({ pageHeaderSales }) {
  const [imagePreview, setImagePreview] = useState(default_avatar);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let salesStaffInfo;
  let salesStaffId;
  if (token) {
    salesStaffInfo = jwtDecode(token);
    salesStaffId = salesStaffInfo.sub.substring(2);
  }

  useEffect(() => {
    async function fetchUserData() {
      const salesStaff = await getSalesStaffById(salesStaffId);
      if (salesStaff.file) {
        const imageResponse = await getFileByFileId(salesStaff.file.id);;
        const imgUrl = URL.createObjectURL(imageResponse);
        setImagePreview(imgUrl);
      }
      // const imageResponse = await getFileByFileId();
    }
    fetchUserData();
  }, [])


  const handleOpenPosted = () => {
    navigate('/posted-order-sales-staff')
    pageHeaderSales("Posted Orders");
  }

  const handleOpenReceived = () => {
    navigate('/received-order-sales-staff')
    pageHeaderSales("Received Orders");
  }

  const handleOpenHome = () => {
    navigate('/sales-staff-home');
    pageHeaderSales("Home");
  }

  const handleOpenEditProfile = () => {
    navigate("/sales-staff-edit-profile")
    pageHeaderSales("Edit Profile");
  }

  return (
    <div className="sidebar-body-sales">
      <div className="image-container">
        <Avatar
          src={imagePreview}
          alt="avatar"
          style={{ width: "7vw", height: "14vh" }}
        />
      </div>
      <Typography style={{ textAlign: "center" }}>Sales Staff</Typography>
      <div className="profile">
        <InfoHeader>Username</InfoHeader>
        <Typography>{salesStaffInfo.userData.username}</Typography>
        <InfoHeader>Email</InfoHeader>
        <Typography>{salesStaffInfo.userData.email}</Typography>
      </div>

      <div className="list-function">
        <List>
          <ListItem className="button">
            <ListItemText
              primary="Home"
              onClick={() => handleOpenHome()}
            />
          </ListItem>
          <ListItem className="button">
            <ListItemText
              primary="Profile"
              onClick={() => handleOpenEditProfile()}
            />
          </ListItem>
          <Divider style={{ marginBottom: "5%" }}>Orders</Divider>

          <ListItem className="button">
            <ListItemText
              primary="Posted Orders"
              onClick={handleOpenPosted}
            />
          </ListItem>
          <ListItem className="button">
            <ListItemText
              primary="Received Orders"
              onClick={handleOpenReceived}
            />
          </ListItem>
          <ListItem className="button">
            <ListItemText
              primary="Post News"
              onClick={() => navigate("/news-sales-staff")}
            />
          </ListItem>
          <ListItem className="button">
            <ListItemText
              primary="News"
              onClick={() => navigate("/news")}
            />
          </ListItem>
          {/* <ListItem className="button">
            <ListItemText primary="Navigate To Wallet Page" />
          </ListItem>
          <ListItem className="button">
            <ListItemText primary="Contact Support" />
          </ListItem> */}
        </List>
      </div>
    </div>
  );
}

export default Sidebar;
