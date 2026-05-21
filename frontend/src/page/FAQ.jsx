import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Why Cine Square?",
      answer:
        "At Cine Square, we believe cinema is more than just watching a movie — it’s an experience of emotion, comfort, and innovation. From luxurious seating and immersive sound to curated dining and community engagement, we redefine the way India experiences film. Our vision blends cultural elegance with global standards to bring magic to every frame. Also for Our Franchise Partners, we ensure a high return value business model & Long term partnership.",
    },
    {
      question: "What are the Requirements to be Cine Square franchisee?",
      answer:
        "To Open a Cine Square Cinemas Franchisee, One should have a space of  6000 - 15000 sq. ft. with clear height of  Minimum 14 feet & Investment Starts from 1.5 Cr and varies  based on location and seat capacity.",
    },
    {
      question: "What are the Business Models? ",
      answer:
        "We have basically franchise model designed to create a true win-win partnership. Profit Sharing/ Revenue Sharing with Franchisee – We have a proper Business model where both the franchise owner and Cine Square grow and earn together. For Details Connect with us or Fill form on Contact us page and will contact u soon.",
    },

    {
      question: "Is there any One time Fee?",
      answer:
        "Yes there is a One Time Fee that gives you access to our brand, expertise, and complete Know how of Cinema industry.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-primary">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pb-20 pt-40">
        <h2 className="text-4xl font-bold text-center text-textColor mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-300/60 bg-textColor/5 rounded-xl overflow-hidden shadow-md"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
              >
                <span className="font-semibold text-lg text-textColor">
                  {faq.question}
                </span>
                <span className="text-textColor text-2xl">
                  {openIndex === index ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-white">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
