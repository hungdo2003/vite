import { Box, Button, Grid, styled, TextField, Typography } from "@mui/material";
import ToastUtil from "../../../../components/toastContainer";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getOrderById, postOrder } from "../../../../utils/axios/order";
import { getFileByFileId } from "../../../../utils/axios/file";
import { getPaymentHistory, getSuccessPaymentHistoryByOrder, logPaymentHistory, paymentOpenGateway } from "../../../../utils/axios/payment";
import { toast } from "react-toastify";
import dateTimeConvert from "../../../../components/utils";
import Spinner from "../../../../components/SpinnerLoading";

const SubmitButton = styled(Button)(() => ({
    padding: "10px 80px"
}))

// eslint-disable-next-line react/prop-types
function OrderFinalInfo() {
    const { id } = useParams();
    const [postedData, setPostedData] = useState();
    const [fishOrderData, setFishOrderData] = useState([]);
    const [fishFiles, setFishFiles] = useState([]);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [paidOrder, setPaidOrder] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    let customerId;
    if (token) {
        const customerInfo = jwtDecode(token);
        customerId = customerInfo.sub.substring(2);
    }

    useEffect(() => {
        async function fetchData() {
            console.log(id);
            setIsLoading(true); // Set loading to true at the start of the operation

            try {
                const postedOrder = await getOrderById(id);
                setPostedData(postedOrder);
                setFishOrderData(postedOrder.fishes);

                const fileIds = postedOrder.fishes.map(fish => fish.file.id);
                if (fileIds.length > 0) {
                    const fishFilesPromises = fileIds.map(async fileId => {
                        const response = await getFileByFileId(fileId);
                        return URL.createObjectURL(response); // Create Object URL from response blob
                    });

                    const fishFilesArray = await Promise.all(fishFilesPromises);
                    setFishFiles(fishFilesArray);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error (e.g., set an error state or show a message)
            } finally {
                setIsLoading(false); // Set loading to false once all operations are complete
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function checkOrder() {
            const paymentResponse = await getSuccessPaymentHistoryByOrder(id);
            let sumPrice = 0;
            paymentResponse.forEach(paymentHistory => {
                setPaidOrder(prevPaidOrder => prevPaidOrder + paymentHistory.amount);
                sumPrice = sumPrice + paymentHistory.amount;
            });

            if (postedData.price === sumPrice) {
                setPaymentSuccess(true);
                const response = await postOrder(id);
                if (response) {
                    toast("Order posted successfully");
                }
            }

            setIsLoading(false);
        }

        if (postedData) {
            checkOrder();
        }
    }, [postedData])

    if (isLoading) {
        return <Spinner />; // Show a loading indicator while the checkOrder is processing
    }

    async function handleUpdateOrder() {
        const paymentResponse = await logPaymentHistory(customerId, id, (postedData.price - paidOrder));
        const paymentOpen = await paymentOpenGateway(customerId, Math.floor(postedData.price - paidOrder), "NCB");

        if (paymentOpen) {
            let paymentWindow = window.open(paymentOpen.paymentUrl, "_blank");

            // Check every 500ms if the window is closed
            let checkWindowClosed = setInterval(async function () {
                if (paymentWindow.closed) {
                    clearInterval(checkWindowClosed);
                    if (paymentResponse) {
                        const paymentCheck = await getPaymentHistory(paymentResponse.id);
                        if (paymentCheck.paymentStatus) {
                            const response = await postOrder(id);
                            if (response) {
                                toast("Order posted successfully");
                                setPaymentSuccess(true);
                            } else {
                                toast("Unexpected error has been occurred");
                            }
                        }
                    } else {
                        toast("Unexpected error has been occurred");
                    }
                }
            }, 500);
        }
    }

    return (
        <Box>
            <ToastUtil />
            {postedData && (
                <Box
                    sx={{
                        border: '1px solid #C3F4FD',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Create Dated"
                                value={dateTimeConvert(postedData.createdDate)}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Expect Finish Date"
                                value={dateTimeConvert(postedData.expectedFinishDate)}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Sender Address"
                                type=""
                                value={postedData.senderAddress}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Receive Address"
                                value={postedData.destinationAddress}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Order Name"
                                value={postedData.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Tracking Id"
                                value={postedData.trackingId}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Description"
                                value={postedData.description}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type=""
                                label="Extra Price"
                                value={`${(postedData.price - paidOrder) < 0 ? 0 : (postedData.price - paidOrder)} VND`}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>

                    <div style={{ marginTop: "20px" }}></div>
                    {/* Display fish details and images */}
                    <Grid container spacing={2}>
                        {fishOrderData && fishOrderData.length > 0 && fishOrderData.map((fish, index) => (
                            <Grid container item xs={12} sm={6} key={index} spacing={2}>
                                {/* Fish details */}
                                <Grid item xs={12}>
                                    <Typography variant="h6">Fish {index + 1}</Typography>
                                    <Typography>Name: {fish.name}</Typography>
                                </Grid>

                                {/* Fish image */}
                                <Grid item xs={12}>
                                    {fishFiles[index] && (
                                        <img src={fishFiles[index]} alt={`Fish ${index + 1}`} width="100%" style={{ maxWidth: "200px", height: "200px" }} />
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                    {(postedData.price - paidOrder) <= 0 ? (
                        <SubmitButton variant="contained" onClick={() => navigate("/customer-home")}>Back to Home Page</SubmitButton>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: "30px"
                            }}>
                            {paymentSuccess ? (
                                <SubmitButton variant="contained" onClick={() => navigate("/customer-home")}>Back to Home Page</SubmitButton>
                            ) : (
                                <SubmitButton variant="contained" onClick={handleUpdateOrder}>Post as Order</SubmitButton>
                            )}
                        </Box>
                    )}
                </Box>
            )
            }
        </Box >
    );
}

export default OrderFinalInfo;
