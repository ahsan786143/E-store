"use client"
import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
 
const ArrowNext=(props)=>{
  const {onClick}=props 
  return(
    <button type="button" onClick={onClick} className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10 ">
      <LuChevronRight size={25} className=" text-gray-600"/>

    </button>
  )
}
const ArrowPrev=(props)=>{
  const {onClick}=props 
  return(
    <button type="button" onClick={onClick} className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10 ">
      <LuChevronLeft size={25} className=" text-gray-600"/>

    </button>
  )
}
const MainSlider = () => {
  const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  
  nextArrow: <ArrowNext />,
  prevArrow: <ArrowPrev />,

  responsive: [
    {
      breakpoint: 480,
      settings: {
        dots: false,
        arrows: false
      }
    }
  ]
};


  return (
    <div>
      <Slider {...settings}>
        <div>
          <img src="/assets/images/slider-1.png" alt="slider" />
        </div>
        <div>
          <img src="/assets/images/slider-2.png" alt="slider" />
        </div>
        <div>
          <img src="/assets/images/slider-3.png" alt="slider" />
        </div>
        <div>
          <img src="/assets/images/slider-4.png" alt="slider" />
        </div>
      </Slider>
    </div>
  )
}

export default MainSlider
