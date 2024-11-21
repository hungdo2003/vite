import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { getAllTransaction } from "../../../../utils/axios/transaction";

// Function to format the date in "DD/MM/YYYY"
function formatDate(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function Transaction() {
    const [transactionData, setTransactionData] = useState([]);

    useEffect(() => {
        async function fetchTransaction() {
            const fetchedData = await getAllTransaction();
            if (fetchedData) {
                setTransactionData(fetchedData);
            }
        }
        fetchTransaction();
    }, []);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `${amount.toLocaleString()} VND`,
        },
        {
            title: 'Transaction Date',
            dataIndex: 'transactionDate',
            key: 'transactionDate',
            render: (text) => formatDate(text), // Format the date here
        },
    ];

    return (
        <div>
            <div className="dashboard-info">
                <Typography.Title level={2} style={{ marginTop: 0, color: "#01428E" }}>Transaction</Typography.Title>
            </div>

            <Table
                dataSource={transactionData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 15 }} // Adjust pagination as needed
                style={{ marginTop: "25px" }}
            />
        </div>
    );
}

export default Transaction;
