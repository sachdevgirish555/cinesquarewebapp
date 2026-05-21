import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const Career = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />

      {/* ✨ Hero Section */}
      <section className="relative py-30 px-6 md:px-20 text-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-textColor"
        >
          Join Our Cinematic Journey
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed"
        >
          At <span className="text-textColor font-semibold">Cine Square</span>,
          we believe in creativity, collaboration, and passion for storytelling.
          If you’re someone who enjoys working on innovative projects and loves
          the magic of cinema — this is your place.
        </motion.p>
      </section>

      {/* 💼 Careers Info Section */}
      <section className="max-w-5xl mx-auto px-6 md:px-10 ">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white/5 p-8 md:p-12 rounded-2xl shadow-lg"
        >
          <h2 className="text-3xl font-semibold mb-4 text-textColor">
            Careers at Cine Square
          </h2>
          <p className="text-gray-300 leading-relaxed mb-8">
            We offer a progressive and open work environment that nurtures
            creativity and encourages innovation. If you are passionate, driven,
            and enjoy taking on new challenges, we’d love to have you on our
            team.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between bg-[#262626] p-6 rounded-xl">
            <div className="flex items-center gap-4">
              <Mail className="text-textColor w-8 h-8" />
              <div>
                <p className="text-lg text-gray-400">Send us your resume at</p>
                <a
                  href="mailto:info@cinesquare.in"
                  className="text-xl text-textColor font-semibold hover:underline"
                >
                  info@cinesquare.in
                </a>
              </div>
            </div>

            <motion.a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=info@cinesquare.in&su=${encodeURIComponent("Career Application – Cine Square")}&body=${encodeURIComponent("Hi Cine Square Team,\n\nI am interested in exploring career opportunities with your organization.\n\nPlease find my resume attached.\n\nThank you!")}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 md:mt-0 bg-textColor text-primary font-semibold px-6 py-3 rounded-full shadow-md hover:bg-textColor/50 hover:text-black transition-all duration-300"
            >
              Apply Now
            </motion.a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Career;
