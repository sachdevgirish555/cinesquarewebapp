import React from "react";
import Slider from "react-slick";
import { Quote } from "lucide-react";

// Import images
import Studio1 from "../assets/20th-Century-Studios.png";
import Studio2 from "../assets/Disney.png";
import Studio3 from "../assets/DreamWorks.png";
import Studio4 from "../assets/Sony-Pictures.png";
import Studio5 from "../assets/Universal-Pictures.png";
import { motion } from "framer-motion";

const Testimonials = () => {
  const testimonials = [
    {
      image: Studio1,
      text: "The experience at Cine Square CinemaCinemas is unmatched. From comfort to sound quality, everything feels premium!",
    },
    {
      image: Studio2,
      text: "Finally, a cinema that feels like home. The recliners and service make every movie a memorable experience.",
    },
    {
      image: Studio3,
      text: "Cine Square Cinemais more than just a movie theatre – it's the future of entertainment. I always recommend it to friends.",
    },
    {
      image: Studio4,
      text: "As a long-time movie lover, Cine Square Cinemaoffers the perfect blend of technology and entertainment. Truly next-level!",
    },
    {
      image: Studio5,
      text: "From blockbusters to indie films, Cine Square Cinemamakes every screening unforgettable. The best cinema experience ever!",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    centerMode: true,
    centerPadding: "0px",
  };

  return (
    <div className="my-10">
      {/* Heading */}
      <div className="flex justify-center">
        <h5 className=" text-4xl md:text-5xl tracking-tight text-center leading-snug font-semibold text-gray-800">
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="inline-block"
          >
            OUR&nbsp;
          </motion.span>

          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="inline-block"
          >
            PARTNERS
          </motion.span>
        </h5>
      </div>

      {/* Slider */}
      <div className="max-w-4xl mx-auto my-8 py-16 px-6">
        <Slider {...settings}>
          {testimonials.map((item, index) => (
            <div key={index} className="text-center px-10 my-12">
              {/* Top - Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={item.image}
                  alt={`testimonial-${index}`}
                  className="w-40 h-40 object-contain  p-3 "
                />
              </div>

              {/* Quote Icons + Text */}
              <div className="relative text-gray-700 p-10 rounded-xl">
                <Quote className="absolute -top-5 -left-5 w-8 h-8 text-textColor opacity-60 rotate-180" />
                <p className="text-xl italic leading-relaxed">{item.text}</p>
                <Quote className="absolute -bottom-5 -right-5 w-8 h-8 text-textColor opacity-60" />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Testimonials;
