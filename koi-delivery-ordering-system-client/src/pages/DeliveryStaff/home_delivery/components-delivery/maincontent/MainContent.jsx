import "./MainContent.scss";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { getOrdersByStatus } from "../../../../../utils/axios/order";
import dayjs from "dayjs";

function MainContent() {
  const [ordersAccepted, setOrdersAccepted] = useState([]);
  const [ordersConfirmed, setOrdersConfirmed] = useState([]);

  const fetchOrderAccepted = async () => {
    try {
      const response = await getOrdersByStatus(2);
      console.log("Order Accepted Response:", response);

      if (response) {
        console.log("Order Accepted Data:", response);
        setOrdersAccepted(response);
      } else {
        console.warn("Không có dữ liệu trong response cho Order Accepted.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng Accepted:", error);
    }
  };

  const fetchOrderConfirmed = async () => {
    try {
      const response = await getOrdersByStatus(5);
      console.log("Order Confirmed Response:", response);

      if (response) {
        console.log("Order Confirmed Data:", response);
        setOrdersConfirmed(response);
      } else {
        console.warn("Không có dữ liệu trong response cho Order Confirmed.");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng Confirmed:", error);
    }
  };

  useEffect(() => {
    fetchOrderAccepted();
    fetchOrderConfirmed();
  }, []);

  const columns = [
    {
      title: "Tracking Id",
      dataIndex: "trackingId",
      key: "trackingId",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (createdDate) => dayjs(createdDate).format("YYYY/MM/DD hh:mm"),// Định dạng ngày tháng năm
    },
    {
      title: "Expected Finish Date",
      dataIndex: "expectedFinishDate",
      key: "expectedFinishDate",
      render: (expectedFinishDate) => dayjs(expectedFinishDate).format("YYYY/MM/DD"), // Định dạng ngày tháng năm
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    // Thêm các cột khác nếu cần
  ];

  return (
    <div className="orders-container">
      <div className="History">
        <h2>Order List</h2>
      </div>

      <div className="order-data">
        <div className="orders-accepted">
          <h2>Accepted Orders</h2>
          <Table
            dataSource={ordersAccepted}
            columns={columns}
            rowKey="trackingId"
            loading={ordersAccepted.length === 0} // Hiển thị trạng thái loading
          />
        </div>

        <div className="orders-confirmed">
          <h2>Confirmed Orders</h2>
          <Table
            dataSource={ordersConfirmed}
            columns={columns}
            rowKey="trackingId"
            loading={ordersConfirmed.length === 0} // Hiển thị trạng thái loading
          />
        </div>
      </div>
    </div>
  );
}

export default MainContent;
