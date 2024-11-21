import { useEffect, useState } from "react";
import { Button, Input, Modal, Popconfirm, Space, Table, Typography } from "antd";
import { disableCustomerById, enableCustomerById, getAllCustomers, managerEditCustomerProfile } from "../../../../utils/axios/customer";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";

const { Title } = Typography;

function Customer() {
    const [customerData, setCustomerData] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCustomer, setCustomer] = useState(null);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleClose = () => {
        setEditModalOpen(false);
        setCustomer(null);
        setEmail("");
        setUsername("");
        setPhoneNumber("");
    };

    async function fetchCustomers() {
        const fetchedData = await getAllCustomers();
        if (fetchedData) {
            setCustomerData(fetchedData);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function handleEditCustomers() {
        if (editingCustomer) {
            try {
            const rawPhoneNumber = phoneNumber.replace(/[^\d]/g, "");
            const message = await managerEditCustomerProfile(editingCustomer, username, email, rawPhoneNumber);
            toast(message);
            fetchCustomers();
        } catch (error) {
            toast.error(error);
          } 
        }
        handleClose();
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

    const handleDisableCustomer = async (id) => {
        try {
            await disableCustomerById(id);
            toast("Customer disabled successfully");
            await fetchCustomers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to disable customer");
        }
    };

    const handleEnableCustomer = async (id) => {
        try {
            await enableCustomerById(id);
            toast("Customer enabled successfully");
            await fetchCustomers();
        } catch (err) {
            console.error(err);
            toast.error("Failed to enable customer");
        }
    };

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (phoneNumber) => formatPhoneNumber(phoneNumber),
        },
        {
            title: "Action",
            dataIndex: "id",
            key: "id",
            render: (id, record) => (
                <Space size="middle">
                  
                    <Popconfirm
                        title={
                            record.activeStatus
                                ? "Are you sure to disable this customer?"
                                : "Are you sure to enable this customer?"
                        }
                        onConfirm={() => {
                            if (record.activeStatus) {
                                handleDisableCustomer(id);
                            } else {
                                handleEnableCustomer(id);
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
            <div className="dashboard-info">
                <Title level={2} style={{ marginTop: 0, color:"#01428E" }}>Customer</Title>
            </div>
            <ToastUtil />
            <Table
                columns={columns}
                dataSource={customerData}
                rowKey="id"
                pagination={{ pageSize: 15 }}
                style={{ marginTop: "25px" }}
                className="customer-table"
            />
            <Modal
                title={"Edit Customer"}
                visible={editModalOpen}
                onCancel={handleClose}
                onOk={() => handleEditCustomers()}
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

export default Customer;