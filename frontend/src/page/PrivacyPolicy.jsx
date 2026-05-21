import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div>
      <Navbar />
      <div className="bg-primary text-gray-200 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto  p-8 sm:p-12 "
        >
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-yellow-400 mb-10">
            Privacy Policy
          </h1>
          <hr className="text-white/30 my-10" />
          {/* Content */}
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              This Privacy Policy describes how Your privacy is important to us
              at cinesquare.in. We recognize that when you choose to provide us
              with information about yourself, you trust us to act in a
              responsible manner. This information helps us improve your movie
              going experience with better content, services and opportunities.
              This policy tells you about the information gathering and
              dissemination that we conduct. As we continue to grow, this policy
              may change, so please check back every time you use the website
              for updates Cinesquare.in has implemented security measures to
              protect against the loss, misuse and alteration of the information
              under our control. We protect the secure areas of our Site with a
              firewall. Although Cinesquare.in has implemented adequate security
              measures, the User is advised to employ virus scans for extra
              security, as Cinesquare.in is not liable for any virus picked up
              at the time of transmission.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
