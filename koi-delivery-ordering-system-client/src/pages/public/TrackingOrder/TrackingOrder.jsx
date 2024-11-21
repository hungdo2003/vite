import {
  Card,
  Divider,
  Input,
  Steps,
  Descriptions,
  Tag,
  Col,
  Row,
  Layout,
  Space,
  Button,
  Modal,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Package2, Truck, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getOrderByTrackingId } from "../../../utils/axios/order";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getFileByFileId } from "../../../utils/axios/file";
import ImageSlider from "../../../components/ImageSlider";
import dateTimeConvert from "../../../components/utils";

// Constants for order statuses
const orderStatusLabels = {
  1: "Order Placed",
  2: "Accepted",
  3: "In Transit",
  4: "Received",
  5: "Confirmed",
  6: "Delivering",
  7: "Completed",
  8: "Failed",
};

// Function to determine the current step based on order status
const getCurrentStep = (status) => {
  switch (status) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 5;
    case 6:
      return 6;
    case 7:
      return 7;
    case 8:
      return 8;
    default:
      return 0;
  }
};

// Function to get the appropriate color for each status
const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return "orange";
    case 2:
      return "blue";
    case 3:
      return "purple";
    case 4:
      return "cyan";
    case 5:
      return "geekblue";
    case 6:
      return "gold";
    case 7:
      return "green";
    case 8:
      return "red"; // Failed status, typically red
    default:
      return "gray";
  }
};

