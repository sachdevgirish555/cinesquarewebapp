import React from "react";
import FooterBackground from "../assets/footer-bg-BZU_8E62.png";
import { Twitter, Youtube, Instagram, Facebook } from "lucide-react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      className="relative text-textColor py-10 bg-primary bg-cover bg-center"
      style={{ backgroundImage: `url(${FooterBackground})` }}
    >
      <div className="absolute inset-0"></div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Top Section */}
        <div className="text-start my-15">
          <h6 className="text-2xl font-semibold mb-3">
            LET’S HAVE A TALK ABOUT YOUR PROJECT.
          </h6>
          <NavLink
            to="/contact"
            className="inline-block border-b text-textColor px-6 py-2 transition"
          >
            Get in touch
          </NavLink>
        </div>

        {/* Links Section */}
        <div className="grid uppercase grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm my-20">
          {/* Column 1 */}
          <ul className="space-y-2">
            <li>
              <NavLink to="/about" className="hover:text-red-500">
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/movie" className="hover:text-red-500 uppercase">
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink to="/cinema" className="hover:text-red-500">
                Cinema
              </NavLink>
            </li>
            <li>
              <NavLink to="/apply-for-franchise" className="hover:text-red-500">
                Franchise
              </NavLink>
            </li>
            <li>
              <NavLink to="/faq" className="hover:text-red-500">
                FAQ
              </NavLink>
            </li>
          </ul>

          {/* Column 2 */}
          <ul className="space-y-2">
            <li>
              <NavLink to="/our-team" className="hover:text-red-500">
                Our Team
              </NavLink>
            </li>
            <li>
              <NavLink to="/gallery" className="hover:text-red-500">
                Gallery
              </NavLink>
            </li>
            <li>
              <NavLink to="/career" className="hover:text-red-500">
                Career
              </NavLink>
            </li>
            <li>
              <NavLink to="/blog" className="hover:text-red-500">
                News & Blogs
              </NavLink>
            </li>
            <li>
              <NavLink to="/investors" className="hover:text-red-500">
                Investors Section
              </NavLink>
            </li>
          </ul>

          {/* Column 3 */}
          <ul className="space-y-2">
            <li>
              <NavLink to="/contact" className="hover:text-red-500">
                CONTACT US
              </NavLink>
            </li>
            <li>
              <NavLink to="/advertise" className="hover:text-red-500">
                ADVERTISE WITH US
              </NavLink>
            </li>
            <li>
              <NavLink to="/privacy-policy" className="hover:text-red-500">
                PRIVACY POLICY
              </NavLink>
            </li>
            <li>
              <NavLink to="/term-conditions" className="hover:text-red-500">
                TERMS & CONDITIONS
              </NavLink>
            </li>
            <li>
              <NavLink to="/feedback" className="hover:text-red-500 uppercase">
                Feedback
              </NavLink>
            </li>
          </ul>

          {/* Column 4: Social Media (Now NavLinks) */}
          <div>
            <p className="text-lg font-semibold mb-3">Follow Us</p>
            <div className="flex space-x-4 mb-4 text-white">
              <NavLink
                to="https://x.com/CINESQUARE"
                className="hover:text-yellow-400/30 text-textColor transition-colors duration-300"
              >
                <Twitter size={24} />
              </NavLink>
              <NavLink
                to="https://www.youtube.com/@cinesquare"
                className="hover:text-yellow-400/30 text-textColor transition-colors duration-300"
              >
                <Youtube size={24} />
              </NavLink>
              <NavLink
                to="https://www.instagram.com/cinesquarecinemas_official/"
                className="hover:text-yellow-400/30 text-textColor transition-colors duration-300"
              >
                <Instagram size={24} />
              </NavLink>
              <NavLink
                to="https://www.facebook.com/cinesquarecinemas"
                className="hover:text-yellow-400/30 text-textColor transition-colors duration-300"
              >
                <Facebook size={24} />
              </NavLink>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-start text-xs text-textColor">
  COPYRIGHT © {new Date().getFullYear()} Cine Square Entertainment Private Limited | All
  Rights Reserved
</div>
      </div>
    </footer>
  );
};

export default Footer;
