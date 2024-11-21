import BannerDelivery from "../components-delivery/banner/BannerDelivery";
import HeaderDelivery from "../components-delivery/header/HeaderDelivery";
import MainContent from "../components-delivery/maincontent/MainContent";
import "./delivery_staff.scss";

function DeliveryStaffHome() {
  return (
    <div className="background-delivery-container">
      <div className="background-delivery">
        <>
          <HeaderDelivery />
          <BannerDelivery />
          <MainContent />
        </>
      </div>
    </div>
  );
}

export default DeliveryStaffHome;
