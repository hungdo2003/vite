import FishInfo from "./pages/FishInfo";
import { useLocation } from "react-router-dom";

function CustomerCreateFish() {
  const location = useLocation();
  const { state } = location;
  return (
    <div>
      <div className="body-container">
        <FishInfo order={state} />
      </div>
    </div>
  );
}

export default CustomerCreateFish;
