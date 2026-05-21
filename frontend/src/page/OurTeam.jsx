import React from "react";
import first from "../assets/first.jpg";
import second from "../assets/second.jpg";
import third from "../assets/third.jpg";
import { div } from "framer-motion/client";
import Navbar from "../components/Navbar";

const teamMembers = [
  {
    name: "GIRISH SACHDEV",
    role: "Founder & Director",
    img: first,
  },
  {
    name: "SACHIN SACHDEV",
    role: "VP – Programming & Distribution",
    img: second,
  },
  {
    name: "RAJNISH MEHTA",
    role: "VP – MARKETING",
    img: third,
  },
];

const OurTeam = () => {
  return (
    <div>
      <Navbar />
      <section className="py-32 bg-black">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-yellow-400">Our Team</h1>
          <p className="text-yellow-400 mt-3">
            Meet the people behind our success
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-yellow-400 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition duration-300"
            >
              {/* Image */}
              <div className="overflow-hidden">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-6 text-center ">
                <h3 className="text-xl font-bold text-gray-800">
                  {member.name}
                </h3>

                <p className="text-black font-medium mt-2">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OurTeam;
