import React, { useState } from "react";
import { motion } from "framer-motion";
import { Home, Mail, Phone } from "lucide-react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { sendEnquiry } from "../features/Contact/contactSlice";
import { toast } from "react-toastify";

const Contact = () => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    category: "General Inquiry",
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
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      errs.phone = "Phone must be exactly 10 digits.";
    }
    if (formData.message && formData.message.trim().length < 10) {
      errs.message = "Message must be at least 10 characters.";
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
      toast.success("Message sent successfully!");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", category: "General Inquiry" });
      setErrors({});
    } catch (err) {
      toast.error(err || "Failed to send message.");
    }
  };

  return (
    <div className="bg-primary">
      <Navbar />
      {/* Company Intro Section */}
      <div className="bg-primary text-white pb-20 pt-40 px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center">
        <div className="max-w-4xl text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-textColor">
            MOVIES MAGIC & ENTERTAINMENT !!!
          </h1>
          <p className="text-lg sm:text-xl text-gray-300">
            India's Fastest Growing Cinema Chain
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 mb-16">
          <div className="bg-yellow-400/10 border border-yellow-400/30 backdrop-blur-md px-10 py-8 rounded-2xl text-center shadow-md hover:scale-105 transition-transform duration-300">
            <h1 className="text-5xl sm:text-6xl font-bold text-yellow-400 mb-2">
              20
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Years of Experience in Industry
            </p>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 backdrop-blur-md px-10 py-8 rounded-2xl text-center shadow-md hover:scale-105 transition-transform duration-300">
            <h1 className="text-5xl sm:text-6xl font-bold text-yellow-400 mb-2">
              18+
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Cinema Screens Operational / Under Process
            </p>
          </div>
        </div>

        <div className="max-w-5xl text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-textColor">
            Why Cine Square?
          </h1>
          <p className="text-gray-300 leading-relaxed text-justify text-base sm:text-lg">
            At{" "}
            <span className="text-yellow-400 font-semibold">Cine Square</span>,
            we believe cinema is more than just watching a movie — it’s an
            experience of emotion, comfort, and innovation. From luxurious
            seating and immersive sound to curated dining and community
            engagement, we redefine the way India experiences film. Our vision
            blends cultural elegance with global standards to bring magic to
            every frame.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-primary text-white py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Google Map */}
          <div className="rounded-xl overflow-hidden shadow-lg h-[450px] lg:h-auto">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3680.949434228016!2d75.85772631543653!3d22.71312578511773!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd4b8b43c5cb%3A0x5cbfbf6d8cfe8cf!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1697032812342!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>

          {/* Contact Form */}
          <div className="bg-primary backdrop-blur-md p-8 rounded-xl shadow-md flex flex-col justify-between h-auto lg:h-auto">
            <form
              className="space-y-5 h-full flex flex-col justify-between"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-textColor font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.firstName ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-textColor"}`}
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm text-textColor font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.lastName ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-textColor"}`}
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm text-textColor font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.email ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-textColor"}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm text-textColor font-medium mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your 10-digit phone number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.phone ? "ring-2 ring-red-500 focus:ring-red-500" : "focus:ring-textColor"}`}
                />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm text-textColor font-medium mb-2">
                  Message
                </label>
                <textarea
                  rows="3"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message..."
                  className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-textColor resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-textColor hover:bg-textColor/80 text-primary font-semibold py-3 rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-primary text-white py-16 px-6 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-textColor">
            Contact Information
          </h2>
          <p className="text-gray-300 mt-2">
            Get in touch with us for franchise, support, or inquiries
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Address */}
          <div className="flex flex-col items-center text-center bg-white/5 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-textColor p-4 rounded-full mb-4 flex items-center justify-center">
              <Home className="text-primary w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-textColor mb-2">
              Head Office
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              CINE SQUARE ENTERTAINMENT PVT. LTD. <br />
              First Floor | Plot no 87, Scheme no 103 <br />
              Near Kesar Bagh Bridge, Indore (MP) - 452001, INDIA
            </p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center text-center bg-white/5 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-textColor p-4 rounded-full mb-4 flex items-center justify-center">
              <Phone className="text-primary w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-textColor mb-2">
              Call Us
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              Phone: 0731-4224800 <br />
              Mobile: +91-98264 88991
            </p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center bg-white/5 p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-textColor p-4 rounded-full mb-4 flex items-center justify-center">
              <Mail className="text-primary w-7 h-7" />
            </div>
            <h3 className="text-lg font-semibold text-textColor mb-2">
              Email Us
            </h3>
            <p className="text-sm text-gray-200 leading-relaxed">
              info@cinesquare.in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
