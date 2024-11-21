import { useEffect, useState } from "react";
import { Table, Typography, Button, Modal } from "antd";
import { getAllFishes, getFishesByOrderId } from "../../../../utils/axios/fish";
import ImageSlider from "../../../../components/ImageSlider"; // Import your ImageSlider component
import { getFileByFileId } from "../../../../utils/axios/file";
import { useLocation } from "react-router-dom";

const { Title } = Typography;

function Fish() {
  const [fishData, setFishData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFish, setSelectedFish] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    async function fetchFish() {
      if (state) {
        const fetchedData = await getFishesByOrderId(state);
        if (fetchedData) {
          setFishData(fetchedData);
        }
      } else {
        const fetchedData = await getAllFishes();
        if (fetchedData) {
          setFishData(fetchedData);
        }
      }
    }
    fetchFish();
  }, []);
  
  const handleViewFish = async (fish) => {
    setSelectedFish(fish);
    setIsModalOpen(true);

    try {
      // Log the fish files for debugging

      const fileId = fish.file.id; // Fetching the first image
      const imageResponse = await getFileByFileId(fileId);

      const imageUrl = URL.createObjectURL(new Blob([imageResponse], { type: "image/jpeg" }));

      console.log("Image URL:", imageUrl);

      setImagePreviews([imageUrl]);

    } catch (error) {
      console.error("Error fetching fish images:", error);
    }
  };

  const handleCloseModal = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url)); // Clean up object URLs
    setIsModalOpen(false);
    setSelectedFish(null);
    setImagePreviews([]);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (age) => `${age} years old`,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (size) => `${size} cm`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case 1:
            return "Good";
          case 2:
            return "Sick";
          case 3:
            return "Dead";
          default:
            return "Unknown";
        }
      },
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
      render: (weight) => `${weight} gram`,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button type="primary" onClick={() => handleViewFish(record)}>
          View Fish
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="dashboard-info">
        <Title level={2} style={{ marginTop: 0, color: "#01428E" }}>
          Fish
        </Title>
      </div>
      <Table
        columns={columns}
        dataSource={fishData}
        rowKey="id"
        pagination={{ pageSize: 15 }}
        style={{ marginTop: "25px" }}
      />

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        style={{ maxWidth: "80vw", top: 20 }}
      >
        {selectedFish && (
          <div>
            <Title level={4} style={{ color: "#01428E" }}>
              {selectedFish.name}
            </Title>
            <div className="slider-container" style={{ marginTop: "16px" }}>
              <ImageSlider images={imagePreviews} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Fish;
