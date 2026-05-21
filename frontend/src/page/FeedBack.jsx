import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { sendEnquiry } from "../features/Contact/contactSlice";
import { toast } from "react-toastify";

const FeedBack = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    city: "",
    message: "",
    category: "Feedback",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = "Name is required.";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.firstName.trim())) {
      errs.firstName = "Name must only contain letters (2–50 characters).";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address.";
    }
    if (formData.phone) {
      if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
        errs.phone = "Phone must be exactly 10 digits.";
      }
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

    // Block non-alpha for name
    if (name === "firstName" && value && !/^[a-zA-Z\s]*$/.test(value)) return;

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
      // Split single "Name" field to satisfy backend's required lastName
      const nameParts = formData.firstName.trim().split(" ");
      const fName = nameParts[0];
      const lName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "."; 

      const payload = {
        ...formData,
        firstName: fName,
        lastName: lName,
      };

      await dispatch(sendEnquiry(payload)).unwrap();
      toast.success("Feedback submitted successfully!");
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        city: "",
        message: "",
        category: "Feedback",
      });
      setErrors({});
    } catch (err) {
      toast.error(err || "Failed to submit feedback.");
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
      errors[field]
        ? "ring-2 ring-red-500 focus:ring-red-500 bg-red-500/10"
        : "focus:ring-yellow-400 hover:bg-white/15"
    }`;

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <div className="max-w-4xl mx-auto py-32 px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-textColor mb-4 text-center">
          We Value Your Feedback
        </h2>
        <p className="text-gray-400 text-center mb-10 text-sm sm:text-base">
          Help us improve your cinema experience
        </p>

        <p className="text-white mb-10 text-start text-base sm:text-lg leading-relaxed bg-white/5 p-6 rounded-xl border border-white/10">
          At CineSquare Cinema, we are committed to providing the ultimate movie
          experience. Your feedback helps us understand what we are doing right
          and where we can improve. Whether it's about the comfort of our seats,
          the quality of our screens and sound, or the friendliness of our
          staff, every comment matters.
        </p>

        <form
          className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-lg space-y-6 border border-white/10"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textColor mb-2">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your name"
                maxLength={50}
                className={inputClass("firstName")}
              />
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  ⚠ {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-textColor mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className={inputClass("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  ⚠ {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-textColor mb-2">
                Phone Number
                <span className="text-gray-500 text-xs ml-1">(10 digits only)</span>
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
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  ⚠ {errors.phone}
                </p>
              )}
              {!errors.phone && formData.phone && (
                <p className="text-gray-500 text-xs mt-1">
                  {formData.phone.length}/10 digits entered
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-textColor mb-2">
                Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className={inputClass("city")}
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-textColor mb-2">
              Leave Your Message
            </label>
            <textarea
              rows="4"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message... (min. 10 characters)"
              className={`${inputClass("message")} resize-none`}
            />
            {errors.message && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                ⚠ {errors.message}
              </p>
            )}
          </div>

          {/* Button */}
          <div className="w-full flex justify-center pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-textColor text-primary font-semibold px-10 py-3 rounded-lg hover:bg-textColor/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedBack;
