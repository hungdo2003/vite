/* eslint-disable react/prop-types */
import { Box, Button, Modal, styled, TextField, Typography } from "@mui/material";
import dateTimeConvert from "../../../../components/utils";
import { useCallback, useState } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import BlueMarker from "../../../../assets/inTransit.svg"
import GreenMarker from "../../../../assets/succeeded.svg"
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";
import { useNavigate } from "react-router-dom";
import { deleteFishById } from "../../../../utils/axios/fish";
import { deleteOrderById } from "../../../../utils/axios/order";
import { Dropdown, Menu, Space, Table } from "antd";
import { MoreOutlined } from "@ant-design/icons";

const OrderCard = styled(Box)(() => ({
    backgroundColor: "#C3F4FD",
    borderRadius: "20px",
    width: "45%",
    padding: "40px 20px",
    border: "1px solid #0264F8"
}));

const FormBox = styled(Box)(() => ({
    display: "flex",
    justifyContent: "space-between"
}));

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const containerStyle = {
    width: '100%',
    height: '650px',
};

const ContentBox = styled(Box)(() => ({
    display: "flex",
    gap: "20px"
}))
const OrderInfoField = styled(TextField)(() => ({
    backgroundColor: "white",
}))

function OrderDetailComponent({ orders }) {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [map, setMap] = useState();
    const [selectedFishId, setSelectedFishId] = useState(null);
    const [fishModalOpen, setFishModalOpen] = useState(false);
    const [orderModalOpen, setOrderModalOpen] = useState();
    const [selectedOrderId, setSelectedOrderId] = useState();

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex < orders.length - 1 ? prevIndex + 1 : prevIndex
        );
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const onLoad = useCallback(function callback(map) {
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    const handleCloseFishModal = () => {
        setFishModalOpen(false);
    };

    const handleDeleteFish = (fishId, order) => {
        if (order.fishes.length > 1) {
            setSelectedFishId(fishId);
            setFishModalOpen(true);
        } else {
            toast("An order can not have empty fish");
        }
    }

    const handleOpenAddFishPage = (order) => {
        navigate(`/customer-add-fish/${order.id}`, {
            state: order,
        });
    };

    const handleCloseOrderModal = () => {
        setOrderModalOpen(false);
    };

    async function handleDeleteOrderConfirm() {
        try {
            const response = await deleteOrderById(
                selectedOrderId,
            );
            if (response) {
                toast("Delete order successfully");
                setTimeout(() => {
                    navigate("/customer-home");
                }, 500);
                setOrderModalOpen(false);
            } else {
                toast("Unexpected error has been occured");
            }
        } catch (error) {
            console.log(error);
            toast("Unexpected error has been occured");
        }
    }

    function handleConclusion(order) {
        navigate(`/customer-edit-order/${order.id}/order-conclusion-info`)
    }

    const handleOpenEditPage = (order) => {
        if (order.fishes && order.fishes.length > 0) {
            navigate(`/customer-edit-order/${order.id}`, {
                state: order,
            });
        } else {
            toast("An order must have at least one fish");
        }
    };

    const handleDeleteOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setOrderModalOpen(true);
    };

    const handleDeleteFishConfirm = async () => {
        const response = await deleteFishById(selectedFishId);
        if (response) {
            toast("Delete fish successfully");
            setTimeout(() => {
                window.location.reload();
            }, 500);
            setFishModalOpen(false);
        } else {
            toast("Unexpected error has been occured");
        }
    }

    if (!orders || orders.length === 0) {
        return <Box>No orders available</Box>;
    }

    const currentOrder = orders[currentIndex];

    const columns = [
        // {
        //     title: 'Fish Id',
        //     dataIndex: 'id',
        //     key: 'id',
        // },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (age) => `${age} years old`,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price) => `${price} VND`,
        },
        {
            title: 'Size',
            dataIndex: 'size',
            key: 'size',
            render: (size) => `${size} cm`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                switch (status) {
                    case 1:
                        return 'Good';
                    case 2:
                        return 'Sick';
                    case 3:
                        return 'Dead';
                    default:
                        return 'Unknown';
                }
            },
        },
        {
            title: 'Weight',
            dataIndex: 'weight',
            key: 'weight',
            render: (weight) => `${weight} gram`,
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: "id",
            render: (id, record) => (
                <Space size="middle">
                    <Dropdown
                        overlay={
                            <Menu>
                                {(currentOrder.orderStatus === 0 || currentOrder.orderStatus === 1) && (
                                    <Button type="link" onClick={() => handleDeleteFish(record.id, currentOrder)}>
                                        Delete Fish
                                    </Button>
                                )}
                                {/* Add other actions here if needed */}
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

    return orders && orders.length > 0 && (
        <Box>
            <ToastUtil />
            <Modal
                open={orderModalOpen}
                onClose={handleCloseOrderModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "20px",
                        }}
                    >
                        Are you sure about delete this order ?
                    </Typography>
                    <div style={{ margin: "20px" }}></div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() => handleDeleteOrderConfirm()}
                    >
                        Confirm
                    </Button>
                </Box>
            </Modal>

            <Modal
                open={fishModalOpen}
                onClose={handleCloseFishModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={modalStyle}>
                    <Typography
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            fontSize: "20px",
                        }}
                    >
                        Are you sure about delete this fish ?
                    </Typography>
                    <div style={{ margin: "20px" }}></div>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ width: "100%" }}
                        onClick={() => handleDeleteFishConfirm()}
                    >
                        Confirm
                    </Button>
                </Box>
            </Modal>

            <ContentBox>
                <OrderCard>
                    <div className="form-group">
                        <Typography>Name</Typography>
                        <OrderInfoField
                            fullWidth
                            type=""
                            value={currentOrder.name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <Typography>Description</Typography>
                        <OrderInfoField
                            fullWidth
                            type=""
                            value={currentOrder.description}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <Typography>Sender Address</Typography>
                        <OrderInfoField
                            fullWidth
                            type=""
                            value={currentOrder.senderAddress}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <Typography>Destination Address</Typography>
                        <OrderInfoField
                            fullWidth
                            type=""
                            value={currentOrder.destinationAddress}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </div>

                    <FormBox>

                        <div className="form-group">
                            <Typography>Receiver Email</Typography>
                            <OrderInfoField
                                fullWidth
                                type=""
                                value={currentOrder.receiverEmail}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <Typography>Receiver Phone Number</Typography>
                            <OrderInfoField
                                fullWidth
                                type=""
                                value={currentOrder.receiverPhoneNumber}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>
                    </FormBox>

                    <FormBox>
                        <div className="form-group">
                            <Typography>Created Date</Typography>
                            <OrderInfoField
                                fullWidth
                                type=""
                                value={dateTimeConvert(currentOrder.createdDate)}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </div>

                        {currentOrder.finishDate ? (
                            <div className="form-group">
                                <Typography>Finish Date</Typography>
                                <OrderInfoField
                                    fullWidth
                                    type=""
                                    value={dateTimeConvert(currentOrder.finishDate)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="form-group">
                                <Typography>Expected Finish Date</Typography>
                                <OrderInfoField
                                    fullWidth
                                    type=""
                                    value={dateTimeConvert(currentOrder.expectedFinishDate)}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                            </div>
                        )}
                    </FormBox>
                </OrderCard>

                <Box style={{ width: "48%" }}>
                    {(currentOrder.orderStatus === 0 || currentOrder.orderStatus === 1) && (
                        <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                            {currentOrder.orderStatus === 0 ? (
                                <Button onClick={() => handleConclusion(currentOrder)}>Make your payment</Button>
                            ) : (
                                <Button disabled>Make your payment</Button>
                            )}
                            <Button onClick={() => handleOpenEditPage(currentOrder)}>Edit</Button>
                            <Button onClick={() => handleDeleteOrder(currentOrder.id)}>Delete</Button>
                        </Box>
                    )}

                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={{
                            lat: parseFloat(currentOrder.storage.latitude),
                            lng: parseFloat(currentOrder.storage.longitude)
                        }}
                        zoom={15}
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                    >
                        { /* Child components, such as markers, info windows, etc. */}
                        <>
                            <Marker
                                position={{
                                    lat: parseFloat(currentOrder.senderLatitude),
                                    lng: parseFloat(currentOrder.senderLongitude),
                                }}
                                icon={{
                                    url: GreenMarker,
                                }}
                            >
                            </Marker>
                            <Marker
                                position={{
                                    lat: parseFloat(currentOrder.destinationLatitude),
                                    lng: parseFloat(currentOrder.destinationLongitude),
                                }}
                                icon={{
                                    url: BlueMarker,
                                }}
                            >
                            </Marker>

                            <Polyline
                                path={[
                                    {
                                        lat: parseFloat(currentOrder.senderLatitude),
                                        lng: parseFloat(currentOrder.senderLongitude),
                                    },
                                    {
                                        lat: parseFloat(currentOrder.destinationLatitude),
                                        lng: parseFloat(currentOrder.destinationLongitude),
                                    },
                                ]}
                                options={{
                                    strokeColor: "#041967",
                                    //strokeOpacity: 0.5,
                                    strokeWeight: 2,
                                    geodesic: true,
                                    icons: [{
                                        // eslint-disable-next-line no-undef
                                        icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
                                        offset: '50%'
                                    }]
                                }}
                            />
                        </>
                    </GoogleMap>
                </Box>

            </ContentBox>

            <Typography variant="h6" style={{ marginTop: "20px", marginBottom: "10px" }}>Fish Information</Typography>

            <Table
                style={{ width: "95%", boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)" }}
                dataSource={currentOrder.fishes || []}
                columns={columns}
                rowKey="id"
                pagination={false}
            />

            {(currentOrder.orderStatus === 0 || currentOrder.orderStatus === 1) && (
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Button
                        type="primary"
                        shape="circle"
                        size="large"
                        onClick={() => handleOpenAddFishPage(currentOrder)}
                        style={{
                            fontSize: '25px',
                            padding: '5px 20px',
                        }}
                    >
                        +
                    </Button>
                </div>
            )}

            {/* Navigation buttons */}
            <Box display="flex" justifyContent="space-between" marginTop={2}>
                <Button onClick={handlePrevious} disabled={currentIndex === 0}>
                    Previous Order
                </Button>
                <Button onClick={handleNext} disabled={currentIndex === orders.length - 1}>
                    Next Order
                </Button>
            </Box>
        </Box>
    );
}

export default OrderDetailComponent;