import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Video from "../assets/new/video 1.mp4";

motion;
const AboutUs = () => {
  return (
    <div className="bg-primary">
      <Header
        heading="About Us"
        BgVideo={Video}
        para={
          "Experience cinema like never before. Immersive visuals, premium sound, and unforgettable moments."
        }
      />
      {/* About Brand Section */}{" "}
      <div className="flex flex-col items-center justify-center text-center text-textColor max-w-7xl mx-auto py-12 px-6">
        {" "}
        <motion.h1
          initial={{ y: 60 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          ABOUT BRAND
        </motion.h1>{" "}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.6 }}
          className="space-y-3 text-gray-300 text-base sm:text-lg leading-relaxed text-justify sm:text-start"
        >
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="block text-justify"
          >
            Cine Square Entertainment Private Limited (CSEPL) is an innovative
            entertainment company with a reputation for building progressive and
            world-class cinemas, Miniplexes and Multiplexes. Thriving in the
            industry for over 3 decades in distribution and exhibition, we now
            help create cozy family entertainment experiences at your location
            across India. Headquartered in Indore (MP), CSEPL assists theatre
            owners, builders, developers, and proprietors to set up smart luxury
            cinemas across India. Our expert team takes pride in establishing
            multiplexes, cineplexes, and mini theatres in Tier I, Tier II, and
            Tier III cities. Currently, we have 18 World-class Cinema Screens
            operational & Coming up with 20 + Screens Pan India Very Soon.
          </motion.span>
        </motion.div>
        {/* INFO SECTION */}
        <div className=" py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="  "
          >
            {/* Cine Square Offers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="mb-4 text-base sm:text-lg"
            >
              <p className="text-2xl sm:text-4xl md:text-5xl text-yellow-400 font-semibold mb-4">
                Mission
              </p>
              <p className="list-disc  text-justify text-gray-300 space-y-2">
                Our company's mission is to exceed our movie-goers' expectations
                through a quality cinema viewing experience. Our commitment to
                our customers enables us to build a cozy family entertainment
                space that delights them to keep coming back again for more.
                Operational excellence and superior service delivery are key
                components of our mission statement.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl sm:text-4xl md:text-5xl text-yellow-400 font-semibold mb-4">
                Vision
              </p>
              <p className="list-disc  text-base sm:text-lg text-justify text-gray-300 space-y-2">
                CINE SQUARE aims to continually redefine the cinema viewing
                experience for movie enthusiasts, providing world-class and
                fascinating viewing. And become world’s most preferred cinema
                partner for viewers, partners and movie distributors.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
