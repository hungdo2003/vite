import "./basic_header.scss";
import { Button } from "antd";
import logo from "../../../../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const handleHomeBack = () => {
        navigate("/");
    }

    return (
        <div className="basic-header-container">
            <div className="logo">
                <img
                    onClick={() => handleHomeBack()}
                    src={logo}
                    alt="Logo"
                    style={{ width: "180px"}}
                />
            </div>

            <div className="function">
                <Button style={{ backgroundColor: "white", color: "rgb(17, 17, 162)" }} onClick={() => navigate("/")}><strong>Home</strong></Button>
                <Button style={{ backgroundColor: "white", color: "rgb(17, 17, 162)" }} onClick={() => navigate("/support-page")}><strong>Support</strong></Button>
            </div>
        </div>
    );
}

export default Header;