// Main TrackingOrder Component
const TrackingOrder = () => {
  const [searchValue, setSearchValue] = useState("");
  const [orderData, setOrderData] = useState(null);
  const navigate = useNavigate();
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const handleHomeBack = () => {
    navigate("/");
  };
  const handleSearch = async () => {
    if (searchValue) {
      setHasSearched(true); // Set to true once a search is performed
      try {
        const order = await getOrderByTrackingId(searchValue);

        if (order) {
          setOrderData(order);
        } else {
          setOrderData(null);
          toast.error("Tracking ID not found");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }
  };

  const renderOrderProgress = () => {
    const currentStep = getCurrentStep(orderData.orderStatus);

    const stepsData = [
      { title: "Draft", icon: <Package2 className="w-5 h-5" /> },
      { title: "Order Placed", icon: <Package2 className="w-5 h-5" /> },
      {
        title: "Accepted",
        icon: <CheckCircle2 className="w-5 h-5" />,
        description:
          currentStep === 2 ? (
            <span
              style={{ opacity: 0.5 }}
            >{` ${orderData.staffType}: ${orderData.staffName}`}</span>
          ) : null,
      },
      {
        title: "In Transit",
        icon: <Truck className="w-5 h-5" />,
        description:
          currentStep === 3 ? (
            <span
              style={{ opacity: 0.85 }}
            >{` ${orderData.staffType}: ${orderData.staffName}`}</span>
          ) : null,
      },
      {
        title: "Received",
        icon: <CheckCircle2 className="w-5 h-5" />,
        description:
          currentStep === 4 ? (
            <span
              style={{ opacity: 0.85 }}
            >{` ${orderData.staffType}: ${orderData.staffName}`}</span>
          ) : null,
      },
      {
        title: "Confirmed",
        icon: <CheckCircle2 className="w-5 h-5" />,
        description:
          currentStep === 5 ? (
            <span
              style={{ opacity: 0.85 }}
            >{` ${orderData.staffType}: ${orderData.staffName}`}</span>
          ) : null,
      },
      {
        title: "Delivering",
        icon: <Truck className="w-5 h-5" />,
        description:
          currentStep === 6 ? (
            <span
              style={{ opacity: 0.85 }}
            >{` ${orderData.staffType}: ${orderData.staffName}`}</span>
          ) : null,
      },
      {
        title: "Completed",
        icon: <CheckCircle2 className="w-5 h-5" />,
        description:
          currentStep === 7 ? (
            <span
              style={{ opacity: 0.85 }}
            >{` ${orderData.staffType}: ${orderData.staffName}`}</span>
          ) : null,
      },
    ];

    return (
      <Steps
        current={currentStep}
        items={stepsData.map((step, index) => ({
          ...step,
          status:
            index < currentStep
              ? "finish"
              : index === currentStep
              ? "process"
              : "wait",
        }))}
        progressDot={(dot, { status }) => (
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full
                ${
                  status === "finish" || status === "process"
                    ? `bg-${getStatusColor(orderData.orderStatus)}-500`
                    : "bg-gray-200"
                }`}
          >
            {dot}
          </span>
        )}
      />
    );
  };

  async function handleFishClick(order) {
    setSelectedFish(order.fish);
    setIsModalOpen(true);

    try {
      if (Array.isArray(order.fish) && order.fish.length > 0) {
        const imagePromises = order.fish.map(async (fish) => {
          const fileId = fish.file.id;
          const imageResponse = await getFileByFileId(fileId);
          return URL.createObjectURL(
            new Blob([imageResponse], { type: "image/jpeg" })
          );
        });

        const imageUrls = await Promise.all(imagePromises);
        setImagePreviews(imageUrls);
      }
    } catch (error) {
      console.error("Error fetching fish images:", error);
    }
  }
  console.log(selectedFish);

  const handleCloseModal = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setIsModalOpen(false);
    setSelectedFish(null);
    setImagePreviews([]);
  };
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "Not Available";

    const cleaned = ("" + phoneNumber).replace(/\D/g, "");

    if (cleaned.length === 10) {
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      return match ? `${match[1]}-${match[2]}-${match[3]}` : phoneNumber;
    }

    return phoneNumber;
  };

  return (
    <>
      <Layout>
        <Header style={{ padding: 0, background: "#fff" }}>
          <Row justify="space-between" align="middle">
            {/* Left Side: Logo */}
            <Col>
              <img
                onClick={handleHomeBack}
                src="./src/assets/logo.png"
                alt="Logo"
                style={{
                  height: "40px",
                  width: "auto",
                  cursor: "pointer",
                  marginLeft: "2%",
                  marginTop: "2%",
                }}
              />
            </Col>

            {/* Center: Search bar */}
            <Col flex="auto">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Input.Search
                  size="middle"
                  placeholder="Enter tracking number"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onSearch={handleSearch}
                  style={{ width: "35%" }}
                  enterButton="Search"
                />
              </div>
            </Col>
          </Row>
        </Header>
      </Layout>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            {orderData ? (
              <>
                <>
                  <div style={{ marginBottom: "25px", marginTop: "25px" }}>
                    {orderData.orderStatus === 8 ? (
                      <div className="text-center" style={{ color: "#ff4d4f" }}>
                        Order failed. <br />
                        Reason: {orderData.cancelReason || "Unknown"}.
                      </div>
                    ) : (
                      renderOrderProgress()
                    )}
                  </div>

                  <Card className="bg-gray-50">
                    <Descriptions
                      title={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Space>
                            <span>Order Information</span>
                            <Tag color={getStatusColor(orderData.orderStatus)}>
                              {orderStatusLabels[orderData.orderStatus]}
                            </Tag>
                          </Space>

                          <Button
                            type="primary"
                            onClick={() => handleFishClick(orderData)}
                          >
                            View Fish
                          </Button>
                        </div>
                      }
                      bordered
                      column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 2 }} // Two items per row
                    >
                      <Descriptions.Item label="Sender">
                        {orderData.nameSender}
                      </Descriptions.Item>
                      <Descriptions.Item label="Receiver">
                        {orderData.nameReceiver}
                      </Descriptions.Item>
                      <Descriptions.Item label="Created Date">
                        {dateTimeConvert(orderData.createdDate)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Expected Delivery">
                        {dateTimeConvert(orderData.expectedFinishDate)}
                      </Descriptions.Item>

                      {orderData.orderStatus === 7 && (
                        <Descriptions.Item label="Finish Date">
                          {dateTimeConvert(orderData.finishDate)}
                        </Descriptions.Item>
                      )}

                      <Descriptions.Item label="Status">
                        {orderData.proccessType}
                      </Descriptions.Item>

                      <Descriptions.Item label="Order Location">
                        {orderData.orderLocation}
                      </Descriptions.Item>
                    </Descriptions>

                    {/* Staff Information Section */}
                    <Divider />

                    {/* Staff Information Title Row */}
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    >
                      Staff Information
                    </span>

                    <div
                      style={{
                        border: "1px solid #e8e8e8",
                        padding: "20px",
                        borderRadius: "8px",
                        backgroundColor: "#fafafa",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {/* Staff Information Header Row */}
                      <Row gutter={16} style={{ marginBottom: "10px" }}>
                        <Col span={8}>
                          <strong>Staff Name</strong>
                        </Col>
                        <Col span={8}>
                          <strong>Staff Contact</strong>
                        </Col>
                        <Col span={8}>
                          <strong>Staff Role</strong>
                        </Col>
                      </Row>

                      {/* Staff Information Data Row */}
                      <Row gutter={16}>
                        <Col span={8}>
                          {orderData.staffName || "Not Available"}
                        </Col>
                        <Col span={8}>
                          {formatPhoneNumber(orderData.staffNumber) ||
                            "Not Available"}
                        </Col>
                        <Col span={8}>
                          {orderData.staffType || "Not Available"}
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </>
              </>
            ) : hasSearched ? (
              <div className="text-center" style={{ color: "#ff4d4f" }}>
                No order found. Please enter a valid tracking number.
              </div>
            ) : (
              <div className="text-center">
                Enter tracking number to view order details.
              </div>
            )}
          </Card>
        </div>
      </div>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={handleCloseModal}
        style={{ maxWidth: "80vw", top: 20 }}
      >
        {selectedFish ? (
          <div>
            <div className="slider-container" style={{ marginTop: "16px" }}>
              {<ImageSlider fishInfo={selectedFish} images={imagePreviews} />}
            </div>
          </div>
        ) : (
          "No fish selected"
        )}
      </Modal>
    </>
  );
};

export default TrackingOrder;
