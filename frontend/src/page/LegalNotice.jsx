import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const LegalNotice = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-primary text-gray-200 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto  p-8 sm:p-12 "
        >
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-yellow-400 mb-10">
            Legal Notice
          </h1>
          <hr className="text-white/30 my-10" />

          {/* Content */}
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              This website is owned and operated by{" "}
              <span className="font-semibold text-yellow-400">
                Cine Square Entertainment Pvt. Ltd. (CSEPL)
              </span>
              . By accessing or using this website, you agree to comply with and
              be bound by the following terms and conditions. Please read them
              carefully before using our site.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              1. Ownership of Content
            </h2>
            <p>
              All text, images, logos, designs, videos, and other materials on
              this website are the property of CSEPL unless otherwise stated.
              Any unauthorized use, reproduction, or distribution of this
              content is strictly prohibited and may result in legal action.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              2. Accuracy of Information
            </h2>
            <p>
              While we strive to keep information up-to-date and accurate, CSEPL
              does not guarantee that all information on this site is complete
              or free from error. We reserve the right to modify content,
              pricing, or offers at any time without prior notice.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              3. Intellectual Property Rights
            </h2>
            <p>
              All trademarks, logos, and brand names appearing on this website
              are the property of their respective owners. Use of these
              trademarks without authorization is strictly prohibited.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              4. Limitation of Liability
            </h2>
            <p>
              CSEPL shall not be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the use or
              inability to use this website, including but not limited to system
              errors, interruptions, or data loss.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              5. External Links
            </h2>
            <p>
              This website may contain links to external websites operated by
              third parties. CSEPL is not responsible for the content or
              reliability of any linked websites and does not necessarily
              endorse the views expressed within them.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              6. Privacy & Data Protection
            </h2>
            <p>
              CSEPL respects your privacy. Any personal information collected
              through this website will be handled in accordance with our{" "}
              <span className="text-yellow-400">Privacy Policy</span>. We do not
              share, sell, or rent your information to third parties without
              your consent.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              7. Changes to Legal Notice
            </h2>
            <p>
              CSEPL reserves the right to update or modify this Legal Notice at
              any time. Users are encouraged to review this page periodically to
              stay informed of any changes.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              8. Contact Information
            </h2>
            <p>
              For any questions or concerns regarding this Legal Notice, please
              contact us at:
            </p>
            <ul className="list-disc ml-6 space-y-1 text-gray-300">
              <li>
                Email:{" "}
                <span className="text-yellow-400 font-semibold">
                  info@cinesquare.in
                </span>
              </li>
              <li>
                Phone:{" "}
                <span className="text-yellow-400 font-semibold">
                  09826488991
                </span>
              </li>
              <li>
                Address: Cine Square Entertainment Pvt. Ltd., Indore, Madhya
                Pradesh, India.
              </li>
            </ul>

            <p className="mt-10 text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} Cine Square Entertainment Pvt. Ltd.
              All Rights Reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalNotice;
