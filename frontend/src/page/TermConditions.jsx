import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const TermConditions = () => {
  return (
    <div>
      <div className="">
        {" "}
        <Navbar />
      </div>
      <div className="min-h-screen  bg-primary text-gray-200 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-5xl mx-auto  p-8 sm:p-12  "
        >
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl font-bold text-center text-yellow-400 mb-10">
            Terms & Conditions
          </h1>
          <hr className="text-white/30 my-10" />
          {/* Content */}
          <div className="space-y-6 text-gray-300 leading-relaxed">
            <p>
              Welcome to{" "}
              <span className="font-semibold text-yellow-400">
                Cine Square Entertainment Pvt. Ltd. (CSEPL)
              </span>
              . These Terms & Conditions govern your use of our website and
              services. By accessing or using our site, you agree to comply with
              and be bound by these terms. Please read them carefully.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using our website, you acknowledge that you have
              read, understood, and agreed to be bound by these Terms &
              Conditions, along with our Privacy Policy. If you do not agree,
              you should not use our website.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              2. Use of Website
            </h2>
            <p>
              You agree to use the website only for lawful purposes and in a
              manner that does not violate any applicable laws or infringe the
              rights of others. Unauthorized or malicious use, including
              attempts to hack or damage the website, is strictly prohibited.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              3. Intellectual Property Rights
            </h2>
            <p>
              All content on this website, including text, graphics, logos,
              images, videos, and design elements, are the property of{" "}
              <span className="text-yellow-400">
                Cine Square Entertainment Pvt. Ltd.
              </span>{" "}
              and protected under copyright and trademark laws. You may not
              copy, reproduce, or distribute any content without prior written
              consent.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              4. Franchise and Partnership Information
            </h2>
            <p>
              Any information or data shared via our franchise inquiry or
              application form is intended solely for business communication
              between you and CSEPL. Submission of an application does not
              guarantee franchise approval or partnership.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              5. Limitation of Liability
            </h2>
            <p>
              CSEPL shall not be liable for any direct, indirect, incidental, or
              consequential damages resulting from the use or inability to use
              our website or services. We do not warrant that the site will
              always be available, error-free, or secure.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              6. External Links
            </h2>
            <p>
              Our website may contain links to third-party websites. We are not
              responsible for the content, policies, or reliability of any
              linked site. Accessing these sites is at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              7. Modification of Terms
            </h2>
            <p>
              CSEPL reserves the right to update or modify these Terms &
              Conditions at any time without prior notice. Changes will take
              effect immediately upon posting on this page. Continued use of the
              website indicates acceptance of any updated terms.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              8. Termination
            </h2>
            <p>
              We reserve the right to terminate or restrict access to our
              website at any time, without notice, for conduct that we believe
              violates these Terms & Conditions or is harmful to our interests.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              9. Governing Law & Jurisdiction
            </h2>
            <p>
              These Terms & Conditions are governed by and construed in
              accordance with the laws of India. Any disputes shall be subject
              to the jurisdiction of the courts located in Indore, Madhya
              Pradesh.
            </p>

            <h2 className="text-2xl font-semibold text-yellow-400 mt-8">
              10. Contact Information
            </h2>
            <p>
              For any questions or concerns regarding these Terms & Conditions,
              please contact us:
            </p>
            <ul className="list-disc ml-6 space-y-1">
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


          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermConditions;
