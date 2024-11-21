import { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  Typography,
  Popconfirm,
  Space,
} from "antd";
import {
  getAllSalesStaff,
  createSalesStaff,
  managerEditSalesStaffProfile,
  disableSalesStaffById,
  enableSalesStaffById,
} from "../../../../utils/axios/salesStaff";
import "react-toastify/dist/ReactToastify.css";
import ToastUtil from "../../../../components/toastContainer";
import { toast } from "react-toastify";

const { Title } = Typography;

function SalesStaff() {
  const [salesStaffData, setSalesStaffData] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSalesStaff, setSalesStaff] = useState(null);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const fetchSalesStaffs = async () => {
    const fetchedData = await getAllSalesStaff();
    if (fetchedData) {
      setSalesStaffData(fetchedData);
    }
  };

  useEffect(() => {
    fetchSalesStaffs();
  }, []);

  const handleCreateSalesStaff = async () => {
    try {
      const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
      await createSalesStaff(email, username, rawPhoneNumber);
      await fetchSalesStaffs();
      setIsCreateModalOpen(false);
    } catch (error) {
      toast.error(error);
    }
  };
  const handleClose = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setSalesStaff(null);
    setEmail("");
    setUsername("");
    setPhoneNumber("");
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleEditSalesStaff = async () => {

    if (editingSalesStaff) {
      try {
        const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "");

        const response = await managerEditSalesStaffProfile(
          editingSalesStaff.id,
          username,
          email,
          rawPhoneNumber
        );
        if (response) {
          toast.success("Edit sales staff successfully");
        } else {
          toast.error("Unexpected error has occurred");
        }
        await fetchSalesStaffs();
      } catch (error) {
        toast.error(error);
      } 
    }
    handleClose();
  };

  function handleEdit(record) {
    setSalesStaff(record);
    setUsername(record.username);
    setEmail(record.email);
    setPhoneNumber(record.phoneNumber);
    setIsEditModalOpen(true);
  }

  function handleCreate() {
    setIsCreateModalOpen(true);
  }

  const handleDisableSalesStaff = async (id) => {
    try {
      await disableSalesStaffById(id); // Call the API to delete the staff
      toast("Sales Staff disabled successfully"); // Notify the user
      await fetchSalesStaffs(); // Refresh the list after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to disable customer"); // Notify if there's an error
    }
  };

  const handleEnableSalesStaff = async (id) => {
    try {
      await enableSalesStaffById(id); // Call the API to delete the staff
      toast("Sales Staff enabled successfully"); // Notify the user
      await fetchSalesStaffs(); // Refresh the list after deletion
    } catch (err) {
      console.error(err);
      toast.error("Failed to enable customer"); // Notify if there's an error
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => formatPhoneNumber(phoneNumber),
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title={
              record.activeStatus
                ? "Are you sure to disable this sale staff?"
                : "Are you sure to enable this sale staff?"
            }
            onConfirm={() => {
              if (record.activeStatus) {
                handleDisableSalesStaff(id); // Handle delete if enabled
              } else {
                handleEnableSalesStaff(id); // Handle enabling if disabled
              }
            }}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger={record.activeStatus}>
              {record.activeStatus ? "Disable" : "Enable"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ToastUtil />
      <div className="dashboard-info">
        <Title level={2} style={{ marginTop: 0, color: "#01428E" }}>
          Sales Staff
        </Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button
          type="primary"
          style={{ marginRight: "20px" }}
          onClick={() => handleCreate(true)}
        >
          Create New Sales Staff
        </Button>
      </div>

      <Table
        dataSource={salesStaffData}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 15 }} // Adjust as needed
      />

      <Modal
        title="Create New Sales Staff"
        visible={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsCreateModalOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCreateSalesStaff}
            disabled={!username || !email} // Disable if either is empty
          >
            Submit
          </Button>,
        ]}
      >
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <Input
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
      </Modal>

      <Modal
        title={"Edit Sales Staff"}
        visible={isEditModalOpen}
        onCancel={handleClose}
        onOk={() => handleEditSalesStaff()}
        okButtonProps={{ disabled: !username || !email }} // Disable OK button if fields are empty
      >
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{ marginBottom: 16 }}
        />
      </Modal>
    </div>
  );
}

export default SalesStaff;
