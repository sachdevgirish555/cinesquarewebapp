import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addGallery } from "../features/CinemaGallery/gallerySlice";
import { getCinemas } from "../features/Cinema/cinemaSlice";

const MAX_FILES = 12;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const AddCinemaGallery = ({ selectedCinema = "", closeModal }) => {
  const dispatch = useDispatch();
  const { cinemas } = useSelector((state) => state.cinema);
  const { loading, error } = useSelector((state) => state.gallery);

  const [cinemaId, setCinemaId] = useState(selectedCinema);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(getCinemas());
  }, [dispatch]);

  useEffect(() => {
    setCinemaId(selectedCinema || "");
  }, [selectedCinema]);

  useEffect(() => () => {
    preview.forEach((item) => {
      if (item.url?.startsWith("blob:")) {
        URL.revokeObjectURL(item.url);
      }
    });
  }, [preview]);

  const selectedCinemaLabel = useMemo(() => {
    const cinema = Array.isArray(cinemas)
      ? cinemas.find((item) => item._id === cinemaId)
      : null;

    return cinema ? `${cinema.name} , ${cinema.city}` : "No cinema selected";
  }, [cinemaId, cinemas]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) {
      return;
    }

    const existingNames = new Set(
      files.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
    );

    const acceptedFiles = [];
    const acceptedPreview = [];
    let nextError = "";

    selectedFiles.forEach((file) => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;

      if (existingNames.has(fileKey)) {
        nextError = "Duplicate images were skipped.";
        return;
      }

      if (!file.type.startsWith("image/")) {
        nextError = "Only image files are allowed.";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        nextError = "Each image must be 5MB or less.";
        return;
      }

      if (files.length + acceptedFiles.length >= MAX_FILES) {
        nextError = `You can upload up to ${MAX_FILES} images at a time.`;
        return;
      }

      acceptedFiles.push(file);
      acceptedPreview.push({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file),
      });
      existingNames.add(fileKey);
    });

    setFiles((prev) => [...prev, ...acceptedFiles]);
    setPreview((prev) => [...prev, ...acceptedPreview]);
    setFormError(nextError);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
    setPreview((prev) => {
      const removed = prev[index];
      if (removed?.url?.startsWith("blob:")) {
        URL.revokeObjectURL(removed.url);
      }

      return prev.filter((_, previewIndex) => previewIndex !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cinemaId) {
      setFormError("Please select a cinema before uploading images.");
      return;
    }

    if (files.length === 0) {
      setFormError("Please add at least one image.");
      return;
    }

    const formData = new FormData();
    formData.append("cinemaId", cinemaId);

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await dispatch(addGallery(formData)).unwrap();
      setFormError("");
      setFiles([]);
      preview.forEach((item) => {
        if (item.url?.startsWith("blob:")) {
          URL.revokeObjectURL(item.url);
        }
      });
      setPreview([]);
      closeModal?.();
    } catch {
      // Redux exposes API error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Upload Gallery Images</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add clean, high-quality images for the selected cinema gallery.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cinema</label>
          <select
            value={cinemaId}
            onChange={(e) => {
              setCinemaId(e.target.value);
              setFormError("");
            }}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
            required
          >
            <option value="">Select Cinema</option>
            {Array.isArray(cinemas) &&
              cinemas.map((cinema) => (
                <option key={cinema._id} value={cinema._id}>
                  {cinema.name} , {cinema.city}
                </option>
              ))}
          </select>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Current Selection
          </p>
          <p className="mt-2 text-sm font-medium text-gray-900">{selectedCinemaLabel}</p>
          <p className="mt-2 text-xs text-gray-500">
            Upload up to {MAX_FILES} images. Recommended size: under 5MB each.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Gallery Images</p>
            <p className="mt-1 text-sm text-gray-500">
              JPG, PNG and WEBP are supported. Duplicate files are ignored.
            </p>
          </div>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
            Add Images
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-sm text-gray-600">
          <span>{files.length} image{files.length === 1 ? "" : "s"} selected</span>
          <span>{Math.max(MAX_FILES - files.length, 0)} slots left</span>
        </div>
      </div>

      {preview.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {preview.map((item, index) => (
            <div key={`${item.name}-${index}`} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative">
                <img
                  src={item.url}
                  alt={item.name}
                  className="h-40 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-medium text-white"
                >
                  Remove
                </button>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-gray-900">{item.name}</p>
                <p className="mt-1 text-xs text-gray-500">
                  {(item.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          No images added yet. Start by choosing files for this cinema gallery.
        </div>
      )}

      {(formError || error) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError || error}
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={closeModal}
          className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Uploading..." : "Upload Images"}
        </button>
      </div>
    </form>
  );
};

export default AddCinemaGallery;
