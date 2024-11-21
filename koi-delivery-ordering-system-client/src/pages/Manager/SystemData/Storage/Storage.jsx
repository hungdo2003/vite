import { useCallback, useEffect, useState } from "react";
import { Table, Modal, Button, Input, Typography } from "antd";
import { usePlacesWidget } from "react-google-autocomplete";
import { createStorage, getAllStorages } from "../../../../utils/axios/storage";
import { GoogleMap } from "@react-google-maps/api";
import "react-toastify/dist/ReactToastify.css";
import ToastUtil from "../../../../components/toastContainer";
import { toast } from "react-toastify";
import { CONSTANT_GOOGLE_MAP_API_KEY } from "../../../../utils/constants";
import { fromAddress, setDefaults } from "react-geocode";

const { Title } = Typography;

setDefaults({
  key: CONSTANT_GOOGLE_MAP_API_KEY, // Your API key here.
  language: "en", // Default language for responses.
  region: "es", // Default region for responses.
});

function Storage() {
  const centerDefault = {
    lat: 10.75,
    lng: 106.6667,
  };

  const [center, setCenter] = useState(centerDefault);
  const [storageData, setStorageData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null);

  const fetchStorageData = async () => {
    const fetchedData = await getAllStorages();
    if (fetchedData) {
      setStorageData(fetchedData);
    }
  };

  useEffect(() => {
    fetchStorageData();
  }, []);

  const onMapClick = useCallback((e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setCenter({ lat, lng });

    // Initialize the Geocoder
    const geocoder = new window.google.maps.Geocoder();

    // Reverse Geocode to get the address
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        if (results[0].formatted_address.includes("+")) {
          console.log("Invalid token");
        } else {
          setAddress(results[0].formatted_address);
        }
      } else {
        console.error("Geocoder failed due to: " + status);
      }
    });
  }, []);

  const handleCreateStorage = async () => {
    try {
      const data = await createStorage(
        name,
        address,
        coordinates.lat,
        coordinates.lng
      );
      if (data) {
        await fetchStorageData();
        toast("Create Storage successfully");
      }
    } catch (error) {
      toast("Unexpected error has been occurred");
    }
    handleClose();
  };

  const { ref } = usePlacesWidget({
    apiKey: CONSTANT_GOOGLE_MAP_API_KEY,
    onPlaceSelected: (place) => {
      setAddress(place.formatted_address);
    },
  });
  
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => {
    setIsModalOpen(false);
    // Reset states if needed
    setName("");
    setAddress("");
    setCoordinates({ lat: null, lng: null });
  };

  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (address && address.length > 0) {
      fromAddress(address)
        .then(({ results }) => {
          const lat = results[0].geometry.location.lat;
          const lng = results[0].geometry.location.lng;
          setCoordinates({ lat, lng });
        })
        .catch(() => {
          console.log("Invalid address");
          setCoordinates(null);
        });
    }
  }, [address])

  return (
    <div>
      <ToastUtil />
      <div className="dashboard-info">
        <Title level={2} style={{ marginTop: 0, color: "#01428E" }}>
          Storage
        </Title>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <Button type="primary" style={{ marginRight: "20px" }} onClick={handleOpen}>
          Create New Storage
        </Button>
      </div>

      <Table
        dataSource={storageData}
        rowKey="id"
        pagination={{ pageSize: 15 }} // Adjust as needed
      >
        <Table.Column title="Id" dataIndex="id" key="id" />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Address" dataIndex="address" key="address" />
        <Table.Column title="Longitude" dataIndex="longitude" key="longitude" />
        <Table.Column title="Latitude" dataIndex="latitude" key="latitude" />
        <Table.Column
          title="Order Amount"
          dataIndex="orderAmount"
          key="orderAmount"
        />
      </Table>

      <Modal
        title="Create New Storage"
        open={isModalOpen}
        onCancel={handleClose}
        footer={[
          <Button key="back" onClick={handleClose}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleCreateStorage}
            disabled={!address || !name} // Disable if either is empty
          >
            Submit
          </Button>,
        ]}
      >
        <input
          placeholder="Name"
          type="text"
          name="text"
          className="form-input"
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: "10px" }}
          value={name}
        />
        {/* <Input
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          ref={storageAddress}
        /> */}
        <input
          placeholder="Address"
          type="text"
          name="text"
          className="form-input"
          style={{ marginBottom: "10px" }}
          value={address}
          ref={ref}
          onChange={(e) => setAddress(e.target.value)} // Optionally, you can still have this to let users type manually
        />
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
        />
      </Modal>
    </div>
  );
}

export default Storage;
