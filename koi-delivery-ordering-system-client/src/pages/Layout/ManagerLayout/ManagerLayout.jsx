import "./manager_layout.scss";
import Header from "./Header/Header";
import Sidebar from "./Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function ManagerLayout() {
  return (
    <div className="admin-container">
      <Sidebar/>

      <div className="admin-container-right">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default ManagerLayout;
