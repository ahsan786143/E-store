"use client";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
const testimonials = [
  {
    name: "Ahsan Ali",
    review: `The content quality is impressive and very well structured.
Every topic is explained in a way that makes sense even to beginners.`,
    rating: 5,
  },
  {
    name: "Sara Khan",
    review: `The content quality is impressive and very well structured.
Every topic is explained in a way that makes sense even to beginners.
`,
    rating: 4,
  },
  {
    name: "Usman Raza",
    review: `The step-by-step approach makes learning smooth and stress-free.
I especially liked how mistakes were explained instead of just giving answers.
`,
    rating: 5,
  },
  {
    name: "Hina Malik",
    review: `The content quality is impressive and very well structured.
Every topic is explained in a way that makes sense even to beginners.
`,
    rating: 4,
  },
  {
    name: "Bilal Ahmed",
    review: `What I liked most is the focus on practical knowledge.
The examples are relevant and based on real-world scenarios.
It has definitely improved my problem-solving skills.`,
    rating: 5,
  },
  {
    name: "Zainab Noor",
    review: `This has been a great learning experience from start to finish.
The explanations are detailed without being confusing or boring.
`,
    rating: 4,
  },
  {
    name: "Hamza Farooq",
    review: `I have tried multiple learning platforms before, but this one stands out.
The clarity and consistency of the content make a big difference.
`,
    rating: 5,
  },
  {
    name: "Ayesha Siddiqui",
    review: `The learning process feels smooth and well-paced. I never felt rushed or lost while going through the material.
.`,
    rating: 4,
  },
  {
    name: "Faizan Khan",
    review: `I have tried multiple learning platforms before, but this one stands out.
The clarity and consistency of the content make a big difference.`,
    rating: 5,
  },
  {
    name: "Nida Hassan",
    review: `This platform offers great value for anyone looking to improve skills.
The lessons are clear, engaging, and very informative.`,
    rating: 4,
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 3,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 786,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="lg:px-32 px-4 sm:pt-20 pt-5 pb-10">
  <h2 className="text-center sm:text-4xl text-2xl mb-10 font-semibold">Customer Reviews</h2>
  <Slider {...settings}>
    {testimonials.map((item, index) => (
      <div key={index} className="p-5">
        <div className="border rounded-lg p-6 shadow-md bg-white dark:bg-gray-800 transition-transform transform hover:scale-105 duration-300">
          <BsChatQuote className="text-3xl  mb-4" />
          <p className="mb-5 text-gray-700 dark:text-gray-200">{item.review}</p>
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</h4>
          <div className="flex mt-2">
            {Array.from({ length: item.rating }).map((_, i) => (
              <IoStar key={`star${i}`} size={20} className="text-yellow-500 mr-1" />
            ))}
          </div>
        </div>
      </div>
    ))}
  </Slider>
</div>

  );
};

export default Testimonial;
