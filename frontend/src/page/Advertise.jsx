import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { sendEnquiry } from "../features/Contact/contactSlice";
import { toast } from "react-toastify";

const Advertise = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const dispatch = useDispatch();
  const { loading, success, error } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    category: "Advertising Inquiry",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) {
      errs.firstName = "First name is required.";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.firstName.trim())) {
      errs.firstName = "First name must only contain letters.";
    }
    if (!formData.lastName.trim()) {
      errs.lastName = "Last name is required.";
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.lastName.trim())) {
      errs.lastName = "Last name must only contain letters.";
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
      toast.success("Advertising inquiry sent successfully!");
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "", category: "Advertising Inquiry" });
      setErrors({});
    } catch (err) {
      toast.error(err || "Failed to send inquiry.");
    }
  };

  return (
    <div className="bg-primary min-h-screen text-white">
      <Navbar />

      {/* 🌟 Hero / Info Section */}
      <section className="px-6 md:px-20 pt-40 pb-10 text-center bg-primary">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-textColor"
        >
          Cine Square Cinemas is the Answer!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-4xl mx-auto text-gray-300 text-lg leading-relaxed mb-8"
        >
          India’s media and entertainment industry is thriving — and cinema
          advertising is leading the way. Our three cinema formats —{" "}
          <span className="text-textColor font-semibold">
            Express, Signature, and Luxuriance
          </span>{" "}
          — offer unmatched reach, flexibility, and audience engagement.
          <br />
          <br />
          What truly sets us apart is our exclusive community of over{" "}
          <span className="text-textColor font-semibold">20 million</span>{" "}
          premium cinemagoers, giving your brand access to a highly targeted and
          influential audience. Whether you’re an emerging business or an
          established premium brand, Cine Square Cinemas helps you achieve your
          marketing goals with maximum impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="max-w-2xl mx-auto text-left bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10"
        >
          <h2 className="text-2xl font-semibold text-textColor mb-4">
            Partner with India’s Most Loved Cinema Brand and Benefit From:
          </h2>
          <ul className="space-y-3 text-gray-300 list-disc list-inside">
            <li>🎬 High-impact advertising opportunities</li>
            <li>🔄 Flexible and customized solutions</li>
            <li>🌟 A premium, engaged audience</li>
          </ul>

          <p className="mt-6 text-gray-300 leading-relaxed">
            As India’s fastest-growing cinema chain, we’ve delivered outstanding
            results for leading brands across industries. <br />
            Join us today and experience the power of cinema advertising with{" "}
            <span className="text-textColor font-semibold">
              Cine Square Cinemas
            </span>{" "}
            — Be seen, be heard, and grow with Cine Square!
          </p>
        </motion.div>
      </section>

      {/* 🧾 Contact Form */}
      <section className="px-6 md:px-20 pb-20">
        <div className="bg-black/40 border border-white/10 rounded-2xl shadow-md p-8 md:p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-textColor mb-8 text-center">
            Get in Touch with Us
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-textColor font-medium mb-2">First Name</label>
                <input
                  type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                  placeholder="Enter your first name"
                  className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.firstName ? "ring-2 ring-red-500" : "focus:ring-textColor"}`}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm text-textColor font-medium mb-2">Last Name</label>
                <input
                  type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                  placeholder="Enter your last name"
                  className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.lastName ? "ring-2 ring-red-500" : "focus:ring-textColor"}`}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-textColor font-medium mb-2">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.email ? "ring-2 ring-red-500" : "focus:ring-textColor"}`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-textColor font-medium mb-2">Phone</label>
              <input
                type="tel" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Enter your 10-digit phone number"
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 ${errors.phone ? "ring-2 ring-red-500" : "focus:ring-textColor"}`}
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm text-textColor font-medium mb-2">Message</label>
              <textarea
                name="message" value={formData.message} onChange={handleChange}
                rows="4" placeholder="Type your message..."
                className={`w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 resize-none ${errors.message ? "ring-2 ring-red-500" : "focus:ring-textColor"}`}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-textColor hover:bg-textColor/80 text-primary font-semibold py-3 rounded-lg transition-all duration-300"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Advertise;
