import { NavLink, useNavigate } from "react-router-dom";
import "./header.scss";
import { useEffect, useState } from "react";
import { Button, Popover } from "@mui/material";
import logo from "../../../../assets/logo.png";
import { useAuth } from "../../../../authentication/AuthProvider";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [customerUsername, setCustomerUsername] = useState("");
  const [userData, setUserData] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.handleLogout();
    window.location.reload();
  };



  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;
    setUserData(user);
    if (user) {
      setCustomerUsername(user.userData.username);
    }
  }, []);

  const handleOrderTracking = () => {
    navigate("/tracking-order");
  }

  const handleService = () => {
    const userRole = userData.userData.roleId;
    if (userRole) {
      switch (userRole) {
        case 1:
          navigate("/customer-home");
          break;
        case 2:
          navigate("/sales-staff-home");
          break;
        case 3:
          navigate("/delivery-staff-home");
          break;
        case 4:
          navigate("/admin/report");
          break;
        default:
          navigate("/");
      }
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="header-container">
      <div className="header-left">
        <div className="logo">
          <img src={logo} alt="Logo" style={{ width: "18vw", height: "8vh" }} />
        </div>
      </div>

      <div className="dashboard">
        <div className="service navigator" onClick={() => handleService()}>
          SERVICE
        </div>
        <div className="order-tracking navigator" onClick={() => handleOrderTracking()}>ORDER TRACKING</div>
        <div className="support navigator" onClick={() => navigate("/support-page")}>SUPPORT</div>
      </div>

      <div className="header-right">
        {customerUsername ? (
          <div className="welcome-section">
            <div className="">
              <span aria-describedby={id} onClick={handleClick}>
                Welcome, {customerUsername}
              </span>
              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Button onClick={handleLogout} sx={{ p: 2 }}>
                  Logout
                </Button>
              </Popover>
            </div>
            <div className="">
              <button className="contact-btn">
                <NavLink
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    fontSize: "1.3em ",
                  }}
                >
                  Contact
                </NavLink>
              </button>
            </div>
          </div>
        ) : (
          <>
            <button className="register-btn">
              <NavLink
                to={"/register"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "1.3em",
                }}
              >
                Register
              </NavLink>
            </button>
            <button className="login-btn">
              <NavLink
                to={"/login-customer"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "1.3em",
                }}
              >
                Log In
              </NavLink>
            </button>
            <button className="contact-btn">
              <NavLink
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontSize: "1.3em ",
                }}
              >
                Contact
              </NavLink>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
