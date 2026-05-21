import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVideos, deleteVideo } from "../features/Video/videoSlice";
import UploadVideo from "../components/UploadVideo";
import { Plus, Trash2, Video as VideoIcon, X } from "lucide-react";
import Swal from "sweetalert2";

const VideoPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const dispatch = useDispatch();
  const { videos, loading } = useSelector((state) => state.video);

  useEffect(() => {
    dispatch(getVideos());
  }, [dispatch]);

  const categories = ["All", ...new Set(videos.map((v) => v.category))];

  const filteredVideos =
    selectedCategory === "All"
      ? videos
      : videos.filter((v) => v.category === selectedCategory);

  const handleDelete = (video) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This video will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteVideo(video._id))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Video has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "Failed to delete video.",
              icon: "error",
            });
          });
      }
    });
  };

  return (
    <div className="space-y-6 rounded-xl bg-white p-4 shadow sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and upload categorized video content for the website.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus size={18} />
          Upload Video
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <label className="text-sm font-medium text-gray-700 shrink-0">
          Filter by category:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 sm:w-48"
        >
          {categories.map((cat, index) => (
            <option key={index}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="text-sm font-medium text-gray-500">Loading videos...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <VideoIcon className="h-10 w-10 text-gray-300" />
          <p className="text-base font-semibold text-gray-700">No videos found</p>
          <p className="text-sm text-gray-500">
            {selectedCategory !== "All"
              ? `No videos in the "${selectedCategory}" category.`
              : "Upload your first video to get started."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.map((video) => (
            <div
              key={video._id}
              className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <video
                src={`https://backend.cinesquare.in/uploads/${video.video}`}
                controls
                className="w-full h-48 object-cover bg-gray-100"
              />

              <div className="flex items-center justify-between p-3">
                <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {video.category}
                </span>
                <button
                  onClick={() => handleDelete(video)}
                  className="inline-flex items-center justify-center rounded-full bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                  title="Delete video"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">Upload Video</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <UploadVideo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPage;
