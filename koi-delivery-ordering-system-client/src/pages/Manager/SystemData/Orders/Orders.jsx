import { useEffect, useState } from "react";
import { Table, Typography, Input, Row, Col, Select, Space, Dropdown, Menu } from "antd";
import { getAllOrders } from "../../../../utils/axios/order";
import ToastUtil from "../../../../components/toastContainer";
import { Button, Divider } from "@mui/material";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { Title } = Typography;
const { Search } = Input;

function Orders() {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders for display
  const [searchTrackingId, setSearchTrackingId] = useState(""); // For search by order ID
  const [searchOrderName, setSearchOrderName] = useState(""); // For search by customer name
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(-1);

  const navigate = useNavigate();

  const statusMapping = {
    0: "Draft",
    1: "Posted",
    2: "Order Accepted",
    3: "Order Getting",
    4: "Order Received",
    5: "Order Confirmed",
    6: "Delivering",
    7: "Complete",
    8: "Failed",
  };

  const handleSelectStatusChange = (e) => {
    setSelectedOrderStatus(e);
  }

  const handleFilter = () => {
    let filtered = orders;

    if (searchTrackingId !== "") {
      filtered = filtered.filter((order) =>
        order.trackingId?.includes(searchTrackingId.toUpperCase())
      );
    }

    if (searchOrderName !== "") {
      filtered = filtered.filter((order) =>
        order.name?.toLowerCase().includes(searchOrderName.toLowerCase())
      );
    }

    if (selectedOrderStatus !== -1) {
      filtered = filtered.filter((order) =>
        order.orderStatus == selectedOrderStatus);
    }
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    async function fetchGettingOrder() {
      const response = await getAllOrders();
      if (response) {
        setOrders(response);
        setFilteredOrders(response); // Set initial filtered orders to all orders
      }
    }

    fetchGettingOrder();
  }, []);
  useEffect(() => {
    handleFilter();
  }, [searchTrackingId, searchOrderName, orders, selectedOrderStatus]); // Re-filter when search terms or orders change

  const handleViewFishList = (fishes) => {
    console.log(fishes);
    navigate(`/admin/fish`, {
      state: fishes,
    });
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Created date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Sender address",
      dataIndex: "senderAddress",
      key: "senderAddress",
    },
    {
      title: "Destination address",
      dataIndex: "destinationAddress",
      key: "destinationAddress",
    },
    {
      title: "Expected date",
      dataIndex: "expectedFinishDate",
      key: "expectedFinishDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Tracking id",
      dataIndex: "trackingId",
      key: "trackingId",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Order status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => statusMapping[status],
    }, {
      title: 'Action',
      key: 'action',
      dataIndex: "id",
      render: (record) => (
        <Space size="middle">
          <Dropdown
            overlay={
              <Menu style={{ display: "flex", flexDirection: "column" }}>
                <Divider />
                <Button onClick={() => handleViewFishList(record)}>View Fishes</Button>
              </Menu>
            }
            trigger={['click']}
          >
            <MoreOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ToastUtil />
      <div className="dashboard-info">
        <Title level={2} style={{ marginTop: 0, color: "#01428E" }}>
          Orders
        </Title>
      </div>

      <Row gutter={16} style={{ marginBottom: "16px", paddingLeft: "5%", marginRight: "0px" }}>
        <Col span={8}>
          <Search
            placeholder="Tracking ID"
            value={searchTrackingId}
            onChange={(e) => setSearchTrackingId(e.target.value)}
            allowClear
            enterButton="Search"
          />
        </Col>
        <Col span={8}>
          <Search
            placeholder="Name"
            value={searchOrderName}
            onChange={(e) => setSearchOrderName(e.target.value)}
            allowClear
            enterButton="Search"
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Filter by order's status"
            value={selectedOrderStatus}
            onChange={handleSelectStatusChange}
            style={{ width: "50%" }}
            allowClear
          >
            <Option value={-1}>Select</Option>
            {Object.entries(statusMapping).map((status, index) => (
              <Option key={index} value={status[0]}>{status[1]}</Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ pageSize: 15 }}
        rowKey="id"
        style={{ marginTop: "25px", marginRight: "10px", marginLeft: "10px" }}
      />
    </div>
  );
}

export default Orders;
