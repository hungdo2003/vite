import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { getAllPaymentHistory } from "../../../../utils/axios/paymentHistory";

const { Title } = Typography;

function PaymentHistory() {
    const [paymentHistoryData, setPaymentHistoryData] = useState([]);

    useEffect(() => {
        async function fetchPaymentHistory() {
            let fetchedData = await getAllPaymentHistory();
            if (fetchedData) {
                setPaymentHistoryData(fetchedData);
            }
        }
        fetchPaymentHistory();
    }, []);
    
    const columns = [
        {
            title: "Id",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
        {
            title: "Customer Name",
            render: (record) => record.customer.username, // Access nested property
            key: "username",
        },
        {
            title: "Order Name",
            render: (record) => record.order.name, // Access nested property
            key: "orderName",
        },
    ];

    return (
        <div>
            <div className="dashboard-info">
                <Title level={2} style={{marginTop: 0, color:"#01428E" }}>
                    Payment History
                </Title>
            </div>

            <Table
                columns={columns}
                dataSource={paymentHistoryData}
                rowKey="id"
                pagination={{ pageSize: 15 }} // Adjust page size as needed
                style={{ marginTop: "25px" }}
            />
        </div>
    );
}

export default PaymentHistory;
