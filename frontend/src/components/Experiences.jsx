import React from "react";
import { Crown, Sparkles, Star } from "lucide-react";
import premiumImage from "../assets/premium-lounge.jpg";
import concessionsImage from "../assets/concessions.jpg";
import technologyImage from "../assets/technology.jpg";
import { motion } from "framer-motion";

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='256' viewBox='0 0 400 256'%3E%3Crect width='400' height='256' fill='%231a1a1a'/%3E%3Ctext x='200' y='135' text-anchor='middle' fill='%23333' font-size='16' font-family='sans-serif'%3ENo Image%3C/text%3E%3C/svg%3E";

const experiences = [
  {
    icon: Crown,
    title: "Luxuriance",
    tagline: "The Ultimate Experience",
    description:
      "Our gold tier is your ultimate sanctuary for a movie experience that feels like a red-carpet event. Sink into plush, reclining seats and enjoy gourmet snacks delivered to your seat.",
    features: [
      "Luxury Recliner Seats",
      "Gourmet F&B Service",
      "Premium Sound System",
      "VIP Lounge Access",
    ],
    image: premiumImage,
    gradient: "from-yellow-500/30 to-yellow-500/5",
  },
  {
    icon: Sparkles,
    title: "Elegance",
    tagline: "Refined Cinema",
    description:
      "Designed for those who appreciate the finer things in life, our silver tier delivers an elevated cinematic experience with exceptional comfort and premium amenities.",
    features: [
      "Comfort Plus Seating",
      "Premium Concessions",
      "Dolby Atmos Sound",
      "Reserved Seating",
    ],
    image: concessionsImage,
    gradient: "from-pink-500/30 to-pink-500/5",
  },
  {
    icon: Star,
    title: "Premium",
    tagline: "Classic Excellence",
    description:
      "Our bronze tier offers a delightful blend of comfort and quality, ensuring every visit is memorable with state-of-the-art technology and excellent service.",
    features: [
      "Comfortable Seating",
      "Quality Sound",
      "Fresh Concessions",
      "Great Value",
    ],
    image: technologyImage,
    gradient: "from-blue-500/30 to-blue-500/5",
  },
];

const Experiences = () => {
  return (
    <section className="py-15 relative ">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-semibold text-textColor">
              Our Experiences
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Perfect Experience
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From premium comfort to luxury indulgence, we have the perfect
            experience for every movie lover.
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => {
            const Icon = exp.icon;
            return (
              <motion.div
                key={index}
                className="group overflow-hidden border border-textColor bg-[#111]/50 backdrop-blur-sm hover:border-textColor/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 rounded-xl"
                style={{ animationDelay: `${index * 0.1}s` }}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG; }}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${exp.gradient} to-transparent`}
                  ></div>

                  {/* Icon Badge */}
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-gray-600">
                    <Icon className="w-6 h-6 text-textColor" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-textColor font-semibold">
                      {exp.tagline}
                    </p>
                  </div>

                  <p className="text-gray-400 mb-2 leading-relaxed">
                    {exp.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {exp.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mr-2"></div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experiences;
