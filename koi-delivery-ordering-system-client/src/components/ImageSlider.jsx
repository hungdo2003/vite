/* eslint-disable react/prop-types */
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Table, Tag } from "antd";
import "./style/image_slider.scss"; // Import the CSS for the spinner
import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";

// Function to get status label based on status code
const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return <Tag color="red">Sick</Tag>;
    case 1:
      return <Tag color="green">Good</Tag>;
    case 2:
      return <Tag color="orange">Normal</Tag>;
    default:
      return <Tag color="gray">Unknown</Tag>;
  }
};

const ImageSlider = ({ fishInfo, images, onImageChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    cssEase: "linear",
    afterChange: (current) => setCurrentIndex(current),
  };

  useEffect(() => {
    if (fishInfo && onImageChange && fishInfo[currentIndex]) {
      onImageChange(fishInfo[currentIndex]);
    }
  }, [currentIndex]);

  // Columns for Ant Design table
  const columns = [
    {
      dataIndex: "attribute",
      key: "attribute",
    },
    {
      dataIndex: "value",
      key: "value",
    },
  ];

  const fishDetails = fishInfo ? fishInfo[currentIndex] || fishInfo[0] : null;
  const data = fishDetails
    ? [
        { key: "2", attribute: "Size", value: `${fishDetails.size} cm` },
        { key: "3", attribute: "Age", value: `${fishDetails.age} years` },
        { key: "4", attribute: "Weight", value: fishDetails.weight },
        { key: "5", attribute: "Price", value: fishDetails.price },
      ]
    : [];

  return (
    <div className="image-slider">
      {fishDetails && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={4} style={{ color: "#01428E", marginRight: "10px" }}>
            {fishDetails.name}
          </Title>
          {getStatusLabel(fishDetails.status)}
        </div>
      )}

      {images && images.length > 1 ? (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              {fishInfo && fishInfo[index] && (
                <div className="fish-details">
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    bordered
                    size="small"
                  />
                </div>
              )}
            </div>
          ))}
        </Slider>
      ) : (
        <div>
          <img
            src={images[0]}
            alt={`Slide ${images[0]}`}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
          {fishDetails && (
            <div className="fish-details">
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                bordered
                size="small"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageSlider;
