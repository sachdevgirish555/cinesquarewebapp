import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "../assets/new/logo.png";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Cinemas", link: "/cinema" },
    { name: "Franchise", link: "/apply-for-franchise" },
    { name: "Movies", link: "/movie" },
    { name: "Contact Us", link: "/contact" },
  ];

  const menuVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "tween", duration: 0.6, ease: "easeInOut" },
    },
    exit: {
      x: "100%",
      transition: { type: "tween", duration: 0.6, ease: "easeInOut" },
    },
  };

  return (
    <nav className="fixed top-0 left-0 w-full   z-50 bg-black/70 backdrop-blur-sm border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6 relative">
        <NavLink
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity duration-300"
        >
          <img
            src={Logo}
            alt="Logo"
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain"
          />
        </NavLink>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.link}
              className="relative text-textColor font-medium transition-colors duration-300 hover:text-yellow-400/50
               after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5
               after:bg-yellow-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden relative z-50 p-2 rounded-full bg-yellow-400/20 hover:bg-yellow-400/40 transition-all duration-300"
        >
          {menuOpen ? (
            <X className="text-white w-6 h-6" />
          ) : (
            <Menu className="text-white w-6 h-6" />
          )}
        </button>
      </div>

      {/* Fullscreen Slide-in Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide Menu */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 w-full sm:w-1/2 h-screen z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center space-y-10 text-center shadow-2xl"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <NavLink
                    to={item.link}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-2xl sm:text-3xl font-semibold transition-colors duration-300 ${
                        isActive
                          ? "text-white border-b-2 border-yellow-400 pb-1"
                          : "text-yellow-400 hover:text-white"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
