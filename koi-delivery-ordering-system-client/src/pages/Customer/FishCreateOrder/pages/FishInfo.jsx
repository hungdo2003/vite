/* eslint-disable react/prop-types */
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import License from "../utils/License";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";
import { createFishOrderInfo } from "../../../../utils/axios/fish";
import {
  createLicenseFiles,
  createLicenseOrderInfo,
} from "../../../../utils/axios/license";
import { calculateOrderPrice } from "../../../../utils/axios/order";
import { useNavigate } from "react-router-dom";

const CustomBoxContainer = styled(Box)(() => ({
  display: "flex",
  gap: "40px",
}));

function FishInfo({ order }) {
  const navigate = useNavigate();
  const [previewUrl, setPreviewUrl] = useState([]);
  // State for managing fish entries
  const [fishEntries, setFishEntries] = useState([
    { name: "", age: "", size: "", weight: "", price: "", file: null },
  ]);
  const [licenseForms, setLicenseForms] = useState([]);
  const [submittedLicense, setSubmittedLicense] = useState({});
  const [fishCreate, setFishCreate] = useState(false);

  useEffect(() => {
    const updatedPreviewUrls = [...previewUrl]; // Clone the existing previewUrl array

    for (let i = 0; i < fishEntries.length; i++) {
      if (!fishEntries[i].file) {
        continue; // Skip if no file for this entry
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        updatedPreviewUrls[i] = reader.result; // Set preview for this fish entry

        // Update the previewUrl state with the new array
        setPreviewUrl([...updatedPreviewUrls]);
      };

      reader.readAsDataURL(fishEntries[i].file);
    }
  }, [fishEntries]);

  const handleLicenseChange = (e, index) => {
    const { name, value, files } = e.target;
    let newFormData;

    if (files) {
      newFormData = {
        ...submittedLicense,
        [index]: { ...submittedLicense[index], [name]: files[0] },
      };
    } else {
      newFormData = {
        ...submittedLicense,
        [index]: { ...submittedLicense[index], [name]: value },
      };
    }

    setSubmittedLicense(newFormData);
  };

  const handleLicenseDateChange = (e, index) => {
    const newFormData = {
      ...submittedLicense,
      [index]: { ...submittedLicense[index], date: e },
    };
    setSubmittedLicense(newFormData);
  };

  const addNewLicenseForm = () => {
    setLicenseForms([...licenseForms, licenseForms.length]);
  };

  // const addNewFishEntry = () => {
  //   setFishEntries([
  //     ...fishEntries,
  //     { name: "", age: "", size: "", weight: "", price: "", file: null },
  //   ]);
  // };

  const handleFishChange = (index, e) => {
    const { name, value, files } = e.target;
    const updatedFishEntries = [...fishEntries];

    if (files) {
      updatedFishEntries[index].file = files[0]; // store first file only
    } else {
      updatedFishEntries[index][name] = value;
    }

    setFishEntries(updatedFishEntries);
  };

  const handleLicenseClose = (e, index) => {
    const filteredLicenseForms = [
      ...licenseForms.slice(0, index),
      ...licenseForms.slice(index + 1),
    ];
    setLicenseForms(filteredLicenseForms);
    setSubmittedLicense((prevData) => {
      const newData = { ...prevData };
      delete newData[index];
      return newData;
    });
  };

  async function handleSubmit() {
    const fishDataList = [];

    // Navigate(`/order-fish-payment/${order.id}`, {
    //   state: {
    //     fishEntries,
    //     submittedLicense,
    //     orderId: order.id
    //   }
    // });

    let response;
    for (const fish of fishEntries) {
      response = await createFishOrderInfo(
        fish.name,
        fish.age,
        fish.size,
        fish.weight,
        fish.price,
        fish.file,
        order.id
      );
    }

    const submittedLicenseArray = Object.values(submittedLicense);
    if (response) {
      let licenseData;

      if (submittedLicenseArray.length > 0) {
        for (let i = 0; i < submittedLicenseArray.length; i++) {
          console.log(submittedLicenseArray[i].name);
          console.log(submittedLicenseArray[i]);

          console.log(fishDataList[i]);
          console.log(fishDataList);
          licenseData = await createLicenseOrderInfo(
            submittedLicenseArray[i].name,
            submittedLicenseArray[i].description,
            new Date(submittedLicenseArray[i].date).toISOString(),
            response
          );
          console.log(licenseData);
          const fileList = Object.keys(submittedLicenseArray[i])
            .filter((key) => key.startsWith("file-"))
            .map((key) => submittedLicenseArray[i][key]);
          try {
            await createLicenseFiles(licenseData, fileList);
          } catch (error) {
            console.log(error);
            toast("Unexpected error has occurred");
          }
        }
        if (licenseData) {
          const paymentResponse = await calculateOrderPrice(order.id);
          if (paymentResponse) {
            toast("Added Fish and its License to the order successfully");
            setFishCreate(true);
          }
        } else {
          toast("Unexpected error has occurred");
        }
      } else {
        const paymentResponse = await calculateOrderPrice(order.id);
        if (paymentResponse) {
          toast("Add Fish to the order successfully");
          setFishCreate(true);
        } else {
          toast("Unexpected error has occurred");
        }
      }

      setSubmittedLicense({});
      setFishEntries([
        { name: "", age: "", size: "", weight: "", price: "", file: null },
      ]); // Reset to one empty fish entry
      setLicenseForms([]);
    } else {
      toast("Unexpected error has occurred");
    }
  }

  const handlePaymentNavigation = () => {
    navigate(`/customer-edit-order/${order.id}/order-conclusion-info`)
  }

  return (
    <div>
      <ToastUtil />
      <CustomBoxContainer>
        <div className="form-container">
          <h1>Fish Information</h1>
          {fishEntries.map((fish, index) => (
            <div key={index} className="form">
              <div className="form-group">
                <input
                  placeholder="Name"
                  type="text"
                  name="name"
                  className="form-input"
                  value={fish.name}
                  onChange={(e) => handleFishChange(index, e)}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Age"
                  type="number"
                  name="age"
                  className="form-input"
                  value={fish.age}
                  onChange={(e) => handleFishChange(index, e)}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Size"
                  type="number"
                  name="size"
                  className="form-input"
                  value={fish.size}
                  onChange={(e) => handleFishChange(index, e)}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Weight"
                  type="number"
                  name="weight"
                  className="form-input"
                  value={fish.weight}
                  onChange={(e) => handleFishChange(index, e)}
                />
              </div>
              <div className="form-group">
                <input
                  placeholder="Price"
                  type="number"
                  name="price"
                  className="form-input"
                  value={fish.price}
                  onChange={(e) => handleFishChange(index, e)}
                />
              </div>
              <div className="form-group">
                <input
                  type="file"
                  name="file"
                  className="form-input"
                  onChange={(e) => handleFishChange(index, e)}
                />
              </div>
            </div>
          ))}
          <div style={{ display: "flex", gap: "10px" }}>
            {/* <button className="form-button" onClick={() => addNewFishEntry()}>
              Add Fish
            </button> */}

            <button className="form-button" onClick={addNewLicenseForm} style={{ width: "50%" }}>
              Add License
            </button>

            <button className="form-button" onClick={() => handleSubmit()} style={{ width: "50%" }}>
              Submit
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {fishCreate && (
              <button className="form-button" onClick={() => handlePaymentNavigation()} style={{ width: "60%", marginTop: "10px" }}>
                Make your payment
              </button>
            )}
          </div>
        </div>

        <div >
          {previewUrl && previewUrl.map && previewUrl.map((url, index) => (
            <img key={index} src={url} alt="Preview" style={{ maxWidth: "40vw", marginBottom: "20px" }} />
          ))}
        </div>

      </CustomBoxContainer>

      {licenseForms.map((index) => (
        <License
          key={index}
          handleLicenseChange={(e) => handleLicenseChange(e, index)} // Pass the index to track the form
          dateChange={(e) => handleLicenseDateChange(e, index)}
          handleLicenseFormClose={(e) => handleLicenseClose(e, index)}
          index={index} // Pass the index to License component
        />
      ))}
    </div>
  );
}

export default FishInfo;
