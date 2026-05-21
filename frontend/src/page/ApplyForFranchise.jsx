import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Video from "../assets/new/video 1.mp4";
import { useDispatch, useSelector } from "react-redux";
import { sendEnquiry } from "../features/Contact/contactSlice";
import { toast } from "react-toastify";

const ApplyForFranchise = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    message: "",
    category: "Apply For Franchise",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = "First name is required.";
    if (!formData.lastName.trim()) errs.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      errs.phone = "Phone must be a 10-digit number.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Block non-numeric input for phone field
    if (name === "phone" && value && !/^[0-9]*$/.test(value)) return;
    // Block non-alpha for name fields
    if ((name === "firstName" || name === "lastName") && value && !/^[a-zA-Z\s]*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    try {
      await dispatch(sendEnquiry(formData)).unwrap();
      toast.success("Franchise application sent successfully!");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", city: "", state: "", message: "", category: "Apply For Franchise" });
      setErrors({});
    } catch (err) {
      toast.error(err || "Failed to send application.");
    }
  };


  return (
    <div className="bg-primary">
      <Header
        heading={"Apply For Franchise"}
        BgVideo={Video}
        para={
          "Experience cinema like never before. Immersive visuals, premium sound, and unforgettable moments."
        }
      />

      {/* INFO SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-10 pt-10 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-Primary backdrop-blur-md rounded-2xl shadow-lg p-5 sm:p-8 md:p-12"
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
            className="space-y-6 text-gray-200 leading-relaxed text-justify"
          >
            <p>
              Movies, Entertainment & Fun! With increasing content supply,
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
              interested parties for a franchising discussion over a Call or a
              Meeting…
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

      <div className="flex items-center justify-center py-4 px-4">
        <div className="w-full max-w-6xl rounded-2xl p-4 sm:p-8">
          {/* Heading */}
          <h2 className="text-3xl font-bold text-center text-textColor mb-8">
            Apply For <span className="text-white">Franchise</span>
          </h2>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {/* First Name */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={`border rounded-lg px-4 py-2 text-white focus:outline-none ${errors.firstName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-textColor"}`}
              />
              {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={`border rounded-lg px-4 py-2 text-white focus:outline-none ${errors.lastName ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-textColor"}`}
              />
              {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`border rounded-lg px-4 py-2 text-white focus:outline-none ${errors.email ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-textColor"}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className={`border rounded-lg px-4 py-2 text-white focus:outline-none ${errors.phone ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-textColor"}`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="border border-gray-300 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-textColor"
              />
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="text-textColor font-medium mb-2">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className="border border-gray-300 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-textColor"
              />
            </div>



            {/* Message (Full width) */}
            <div className="flex flex-col col-span-1 sm:col-span-2">
              <label className="text-textColor font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                className="border border-gray-300 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-textColor"
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="flex w-full justify-center col-span-1 sm:col-span-2 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-textColor text-primary font-semibold px-8 py-3 rounded-lg hover:bg-textColor/50 transition-all disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyForFranchise;
