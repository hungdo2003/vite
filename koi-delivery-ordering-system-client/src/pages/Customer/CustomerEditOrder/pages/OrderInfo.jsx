/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box, styled } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Calendar } from "react-date-range";
import { GoogleMap } from "@react-google-maps/api";
import { Button, Flex } from "antd";
import { updateGeneralOrderInfo } from "../../../../utils/axios/order";
import ToastUtil from "../../../../components/toastContainer";
import { useNavigate } from "react-router-dom";
import { CONSTANT_GOOGLE_MAP_API_KEY } from "../../../../utils/constants";
import { usePlacesWidget } from "react-google-autocomplete";
import { fromAddress, setDefaults } from "react-geocode";
import { calculateDateByDistance, calculateDistance, getOneWeekFromToday } from "../../../../components/utils";

setDefaults({
    key: CONSTANT_GOOGLE_MAP_API_KEY, // Your API key here.
    language: "en", // Default language for responses.
    region: "es", // Default region for responses.
});

const CustomBoxContainer = styled(Box)(() => ({
    display: "flex",
    gap: "40px"
}));

const containerStyle = {
    width: '700px',
    height: '80vh',
    maxWidth: '35vw'
};

function OrderInfo({ order }) {
    const centerDefault = {
        lat: 10.75,
        lng: 106.6667
    };
    const [center, setCenter] = useState(centerDefault);
    const [orderName, setOrderName] = useState(order.name);
    const [orderDescription, setOrderDescription] = useState(order.description);
    const [senderAddress, setSenderAddress] = useState(order.senderAddress);
    const [senderCoordinates, setSenderCoordinates] = useState({ lat: parseFloat(order.senderLatitude), lng: parseFloat(order.senderLongitude) });
    const [receiverAddress, setReceiverAddress] = useState(order.destinationAddress);
    const [receiverCoordinates, setReceiverCoordinates] = useState({ lat: parseFloat(order.destinationLatitude), lng: parseFloat(order.destinationLongitude) });
    const [expectedFinishDate, setExpectedFinishDate] = useState(new Date(order.expectedFinishDate));
    const [selectedButton, setSelectedButton] = useState(0);
    const [updated, setUpdated] = useState(false);
    const [orderId, setOrderId] = useState(false);

    const navigate = useNavigate();

    const onMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        setCenter({
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        })

        // Initialize the Geocoder
        const geocoder = new window.google.maps.Geocoder();

        // Reverse Geocode to get the address
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results[0]) {
                if (results[0].formatted_address.includes("+")) {
                    console.log("Invalid token");
                } else {
                    if (selectedButton === 0) {
                        setSenderAddress(results[0].formatted_address);
                    } else {
                        setReceiverAddress(results[0].formatted_address);
                    }
                }
            } else {
                console.error("Geocoder failed due to: " + status);
            }
        });
    }, [selectedButton]);

    const [map, setMap] = useState(null)

    const onLoad = useCallback(function callback(map) {
        setMap(map)
    }, [])

    const onUnmount = useCallback(function callback(map) {
        setMap(null)
    }, [])

    function handleNameChange(e) {
        setOrderName(e.target.value);
    }

    function handleSenderAddressChange(e) {
        setSenderAddress(e.target.value);
    }

    function handleReceiverAddressChange(e) {
        setReceiverAddress(e.target.value);
    }

    function handleDescChange(e) {
        setOrderDescription(e.target.value);
    }

    function handleConclusion() {
        navigate(`/customer-edit-order/${order.id}/order-conclusion-info`)
    }

    const { ref: senderRef } = usePlacesWidget({
        apiKey: CONSTANT_GOOGLE_MAP_API_KEY,
        onPlaceSelected: (place) => {
            setSenderAddress(place.formatted_address);
        }
    })

    const { ref: receiverRef } = usePlacesWidget({
        apiKey: CONSTANT_GOOGLE_MAP_API_KEY,
        onPlaceSelected: (place) => {
            setReceiverAddress(place.formatted_address);
        }
    })

    useEffect(() => {
        if (receiverAddress && receiverAddress.length > 0) {
            fromAddress(receiverAddress)
                .then(({ results }) => {
                    const lat = results[0].geometry.location.lat;
                    const lng = results[0].geometry.location.lng;
                    setReceiverCoordinates({ lat, lng });
                })
                .catch(() => {
                    console.log("Invalid address");
                    setReceiverCoordinates(null);
                });
        }
    }, [receiverAddress])

    useEffect(() => {
        if (senderAddress && senderAddress.length > 0) {
            fromAddress(senderAddress)
                .then(({ results }) => {
                    const lat = results[0].geometry.location.lat;
                    const lng = results[0].geometry.location.lng;
                    setSenderCoordinates({ lat, lng });
                })
                .catch(() => {
                    console.log("Invalid address");
                    setSenderCoordinates(null);
                });
        }
    }, [senderAddress])

    async function handleSubmit() {
        if (!orderName || !orderDescription || !receiverAddress) {
            toast("All fields are required");
            return;
        }
        if (!senderCoordinates || !receiverCoordinates) {
            toast("Invalid address");
            return;
        }
        try {
            const response = await updateGeneralOrderInfo(
                order.id,
                orderName,
                orderDescription,
                receiverAddress,
                receiverCoordinates.lng,
                receiverCoordinates.lat,
                senderAddress,
                senderCoordinates.lng,
                senderCoordinates.lat,
                new Date(expectedFinishDate).toISOString()
            )

            if (response) {
                setOrderId(response);
                toast("Update successfully, please conclude your update and pay the extra money");
                setUpdated(true);
            } else {
                toast("Unsupported Area");
            }
        } catch (e) {
            toast("unexpected error has been occurred")
        }
    }

    useEffect(() => {
        if (senderCoordinates && receiverCoordinates && senderCoordinates.lat && senderCoordinates.lng && receiverCoordinates.lat && receiverCoordinates.lng) {
            const distance = calculateDistance(
                parseFloat(senderCoordinates.lat),
                parseFloat(senderCoordinates.lng),
                parseFloat(receiverCoordinates.lat),
                parseFloat(receiverCoordinates.lng));
            const expectedDate = calculateDateByDistance(distance);
            setExpectedFinishDate(expectedDate);
        }
    }, [senderAddress, receiverAddress]);

    const handleDateChange = (e) => {
        setExpectedFinishDate(e);
    }

    const handleButtonClick = (buttonType) => {
        setSelectedButton(buttonType);
    };

    return (
        <CustomBoxContainer>
            <ToastUtil />
            <div className="form-container">
                <div className="form">
                    <div className="form-group">
                        <input
                            placeholder="Name"
                            type="text"
                            name="name"
                            className="form-input"
                            value={orderName}
                            onChange={e => handleNameChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            placeholder="Description"
                            type="text"
                            name="text"
                            className="form-input"
                            value={orderDescription}
                            onChange={e => handleDescChange(e)}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            placeholder="Sender Address"
                            type="text"
                            name="text"
                            className="form-input"
                            onChange={e => handleSenderAddressChange(e)}
                            value={senderAddress}
                            ref={senderRef}
                        />
                    </div>

                    <div className="form-group">
                        <input
                            placeholder="Destination Address"
                            type="text"
                            name="text"
                            className="form-input"
                            onChange={e => handleReceiverAddressChange(e)}
                            value={receiverAddress}
                            ref={receiverRef}
                        />
                    </div>

                    <Calendar date={expectedFinishDate} />

                    {updated ? (
                        <button onClick={() => handleConclusion()} className="form-button">
                            Next Step
                        </button>
                    ) : (
                        <button onClick={() => handleSubmit()} className="form-button">
                            Confirm
                        </button>
                    )}
                </div>
            </div>
            <div>
                <Flex gap="small" wrap style={{ marginBottom: "20px" }}>
                    <Button
                        type="primary"
                        onClick={() => handleButtonClick(0)}
                        style={{
                            backgroundColor: selectedButton === 0 ? 'blue' : '',
                        }}
                    >
                        Select Address for Sender
                    </Button>
                    <Button
                        onClick={() => handleButtonClick(1)}
                        style={{
                            backgroundColor: selectedButton === 1 ? 'aqua' : '#C4F3FD',
                            color: selectedButton === 1 ? 'white' : 'black'
                        }}
                    >
                        Select Address for Receiver
                    </Button>
                </Flex>
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={onMapClick}
                >
                    { /* Child components, such as markers, info windows, etc. */}
                    <></>
                </GoogleMap>
            </div>
        </CustomBoxContainer>
    )
}

export default OrderInfo;