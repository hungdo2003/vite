import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import License from "../utils/License";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";
import { createFishOrderInfo } from "../../../../utils/axios/fish";
import { createLicenseFiles, createLicenseOrderInfo } from "../../../../utils/axios/license";
import { calculateOrderPrice } from "../../../../utils/axios/order";

const CustomBoxContainer = styled(Box)(() => ({
    display: "flex",
    gap: "40px"
}));

// eslint-disable-next-line react/prop-types
function FishInfo({ orderId, formStepData }) {
    const [fishName, setFishName] = useState("");
    const [fishAge, setFishAge] = useState("");
    const [fishSize, setFishSize] = useState("");
    const [fishWeight, setFishWeight] = useState("");
    const [fishPrice, setFishPrice] = useState("");
    const [licenseForms, setLicenseForms] = useState([]); // Manage multiple forms

    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState(null);

    const [submittedLicense, setSubmittedLicense] = useState({});
    const [totalAddedFishes, setTotalAddedFishes] = useState(0);
    
    const handleAddLicenseForm = (e, index) => {
        const { name, value, files } = e.target;
        let newFormData;

        if (files) {
            // If there are files (indicating it's a file input), store the file(s) instead of the value
            newFormData = { ...submittedLicense, [index]: { ...submittedLicense[index], [name]: files[0] } }; // store first file only
        } else {
            // Handle regular input fields
            newFormData = { ...submittedLicense, [index]: { ...submittedLicense[index], [name]: value } };
        }

        setSubmittedLicense(newFormData);
    };

    const handleLicenseDateChange = (e, index) => {
        const newFormData = { ...submittedLicense, [index]: { ...submittedLicense[index], 'date': e } };
        setSubmittedLicense(newFormData);
    }

    const addNewForm = () => {
        setLicenseForms([...licenseForms, licenseForms.length]); // Add a new form based on its index
    };

    const handleFishFileChange = (e) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    useEffect(() => {
        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        }

        reader.readAsDataURL(file);
    }, [file]);

    function handleNameChange(e) {
        setFishName(e.target.value);
    }

    function handleContinue() {
        formStepData(2);
    }

    const handleLicenseClose = (e, index) => {
        const filteredLicenseForms = [...licenseForms.slice(0, index), ...licenseForms.slice(index + 1)];
        setLicenseForms(filteredLicenseForms);
        setSubmittedLicense((prevData) => {
            const newData = { ...prevData }; // Create a shallow copy of the previous state
            delete newData[index]; // Remove the specified index
            return newData; // Return the updated object
        });
    }

    async function handleSubmit() {
        const fishData = await createFishOrderInfo(
            fishName,
            fishAge,
            fishSize,
            fishWeight,
            fishPrice,
            file,
            orderId
        );
        const submittedLicenseArray = Object.values(submittedLicense);

        if (fishData) {
            let licenseData;

            if (submittedLicenseArray.length > 0) {
                for (var i = 0; i < submittedLicenseArray.length; i++) {
                    licenseData = await createLicenseOrderInfo(
                        submittedLicenseArray[i].name,
                        submittedLicenseArray[i].description,
                        new Date(submittedLicenseArray[i].date).toISOString(),
                        fishData
                    )
                    const fileList = Object.keys(submittedLicenseArray[i])
                        .filter(key => key.startsWith("file-"))  // Filter keys that start with "file-"
                        .map(key => submittedLicenseArray[i][key]);  // Map them to their respective values
                    try {
                        await createLicenseFiles(
                            licenseData,
                            fileList
                        )
                    } catch (error) {
                        console.log(error);
                        toast("Unexpected error has been occurred");
                    }
                }
                if (licenseData) {
                    toast("Add Fish and its License to the order successfully");
                } else {
                    toast("Unexpected error has been occurred");
                }
            } else {
                toast("Add Fish to the order successfully");
            }
            setSubmittedLicense({});
            setFishName("");
            setFishAge("");
            setFishSize("");
            setFishWeight("");
            setFishPrice("");
            setFile(null);
            setLicenseForms([]);
            setTotalAddedFishes(totalAddedFishes + 1);
            await calculateOrderPrice(orderId);
        } else {
            toast("Unexpected error has been occurred");
        }

    }

    function handleAgeChange(e) {
        setFishAge(e.target.value);
    }

    function handleSizeChange(e) {
        setFishSize(e.target.value);
    }

    function handleWeightChange(e) {
        setFishWeight(e.target.value);
    }

    function handlePriceChange(e) {
        setFishPrice(e.target.value);
    }

    return (
        <div>
            <ToastUtil />
            <CustomBoxContainer>
                <div className="form-container">
                    <h1>Fish Information</h1>
                    <div className="form">
                        <div className="form-group">
                            <input
                                placeholder="Name"
                                type="text"
                                name="name"
                                className="form-input"
                                value={fishName}
                                onChange={e => handleNameChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Age"
                                type="number"
                                name="age"
                                className="form-input"
                                value={fishAge}
                                onChange={e => handleAgeChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Size"
                                type="number"
                                name="size"
                                className="form-input"
                                value={fishSize}
                                onChange={e => handleSizeChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Weight"
                                type="number"
                                name="weight"
                                className="form-input"
                                value={fishWeight}
                                onChange={e => handleWeightChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                placeholder="Price"
                                type="number"
                                name="price"
                                className="form-input"
                                value={fishPrice}
                                onChange={e => handlePriceChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="file"
                                name="file"
                                className="form-input"
                                onChange={e => handleFishFileChange(e)}
                            />
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button className="form-button" onClick={() => handleSubmit()}>
                                Submit
                            </button>
                            <button className="form-button" onClick={() => addNewForm()}>
                                Add License
                            </button>
                            {totalAddedFishes > 0 && (
                                <button className="form-button" onClick={() => handleContinue()}>
                                    Next Step
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                <div>
                    {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxWidth: "40vw" }} />}
                </div>
            </CustomBoxContainer>

            {licenseForms.map((index) => (
                <License
                    key={index}
                    handleLicenseChange={(e) => handleAddLicenseForm(e, index)} // Pass the index to track the form
                    dateChange={(e) => handleLicenseDateChange(e, index)}
                    handleLicenseFormClose={(e) => handleLicenseClose(e, index)}
                />
            ))}
        </div>

    )
}

export default FishInfo;