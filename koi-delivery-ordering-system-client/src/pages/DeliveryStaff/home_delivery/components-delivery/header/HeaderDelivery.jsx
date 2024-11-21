import { Image } from "antd";
import "./HeaderDelivery.scss";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../authentication/AuthProvider";

function HeaderDelivery() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleHomeNavigate = () => {
    navigate("/");
  }

  const handleOrderHomePage = () => {
    navigate("/delivery-order-home");
  }

  const handleLogout = () => {
    auth.handleLogout();
    handleHomeNavigate();
  }

  return (
    <div className="header-delivery">
      <div className="logo">
        <Image onClick={() => handleHomeNavigate()} src="./src/assets/logo.png" />
      </div>

      <div className="function">
        <button>
          <strong onClick={() => handleOrderHomePage()}>Delivery Staff Order Page</strong>
        </button>
      </div>

      <div className="logout-delivery">
        <button onClick={() => handleLogout()}>Log out</button>
      </div>
    </div>
  );
}

export default HeaderDelivery;
