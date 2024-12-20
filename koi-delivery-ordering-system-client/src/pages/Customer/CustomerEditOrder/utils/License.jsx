/* eslint-disable react/prop-types */
import { Box, styled } from "@mui/material";
import { useEffect, useState } from "react";
import { Calendar } from "react-date-range";
import CloseIcon from "@mui/icons-material/Close";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "./license.scss";
import { getFileByFileId } from "../../../../utils/axios/file";
import { getOneDayBeforeToday } from "../../../../components/utils";

const LicenseCustomBoxContainer = styled(Box)(() => ({
  display: "flex",
  gap: "40px",
  marginTop: "40px",
  marginBottom: "40px",
}));

const License = ({
  licenseData,
  handleLicenseChange,
  dateChange,
  handleLicenseFormClose,
}) => {
  const [previewUrls, setPreviewUrls] = useState(null);
  const [date, setDate] = useState(new Date());
  const [fileInputs, setFileInputs] = useState([{ id: 1, file: null }]);
  const [licenseName, setLicenseName] = useState();
  const [licenseDescription, setLicenseDescription] = useState();

  useEffect(() => {
    if (licenseData) {
      setDate(new Date(licenseData.dateOfIssue));
      setLicenseName(licenseData.name);
      setLicenseDescription(licenseData.description);
      handleLicenseChange({
        target: { name: "id", value: licenseData.id }
      });
    }
    async function fetchData() {
      // eslint-disable-next-line react/prop-types
      const fileIds = licenseData.files.map(license => license.file.id);
      if (fileIds && fileIds.length > 0) {
        const filesPromises = fileIds.map(async fileId => {
          const response = await getFileByFileId(fileId);
          return response; // Create Object URL from response blob
        });

        const filesArray = await Promise.all(filesPromises);

        setFileInputs(prevFileInputs => {
          // Create a copy of prevFileInputs to modify
          const updatedFileInputs = [...prevFileInputs];

          filesArray.forEach((file, index) => {
            if (index < updatedFileInputs.length) {
              updatedFileInputs[index].file = file; // Set the file URL
            } else {
              updatedFileInputs.push({ id: updatedFileInputs.length + 1, file });
            }
          });

          return updatedFileInputs;
        });
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const filePreviews = fileInputs.map((input) => {
      if (!input.file) return null;

      const reader = new FileReader();
      reader.readAsDataURL(input.file);

      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    });

    Promise.all(filePreviews).then((results) => {
      setPreviewUrls(results.filter(Boolean));
    });
  }, [fileInputs]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedFileInputs = [...fileInputs];
    updatedFileInputs[index].file = file;
    setFileInputs(updatedFileInputs);
    handleLicenseChange(e);
  };

  const handleNameChange = (e) => {
    setLicenseName(e.target.value);
    handleLicenseChange(e);
  }

  const handleDescriptionChange = (e) => {
    setLicenseDescription(e.target.value);
    handleLicenseChange(e);
  }

  const addFileInput = () => {
    setFileInputs([...fileInputs, { id: fileInputs.length + 1, file: null }]);
  };

  const handleDateChange = (e) => {
    setDate(e);
    dateChange(e);
  };

  return (
    <LicenseCustomBoxContainer>
      <div className="form-container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>License Information</h3>
          <div className="license-close-btn" onClick={handleLicenseFormClose}>
            {" "}
            <CloseIcon />
          </div>
        </div>
        <div className="form">
          <div className="form-group">
            <input
              placeholder="Name"
              type="text"
              name="name"
              className="form-input"
              value={licenseName}
              onChange={(e) => handleNameChange(e)}
            />
          </div>
          <div className="form-group">
            <input
              placeholder="Description"
              type="text"
              name="description"
              className="form-input"
              value={licenseDescription}
              onChange={(e) => handleDescriptionChange(e)}
            />
          </div>

          <Calendar onChange={(e) => handleDateChange(e)} date={date} maxDate={getOneDayBeforeToday()}/>

          {fileInputs &&
            fileInputs.map &&
            fileInputs.map((input, index) => (
              <div className="form-group" key={input.id}>
                <input
                  type="file"
                  name={`file-${input.id}`}
                  className="form-input"
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            ))}
          <button className="form-button" type="button" onClick={addFileInput}>
            Add Another File
          </button>
        </div>
      </div>
      <div>
        {previewUrls &&
          previewUrls.map &&
          previewUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Preview ${index + 1}`}
              style={{ width: "200px", height: "200px" }}
            />
          ))}
      </div>
    </LicenseCustomBoxContainer>
  );
};

export default License;
