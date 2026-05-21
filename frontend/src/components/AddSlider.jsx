import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSlider } from "../features/Slider/sliderSlice";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import Swal from "sweetalert2";

const maxFileSize = 2 * 1024 * 1024;

const AddSlider = ({ closeModal }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.slider);

  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  const handleFile = (event) => {
    const selected = event.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    if (selected.size > maxFileSize) {
      setError("Image must be under 2MB.");
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setFile(null);
    setPreview(null);
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please choose a slider image.");
      return;
    }

    if (!text.trim()) {
      setError("Please enter slider caption text.");
      return;
    }

    const formData = new FormData();
    formData.append("img", file);
    formData.append("text", text.trim());

    try {
      await dispatch(createSlider(formData)).unwrap();
      setFile(null);
      setPreview(null);
      setText("");
      setError("");
      closeModal?.();

      Swal.fire({
        title: "Slider uploaded",
        text: "The homepage slider has been added successfully.",
        icon: "success",
        confirmButtonColor: "#111827",
      });
    } catch (err) {
      setError(err || "Unable to upload slider. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-semibold text-gray-700">
          Slider Image
        </span>

        <div className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 transition hover:border-yellow-400 hover:bg-yellow-50/30">
          {!preview ? (
            <div className="flex min-h-56 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                <UploadCloud className="h-7 w-7 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-800">
                Click to upload slider image
              </p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, JPEG, or WEBP. Maximum 2MB.
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Recommended aspect ratio: 16:9
              </p>
            </div>
          ) : (
            <div className="relative overflow-hidden rounded-xl bg-white">
              <img
                src={preview}
                alt="Slider preview"
                className="h-64 w-full object-cover"
              />

              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  removeImage();
                }}
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-lg transition hover:bg-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </label>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          Caption Text
        </label>
        <input
          type="text"
          placeholder="Example: Experience cinema like never before"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setError("");
          }}
          maxLength={90}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>Keep captions short and readable on mobile.</span>
          <span>{text.length}/90</span>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <ImagePlus className="h-4 w-4" />
            Upload Slider
          </>
        )}
      </button>
    </form>
  );
};

export default AddSlider;
