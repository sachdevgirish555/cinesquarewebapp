import React, { useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { sendEnquiry } from "../features/Contact/contactSlice";
import { toast } from "react-toastify";

const MinutesFranchies = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    jobTitle: "",
    company: "",
    category: "20 Minutes Franchise",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = "First name is required.";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.firstName.trim())) {
      errs.firstName = "First name must only contain letters (2–50 chars).";
    }
    if (!formData.lastName.trim()) {
      errs.lastName = "Last name is required.";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.lastName.trim())) {
      errs.lastName = "Last name must only contain letters (2–50 chars).";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      errs.phone = "Phone must be exactly 10 digits.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Block non-numeric for phone
    if (name === "phone" && value && !/^[0-9]*$/.test(value)) return;

    // Block non-alpha for name fields
    if (
      (name === "firstName" || name === "lastName") &&
      value &&
      !/^[a-zA-Z\s]*$/.test(value)
    )
      return;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error("Please fix the errors before submitting.");
      return;
    }
    try {
      await dispatch(sendEnquiry(formData)).unwrap();
      toast.success("Franchise application sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "",
        state: "",
        jobTitle: "",
        company: "",
        category: "20 Minutes Franchise",
      });
      setErrors({});
    } catch (err) {
      toast.error(err || "Failed to send application.");
    }
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-200 ${
      errors[field]
        ? "border-red-500 bg-red-500/10 focus:border-red-500"
        : "border-gray-600 bg-white/5 focus:border-textColor hover:border-gray-400"
    }`;

  return (
    <div className="bg-secondPrimary">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-secondPrimary backdrop-blur-md rounded-2xl shadow-lg p-8 sm:p-12 border border-white/10"
        >
          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center text-yellow-400 mb-8 tracking-wide uppercase"
          >
            APPLY FOR FRANCHISE
          </motion.h2>

          {/* Paragraphs */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6 text-gray-200 leading-relaxed"
          >
            <p>
              Movies, Entertainment &amp; Fun! With increasing content supply,
              changing consumption patterns and evolving content formats, now,
              new movies are released almost every week. And Huge Capacity
              multiplexes may not be a viable and cost-effective option to meet
              consumer demands in every locality. Hence, Theatres are emerging,
              each with a seating capacity of 150-250 seats per auditorium with
              a total of 2-3-4 auditoriums.
            </p>

            <p>
              A Cinema is a state-of-the-art facility featuring high-class
              push-back seating with extra leg room, contemporary interiors,
              stadium-style seating, air conditioning, modern acoustics, the
              latest projection system, modern digital sound, and computerised
              ticketing. These cinemas offer the best possible movie viewing
              experience in a cozy theatre setting, equipped with
              technologically advanced systems, superior ambience, and high
              service standards to ensure customer delight.
            </p>

            <p>
              CINE SQUARE has taken a proactive initiative to enhance the
              movie-watching experience for people across India by partnering
              with local stakeholders. CINE SQUARE is actively inviting
              interested parties for a franchising discussion over a cup of
              tea/coffee ☕!
            </p>
          </motion.div>

          {/* Franchise Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <h3 className="text-xl font-semibold text-yellow-400 mb-4">
              To Be Our Franchisee Partner, You Need:
            </h3>
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Carpet area: 6000 - 15000 sq. ft.</li>
              <li>Ceiling height: Minimum 14 ft (28 ft for larger screens)</li>
              <li>Investment varies based on location and seat capacity</li>
            </ul>
          </motion.div>

          {/* Call to Action */}
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg sm:text-xl text-textColor leading-relaxed mt-8 mb-6"
          >
            Fill the form below and connect with us for a Franchise Proposal —
            or call us directly!
          </motion.h3>

          {/* Cine Square Offers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-yellow-400 font-semibold mb-4">
              What CINE SQUARE Offers:
            </p>
            <ul className="list-disc ml-6 text-gray-300 space-y-2">
              <li>Complete technology solutions (projectors, servers)</li>
              <li>End-to-end management and operations</li>
              <li>Efficient programming and maintenance</li>
              <li>Content acquisition from producers/distributors</li>
              <li>Marketing, liaison, and advertising support</li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-10 text-center text-gray-300 text-lg"
          >
            To become our franchise partner, contact us at{" "}
            <span className="text-yellow-400 font-semibold">
              info@cinesquare.in
            </span>{" "}
            or call{" "}
            <span className="text-yellow-400 font-semibold">09826488991</span>.
          </motion.p>
        </motion.div>
      </div>

      {/* FORM SECTION */}
      <div className="flex items-center justify-center py-10 px-4 pb-20">
        <div className="w-full max-w-4xl bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-textColor mb-2">
            Apply For <span className="text-white">Franchise</span>
          </h2>
          <p className="text-center text-gray-500 text-sm mb-8">
            Fields marked <span className="text-red-400">*</span> are required
          </p>

          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">
                First Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                maxLength={50}
                className={inputClass("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">⚠ {errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">
                Last Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                maxLength={50}
                className={inputClass("lastName")}
              />
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">⚠ {errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">⚠ {errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">
                Phone Number <span className="text-red-400">*</span>
                <span className="text-gray-500 font-normal ml-1">(10 digits)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className={inputClass("phone")}
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">⚠ {errors.phone}</p>
              )}
              {!errors.phone && formData.phone && (
                <p className="text-gray-500 text-xs mt-1">
                  {formData.phone.length}/10 digits
                </p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className={inputClass("city")}
              />
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter your state"
                className={inputClass("state")}
              />
            </div>

            {/* Job Title */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter your job title"
                className={inputClass("jobTitle")}
              />
            </div>

            {/* Company */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2 text-sm">Company</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Enter your company name"
                className={inputClass("company")}
              />
            </div>

            {/* Submit Button */}
            <div className="flex w-full justify-center col-span-1 sm:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-textColor text-primary font-semibold px-10 py-3 rounded-lg hover:bg-textColor/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-secondPrimary backdrop-blur-md rounded-2xl shadow-lg p-8 sm:p-12 border border-white/10"
        >
          {/* Cine Square Offers */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="text-xl text-yellow-400 font-semibold mb-4">
              Mission
            </p>
            <p className="list-disc ml-6 text-gray-300 space-y-2">
              Our company's mission is to exceed our movie-goers' expectations
              through a quality cinema viewing experience. Our commitment to our
              customers enables us to build a cozy family entertainment space
              that delights them to keep coming back again for more. Operational
              excellence and superior service delivery are key components of our
              mission statement.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <p className="text-xl text-yellow-400 font-semibold mb-4">Vision</p>
            <p className="list-disc ml-6 text-gray-300 space-y-2">
              CINE SQUARE aims to continually redefine the cinema viewing
              experience for movie enthusiasts, providing world-class and
              fascinating viewing. And become world's most preferred cinema
              partner for viewers, partners and movie distributors.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default MinutesFranchies;
