import React, { Component } from "react";
import Slider from "react-slick";

// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Import Image files
import Image1 from "./slide/slide_1.png"
import Image2 from "./slide/slide_2.png"
import Image3 from "./slide/slide_3.png"
import Image4 from "./slide/slide_4.png"
import Image5 from "./slide/slide_5.png"
import Image6 from "./slide/slide_6.png"



export default class CenterMode extends Component {
  render() {
    const baseUrl = [
      {image: Image1, "event":"ALBINO"},
      {image: Image2},
      {image: Image3},
      {image: Image4},
      {image: Image5},
      {image: Image6},
    ];

    const settings = {
      dots: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 4000,
      pauseOnHover: true,
      arrows: false,
    };

    const SlideItem = (idx) => {
      const slideEvent = "slide_item " + baseUrl[idx].event || 'slide_item';
      return (
        <div className={slideEvent}>
          <img className="slide_image" src={baseUrl[idx].image} />
        </div>
      );
    }

    return (
      <Slider {...settings}>
        {SlideItem(0)}
        {SlideItem(1)}
        {SlideItem(2)}
        {SlideItem(3)}
        {SlideItem(4)}
        {SlideItem(5)}
      </Slider>
    );
  }
}