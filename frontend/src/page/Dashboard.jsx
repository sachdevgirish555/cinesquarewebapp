import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Film, Image as ImageIcon, Loader2, Mail, Users } from "lucide-react";
import API from "../services/api";

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    enquiries: 0,
    activeMovies: 0,
    galleryImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get("/api/dashboard/stats");
        if (response.data.success) {
          setStatsData(response.data.data);
        }
      } catch {
        setStatsData({
          totalUsers: 0,
          enquiries: 0,
          activeMovies: 0,
          galleryImages: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const stats = [
    { title: "Total Users", value: statsData.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Enquiries", value: statsData.enquiries, icon: Mail, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "Active Movies", value: statsData.activeMovies, icon: Film, color: "text-red-600", bg: "bg-red-100" },
    { title: "Gallery Images", value: statsData.galleryImages, icon: ImageIcon, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-2 sm:p-4"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Dashboard Overview</h1>
        <p className="mt-1 text-gray-500">Welcome back to Cine Square Admin Panel</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`flex h-14 w-14 items-center justify-center rounded-full ${stat.bg}`}>
              <stat.icon className={`h-7 w-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {loading ? (
                  <Loader2 className="mt-1 h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  stat.value
                )}
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white shadow-lg sm:p-8">
        <div className="relative z-10">
          <h2 className="mb-2 text-2xl font-bold">Ready to Manage?</h2>
          <p className="max-w-xl leading-relaxed text-gray-300">
            Use the sidebar to navigate through your enquiries, user management, movies, and gallery settings. Keep your application content fresh and engaging.
          </p>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-64 opacity-10">
          <Film className="-mr-10 -mt-10 h-64 w-64 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
