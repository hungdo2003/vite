import { useLocation, useNavigate } from "react-router-dom";
import "./MainContent.scss";
import { Button, Card, Flex, Typography } from "antd";
import { useEffect, useState } from "react";
import { getFileByFileId } from "../../../../utils/axios/file";
import ImageSlider from "../../../../components/ImageSlider";

import { Box, FormControl, InputLabel, MenuItem, Modal, Select } from "@mui/material";
import dateTimeConvert from "../../../../components/utils";
import { updateFishStatusById } from "../../../../utils/axios/fish";
import { toast } from "react-toastify";
import ToastUtil from "../../../../components/toastContainer";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const MainContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [imagePreviews, setImagePreviews] = useState([]);
  const [licenseImage, setLicenseImage] = useState([]);
  const [fish, setFish] = useState();
  const [selectedFishLicenses, setSelectedFishLicenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [fishStatus, setFishStatus] = useState(1);

  const handleGoBack = () => {
    navigate(-1); // This will take you to the previous page
  };

  function handleSlider(e) {
    setFish(e);
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  async function handleLicenseImages(license) {
    handleOpen();
    if (Array.isArray(license.files) && license.files.length > 0) {
      const imagePromises = license.files.map(async (file) => {
        const fileId = file.file.id;
        const imageResponse = await getFileByFileId(fileId);
        return URL.createObjectURL(new Blob([imageResponse], { type: "image/jpg" }));
      });

      // Wait for all promises to resolve (i.e., all image URLs to be fetched)
      const imageUrls = await Promise.all(imagePromises);
      setLicenseImage(imageUrls);
    }
  }

  useEffect(() => {
    async function fetchFishImages() {
      try {
        // Ensure state.fishes is an array and has content before proceeding
        if (Array.isArray(state.fishes) && state.fishes.length > 0) {
          const imagePromises = state.fishes.map(async (fish) => {
            const fileId = fish.file.id;
            const imageResponse = await getFileByFileId(fileId);
            return URL.createObjectURL(new Blob([imageResponse], { type: "image/jpeg" }));
          });

          // Wait for all promises to resolve (i.e., all image URLs to be fetched)
          const imageUrls = await Promise.all(imagePromises);
          setImagePreviews(imageUrls); // Set the image preview to an array of URLs
        }
      } catch (error) {
        console.error("Error fetching fish images:", error);
      }
    }

    fetchFishImages();
  }, [state.fishes]);

  useEffect(() => {
    if (fish) {
      if (fish.licenses && fish.licenses.length > 0) {
        if (Array.isArray(fish.licenses) && fish.licenses.length > 0) {
          setSelectedFishLicenses(fish.licenses);
        }
      } else {
        setSelectedFishLicenses([]);
      }
      setFishStatus(fish.status);
    }

  }, [fish]);

  console.log(fish);
  const cardStyle = {
    width: 300,
  };


  const handleStatusChange = async (event) => {
    setFishStatus(event.target.value);
    console.log(event.target.value);
    const response = await updateFishStatusById(fish.id, event.target.value);
    if (response) {
      toast("Update fish's status successfully");
    } else {
      toast("Unexpected error has been occurred")
    }
  };

  return state && (
    <Box style={{ display: "flex" }}>
      <ToastUtil />
      <div className="main-content-license-delivery">
        <div className="slider-container">
          <ImageSlider fishInfo={state.fishes} images={imagePreviews} onImageChange={e => handleSlider(e)} />
        </div>

        {state.orderStatus === 6 && (
          <Box sx={{ maxWidth: 180, marginTop: "20px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Fish Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={fishStatus}
                label="Status"
                onChange={(e) => handleStatusChange(e)}
              >
                <MenuItem value={1}>Good</MenuItem>
                <MenuItem value={2}>Sick</MenuItem>
                <MenuItem value={3}>Dead</MenuItem>
              </Select>
            </FormControl>

            <Button type="primary" style={{ marginTop: "20px" }} onClick={() => handleGoBack()}>
              Go back
            </Button>
          </Box>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={modalStyle}>
            <div className="slider-container">
              <ImageSlider fishInfo={null} images={licenseImage} onImageChange={e => handleSlider(e)} />
            </div>
          </Box>
        </Modal>

        <div className="card-container">
          {selectedFishLicenses && selectedFishLicenses.map && selectedFishLicenses.map((license, index) => {
            if (index >= 3) return null;
            return (
              <Card
                key={index}
                hoverable
                style={cardStyle}
                styles={{
                  body: {
                    padding: 0,
                    overflow: "hidden",
                  },
                }}
              >
                <Flex
                  vertical
                  align="flex-end"
                  justify="space-around"
                  style={{
                    padding: 32,
                  }}
                >
                  <Typography
                    level={5}
                    style={{ width: "100%" }}
                    ellipsis={{ rows: 4 }}
                  >
                    {license.name}
                  </Typography>
                  <Typography.Title
                    level={5}
                    style={{ width: "100%" }}
                    ellipsis={{ rows: 4 }}
                  >
                    {license.description}
                  </Typography.Title>
                  <Button type="primary" onClick={() => handleLicenseImages(license)}>
                    View Image
                  </Button>
                  <Typography
                    level={5}
                    style={{ width: "100%" }}
                    ellipsis={{ rows: 4 }}
                  >
                    Date of issue {dateTimeConvert(license.dateOfIssue)}
                  </Typography>
                </Flex>
              </Card>
            )
          })}
        </div>
      </div>

      {fish && (
        <div style={{marginTop: "20px"}}>
          <div className="form-container">
            <div className="form">
              <Typography>Name</Typography>
              <div className="form-group">
                <input
                  placeholder="Name"
                  type="text"
                  name="name"
                  className="form-input"
                  value={fish.name}
                />
              </div>

              <Typography>Age</Typography>
              <div className="form-group">
                <input
                  placeholder="Age"
                  type="text"
                  name="text"
                  className="form-input"
                  value={`${fish.age} years old`}
                />
              </div>

              <Typography>Size</Typography>
              <div className="form-group">
                <input
                  placeholder="Size"
                  type="text"
                  name="text"
                  className="form-input"
                  value={`${fish.size} cm`}
                  readOnly
                />
              </div>

              <Typography>Weight</Typography>
              <div className="form-group">
                <input
                  placeholder="Weight"
                  type="text"
                  name="text"
                  className="form-input"
                  value={`${fish.weight} gram`}
                  readOnly
                />
              </div>

              <Typography>Status</Typography>
              <div className="form-group">
                <input
                  placeholder="status"
                  type="text"
                  name="text"
                  className="form-input"
                  value={
                    fish.status === 1 ? "Good" :
                      fish.status === 2 ? "Sick" :
                        fish.status === 3 ? "Dead" :
                          ""
                  }
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
};

export default MainContent;
