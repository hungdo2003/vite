  import { useEffect, useState } from "react";
  import { Table, Typography, Button, Modal } from "antd";
  import { getAllLicenses } from "../../../../utils/axios/license";
  import { getFileByFileId } from "../../../../utils/axios/file";
  import dateTimeConvert from "../../../../components/utils";
  import ImageSlider from "../../../../components/ImageSlider";

  const { Title } = Typography;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    backgroundColor: "white",
    boxShadow: 24,
    padding: 24,
    borderRadius: 8,
  };

  function License() {
    const [licenseData, setLicenseData] = useState([]);
    const [licenseImages, setLicenseImages] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);

    useEffect(() => {
      async function fetchLicense() {
        const fetchedData = await getAllLicenses();
        if (fetchedData) {
          setLicenseData(fetchedData);
        }
      }
      fetchLicense();
    }, []);

    // Function to handle fetching and displaying images for the selected license
    const handleViewLicense = async (license) => {
      setSelectedLicense(license); // Store selected license details
      if (Array.isArray(license.files) && license.files.length > 0) {
        const imagePromises = license.files.map(async (file) => {
          const fileId = file.file.id;
          const imageResponse = await getFileByFileId(fileId);
          console.log(imageResponse);
          return URL.createObjectURL(
            new Blob([imageResponse], { type: "image/jpeg" })
          );
        });
        console.log("imagepromise",imagePromises);
        const images = await Promise.all(imagePromises);

        console.log("image",images);
        
        setLicenseImages(images);
        setIsModalOpen(true);
      }
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setLicenseImages([]);
      setSelectedLicense(null);
    };

    const columns = [
      {
        title: "Id",
        dataIndex: "id",
        key: "id",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
      },
      {
        title: "Date of Issue",
        dataIndex: "dateOfIssue",
        key: "dateOfIssue",
        render: (date) => dateTimeConvert(date),
      },
      {
        title: "Action",
        key: "action",
        render: (_, record) => (
          <Button type="primary" onClick={() => handleViewLicense(record)}>
            View License
          </Button>
        ),
      },
    ];

    return (
      <div>
        <div className="dashboard-info">
          <Title level={2} style={{ marginTop: 0, color: "#01428E" }}>
            Licenses
          </Title>
        </div>
        <Table
          columns={columns}
          dataSource={licenseData}
          rowKey="id"
          pagination={{ pageSize: 15 }}
          style={{ marginTop: "25px" }}
        />

        {/* Modal for viewing license details */}
        <Modal
          open={isModalOpen}
          onCancel={handleCloseModal}
          footer={null}
          style={modalStyle}
        >
          {selectedLicense && (
            <div style={{ marginBottom: "16px" }}>
              <div className="slider-container" style={{ marginTop: "16px" }}>
                <ImageSlider images={licenseImages} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "10px",
                }}
              ></div>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  export default License;
