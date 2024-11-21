import { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Typography, Space, Popconfirm, notification } from "antd";
import { createDeliveryStaff, disableDeliveryStaffById, enableDeliveryStaffById, getAllDeliveryStaff, managerEditDeliveryStaffProfile } from "../../../../utils/axios/deliveryStaff";
import ToastUtil from "../../../../components/toastContainer";
import { toast } from "react-toastify";

const { Title } = Typography;

function DeliveryStaff() {
    const [deliveryStaffData, setDeliveryStaffData] = useState([]);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleOpen = () => setCreateModalOpen(true);
    const handleClose = () => {
        setCreateModalOpen(false);
        setEditModalOpen(false);
        setEditingStaff(null);
        setEmail("");
        setUsername("");
        setPhoneNumber("");
    };

    async function fetchDeliveryStaffs() {
        const fetchedData = await getAllDeliveryStaff();
        if (fetchedData) {
            setDeliveryStaffData(fetchedData);
        }
    }

    useEffect(() => {
        fetchDeliveryStaffs();
    }, []);

    const handleCreateDeliveryStaff = async () => {

        try {
        const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
        const response = await createDeliveryStaff(email, username, rawPhoneNumber);
        notification.info({ message: response });
        await fetchDeliveryStaffs();
        setCreateModalOpen(false);
    } catch (error) {
        toast.error(error); 
      } 
    };

    async function handleEditDeliveryStaff() {
        if (editingStaff) {try {

            const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
            const message = await managerEditDeliveryStaffProfile(editingStaff.id, username, email, rawPhoneNumber);
            if (message) {
                toast("Edit delivery staff successfully");
            } else {
                toast("Unexpected error has occurred");
            }
            fetchDeliveryStaffs();
        } catch (error) {
            toast.error(error);
          } 
        }
        handleClose();
    }

    function handleEdit(record) {
        setEditingStaff(record);
        setUsername(record.username);
        setEmail(record.email);
        setPhoneNumber(record.phoneNumber);
        setEditModalOpen(true);
    }

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, "");
        const phoneNumberLength = phoneNumber.length;

        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handleDisableDeliveryStaff = async (id) => {
        try {
            await disableDeliveryStaffById(id);
            toast("Delivery Staff disabled successfully");
            await fetchDeliveryStaffs();
        } catch (err) {
            console.error(err);
            toast.error("Failed to disable customer");
        }
    };

    const handleEnableDeliveryStaff = async (id) => {
        try {
            await enableDeliveryStaffById(id);
            toast("Delivery Staff enabled successfully");
            await fetchDeliveryStaffs();
        } catch (err) {
            console.error(err);
            toast.error("Failed to enable customer");
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
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Longitude",
            dataIndex: "longitude",
            key: "longitude",
        },
        {
            title: "Latitude",
            dataIndex: "latitude",
            key: "latitude",
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
                                ? "Are you sure to disable this delivery staff?"
                                : "Are you sure to enable this delivery staff?"
                        }
                        onConfirm={() => {
                            if (record.activeStatus) {
                                handleDisableDeliveryStaff(id);
                            } else {
                                handleEnableDeliveryStaff(id);
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
                <Title level={2} style={{ marginTop: 0, color: "#01428E" }}>Delivery Staff</Title>
            </div>
            <div>
                <Space style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                    <Button type="primary" style={{ marginRight: "20px" }} onClick={handleOpen}>
                        Create New Delivery Staff
                    </Button>
                </Space>
            </div>

            <Table
                dataSource={deliveryStaffData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 15 }}
            />

            <Modal
                title={"Create New Delivery Staff"}
                visible={createModalOpen}
                onCancel={handleClose}
                onOk={() => handleCreateDeliveryStaff()}
                okButtonProps={{ disabled: !username || !email }}
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
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))}
                    onBlur={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    style={{ marginBottom: 16 }}
                />
            </Modal>

            <Modal
                title={"Edit Delivery Staff"}
                visible={editModalOpen}
                onCancel={handleClose}
                onOk={() => handleEditDeliveryStaff()}
                okButtonProps={{ disabled: !username || !email }}
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
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))}
                    onBlur={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    style={{ marginBottom: 16 }}
                />
            </Modal>
        </div>
    );
}

export default DeliveryStaff;