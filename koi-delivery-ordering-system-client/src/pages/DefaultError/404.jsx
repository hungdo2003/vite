import { Image } from "antd";
import Logo from "../../assets/logo.png";
import MainSlider from "../../components/MainSlider";
import "./404.scss";
import { useNavigate } from "react-router-dom";

function Page404() {
  const navigate = useNavigate();

  return (
    <div className="page404-container">
      <div className="logo">
        <Image onClick={() => navigate("/")} src="./src/assets/logo.png" />
      </div>

      <div className="main-content">
        <div className="content1" ><strong>404</strong></div>
        <div className="content2" ><strong>Sorry, we couldn't find this page</strong></div>
      </div>

      <div className="main-slider">
        <MainSlider />
      </div>
    </div>
  );
}

export default Page404;
