import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { getAllRatings } from "../../../../utils/axios/rating";

// Function to format the date in "DD/MM/YYYY"
// function formatDate(dateString) {
//     const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString(undefined, options);
// }

function Rating() {
    const [ratingData, setRatingData] = useState([]);

    useEffect(() => {
        async function fetchRating() {
            const fetchedData = await getAllRatings();
            if (fetchedData) {
                setRatingData(fetchedData);
            }
        }
        fetchRating();
    }, []);
    console.log(ratingData);

    const columns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer Name',
            dataIndex: 'createdBy.username',
            key: 'createdBy.username',
        },
        {
            title: 'Created Date',
            dataIndex: 'created_date',
            key: 'created_date',
            render: (text) => new Date(text).toLocaleDateString(),
            // Format the date here
        },
        {
            title: 'Comment',
            dataIndex: 'comment',
            key: 'comment',
        },
        {
            title: 'Rate Star',
            dataIndex: 'rate_star',
            key: 'rate_star',
        },
        {
            title: 'Order ID',
            dataIndex: 'order_id',
            key: 'order_id',
        },
    ];

    return (
        <div>
            <div className="dashboard-info">
                <Typography.Title level={2} style={{ marginTop: 0, color: "#01428E" }}>Rating</Typography.Title>
            </div>

            <Table
                dataSource={ratingData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 15 }} // Adjust pagination as needed
                style={{ marginTop: "25px" }}
            />
        </div>
    );
}

export default Rating;
