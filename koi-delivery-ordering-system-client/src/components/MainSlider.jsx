import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import SignInSlider1 from "../assets/sign_in_slider_1.png";
import SignInSlider2 from "../assets/sign_in_slider_2.png";
import SignInSlider3 from "../assets/sign_in_slider_3.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BoxSlider = styled(Box)(({ theme }) => ({
  backgroundColor: "#F9F9F9",
  borderRadius: theme.spacing(2),
}));

const SliderItem = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(9),
  paddingBottom: theme.spacing(5),
  textAlign: "center",
}));

const SliderImg = styled(Box)(({ theme, backgroundImage }) => {
  return {
    height: "50vh",
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto",
    backgroundPosition: "center",
    position: "relative",
    backgroundImage: `url(${backgroundImage})`,
  };
});

const SliderContentBox = styled(Box)(({ theme }) => ({}));

const SliderTitle = styled(Box)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 500,
  marginBottom: theme.spacing(2),
  marginTop: theme.spacing(8),
}));

const SliderDes = styled(Box)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 500,
}));

const MainSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <BoxSlider>
      <Slider {...settings}>
        <SliderItem>
          <SliderImg backgroundImage={SignInSlider1} />
          <SliderContentBox>
            <SliderTitle>Schedule & Optimize Delivery</SliderTitle>
            <SliderDes>Schedule all your deliveries in one platform.</SliderDes>
          </SliderContentBox>
        </SliderItem>
        <SliderItem>
          <SliderImg backgroundImage={SignInSlider3} />
          <SliderContentBox>
            <SliderTitle>Proof of Delivery</SliderTitle>
            <SliderDes>
              Get the proof you need to meet compliance (signature, photo, and
              geotags).
            </SliderDes>
          </SliderContentBox>
        </SliderItem>
        <SliderItem>
          <SliderImg backgroundImage={SignInSlider2} />
          <SliderContentBox>
            <SliderTitle>Tracking</SliderTitle>
            <SliderDes>
              Track postal, on-demand, scheduled and/or in-house drivers all in
              one place.
            </SliderDes>
          </SliderContentBox>
        </SliderItem>
      </Slider>
    </BoxSlider>
  );
};

export default MainSlider;
