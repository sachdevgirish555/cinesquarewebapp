import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addVideo } from "../features/Video/videoSlice";

const UploadVideo = () => {
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [error, setError] = useState("");

  const categories = ["Home", "About", "Contact", "Cinemas", "Franchises"];

  // Handle Video Select
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    // validate video
    if (!selected.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // max 50MB
    // if (selected.size > 50 * 1024 * 1024) {
    //   setError("Video must be under 50MB");
    //   return;
    // }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // remove video
  const removeVideo = () => {
    setFile(null);
    setPreview(null);
  };

  // memory cleanup
  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("video", file);
    formData.append("category", category);

    dispatch(addVideo(formData));

    // reset
    removeVideo();
    setCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 max-w-md mx-auto space-y-5"
    >
      <h2 className="text-xl font-bold text-center text-gray-700">
        Upload Video
      </h2>

      {/* Upload Box */}
      <label className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition">
        {!preview ? (
          <div className="space-y-2">
            <p className="font-medium text-gray-600">
              Click or Drag Video Here
            </p>
            <p className="text-sm text-gray-400">MP4, MOV, AVI (Max 50MB)</p>
          </div>
        ) : (
          <div className="relative">
            <video
              src={preview}
              controls
              className="w-full h-48 object-cover rounded-lg"
            />

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                removeVideo();
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded"
            >
              Remove
            </button>
          </div>
        )}

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Category */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select Category</option>
        {categories.map((cat, i) => (
          <option key={i}>{cat}</option>
        ))}
      </select>

      {/* Error */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      {/* Submit */}
      <button
        disabled={!file || !category}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium disabled:bg-gray-400 transition"
      >
        Upload Video
      </button>
    </form>
  );
};

export default UploadVideo;
