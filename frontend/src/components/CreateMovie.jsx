import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMovie, resetCreateMovie, updateMovie } from "../features/movies/movieSlice";

const RATING_OPTIONS = ["U", "U/A 7+", "U/A 13+", "U/A 16+", "A"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const currentYear = new Date().getFullYear();

const emptyForm = {
  title: "",
  image: null,
  rating: "",
  language: "",
  genres: "",
  releaseDate: "",
  newRelease: false,
  trailer: "",
};

const emptyErrors = {
  title: "",
  image: "",
  rating: "",
  language: "",
  genres: "",
  releaseDate: "",
  trailer: "",
};

const normalizeGenres = (value) =>
  value
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean)
    .join(",");

const isYoutubeUrl = (value) => {
  try {
    const url = new URL(value);
    return ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"].includes(
      url.hostname,
    );
  } catch {
    return false;
  }
};

const getImagePreview = (image) => {
  if (!image) {
    return null;
  }

  return image.startsWith("http")
    ? image
    : `https://backend.cinesquare.in/uploads/${image}`;
};

const validateField = (name, value, form, isEdit) => {
  switch (name) {
    case "title": {
      const trimmed = value.trim();
      if (!trimmed) return "Movie title is required.";
      if (trimmed.length < 2) return "Movie title must be at least 2 characters.";
      if (trimmed.length > 120) return "Movie title must be under 120 characters.";
      return "";
    }
    case "rating":
      if (!value) return "Please select a rating.";
      if (!RATING_OPTIONS.includes(value)) return "Please select a valid rating.";
      return "";
    case "language": {
      const trimmed = value.trim();
      if (!trimmed) return "Language is required.";
      if (!/^[A-Za-z\s,&/-]+$/.test(trimmed)) {
        return "Language can contain letters, spaces, comma, &, / and - only.";
      }
      if (trimmed.length > 50) return "Language must be under 50 characters.";
      return "";
    }
    case "genres": {
      const normalized = normalizeGenres(value);
      if (!normalized) return "Enter at least one genre.";

      const genres = normalized.split(",");
      if (genres.length > 6) return "You can add up to 6 genres.";

      const invalidGenre = genres.find(
        (genre) => genre.length < 2 || genre.length > 30 || !/^[A-Za-z0-9\s&/-]+$/.test(genre),
      );

      if (invalidGenre) {
        return "Each genre should be 2-30 characters and use valid text only.";
      }

      return "";
    }
    case "releaseDate": {
      if (!value) return "Release date is required.";
      const parsed = new Date(value);
      if (isNaN(parsed.getTime())) return "Enter a valid date.";
      const year = parsed.getFullYear();
      if (year < 1888) return "Release date cannot be before 1888.";
      if (year > currentYear + 2) return `Release date cannot be beyond ${currentYear + 2}.`;
      return "";
    }
    case "trailer": {
      const trimmed = value.trim();
      if (!trimmed) return "Trailer URL is required.";
      try {
        new URL(trimmed);
      } catch {
        return "Enter a valid trailer URL.";
      }

      if (!isYoutubeUrl(trimmed)) {
        return "Please use a valid YouTube trailer link.";
      }

      return "";
    }
    case "image": {
      if (!value && !isEdit) return "Movie poster is required.";
      if (!value) return "";
      if (!value.type.startsWith("image/")) return "Please upload a valid image file.";
      if (value.size > MAX_IMAGE_SIZE) return "Image size must be 5MB or less.";
      return "";
    }
    default:
      return "";
  }
};

const validateForm = (form, isEdit) => {
  const nextErrors = {
    title: validateField("title", form.title, form, isEdit),
    image: validateField("image", form.image, form, isEdit),
    rating: validateField("rating", form.rating, form, isEdit),
    language: validateField("language", form.language, form, isEdit),
    genres: validateField("genres", form.genres, form, isEdit),
    releaseDate: validateField("releaseDate", form.releaseDate, form, isEdit),
    trailer: validateField("trailer", form.trailer, form, isEdit),
  };

  return {
    errors: nextErrors,
    isValid: Object.values(nextErrors).every((error) => !error),
  };
};

const inputClassName = (hasError) =>
  `w-full rounded-xl border px-4 py-3 outline-none transition ${hasError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"
  }`;

const CreateMovie = ({ movieData, onClose }) => {
  const dispatch = useDispatch();
  const { createLoading, updateLoading, error } = useSelector((state) => state.movies);

  const isEdit = Boolean(movieData);
  const isSubmitting = isEdit ? updateLoading : createLoading;

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (movieData) {
      // movie.year is stored as a full date string (e.g. "2024-07-15") in the
      // backend schema (year: String). Use it directly for the date input.
      // If it's an old 4-digit year (legacy), pad it to a valid date.
      let releaseDateStr = "";
      if (movieData.year) {
        const isFullDate = /^\d{4}-\d{2}-\d{2}/.test(movieData.year);
        releaseDateStr = isFullDate
          ? movieData.year.slice(0, 10)
          : `${movieData.year}-01-01`;
      }

      setFormData({
        title: movieData.title || "",
        image: null,
        rating: movieData.rating || "",
        language: movieData.language || "",
        genres: Array.isArray(movieData.genres)
          ? movieData.genres.join(",")
          : movieData.genres || "",
        releaseDate: releaseDateStr,
        newRelease: Boolean(movieData.newRelease),
        trailer: movieData.trailer || "",
      });
      setImagePreview(getImagePreview(movieData.image));
    } else {
      setFormData(emptyForm);
      setImagePreview(null);
    }

    setErrors(emptyErrors);
    setTouched({});
    dispatch(resetCreateMovie());
  }, [dispatch, movieData]);

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const normalizedGenres = useMemo(() => normalizeGenres(formData.genres), [formData.genres]);

  const setFieldValue = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, { ...formData, [name]: value }, isEdit),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;

      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setFieldValue("image", file);
      setImagePreview(file ? URL.createObjectURL(file) : getImagePreview(movieData?.image));
      return;
    }

    if (type === "checkbox") {
      setFieldValue(name, checked);
      return;
    }

    setFieldValue(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, formData[name], formData, isEdit),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(formData, isEdit);
    setErrors(validation.errors);
    setTouched({
      title: true,
      image: true,
      rating: true,
      language: true,
      genres: true,
      releaseDate: true,
      trailer: true,
    });

    if (!validation.isValid) {
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("rating", formData.rating);
    data.append("language", formData.language.trim());
    data.append("genres", normalizeGenres(formData.genres));
    // Backend schema: year is type String — send the full date string (e.g. "2024-07-15")
    data.append("year", formData.releaseDate);
    data.append("newRelease", String(formData.newRelease));
    data.append("trailer", formData.trailer.trim());

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await dispatch(updateMovie({ id: movieData._id, formData: data })).unwrap();
      } else {
        await dispatch(createMovie(data)).unwrap();
      }

      dispatch(resetCreateMovie());
      onClose();
    } catch {
      // Redux state already exposes the API error for the form.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Update Movie" : "Add Movie"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Fill in all the details below. The release date will automatically
          supply the year field to the API.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Movie Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Interstellar"
          maxLength={120}
          className={inputClassName(Boolean(errors.title))}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-red-600">{errors.title}</span>
          <span className="text-gray-400">{formData.title.trim().length}/120</span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Movie Poster</label>
        <label
          className={`relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed ${errors.image ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
            }`}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Movie preview" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="px-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">Click to upload poster</p>
              <p className="mt-1">JPG, PNG or WEBP up to 5MB</p>
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            onBlur={handleBlur}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          {isEdit ? "Upload a new poster only if you want to replace the current one." : "Poster is required for new movies."}
        </p>
        <p className="mt-1 text-xs text-red-600">{errors.image}</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Rating</label>
          <select
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${inputClassName(Boolean(errors.rating))} bg-white`}
          >
            <option value="">Select Rating</option>
            {RATING_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-red-600">{errors.rating}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Language</label>
          <input
            name="language"
            value={formData.language}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="English"
            className={inputClassName(Boolean(errors.language))}
          />
          <p className="mt-1 text-xs text-red-600">{errors.language}</p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Genres</label>
          <input
            name="genres"
            value={formData.genres}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Sci-Fi,Drama"
            className={inputClassName(Boolean(errors.genres))}
          />
          <p className="mt-1 text-xs text-gray-500">Use comma-separated genres </p>
          <p className="mt-1 text-xs text-red-600">{errors.genres}</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Release Date</label>
          <input
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleChange}
            onBlur={handleBlur}
            max={`${currentYear + 2}-12-31`}
            min="1888-01-01"
            className={inputClassName(Boolean(errors.releaseDate))}
          />

          <p className="mt-1 text-xs text-red-600">{errors.releaseDate}</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Trailer URL</label>
        <input
          name="trailer"
          value={formData.trailer}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="https://www.youtube.com/watch?v=zSWdZVtXT7E"
          className={inputClassName(Boolean(errors.trailer))}
        />
        <p className="mt-1 text-xs text-gray-500">Only valid YouTube links are accepted.</p>
        <p className="mt-1 text-xs text-red-600">{errors.trailer}</p>
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
        <input
          type="checkbox"
          name="newRelease"
          checked={formData.newRelease}
          onChange={handleChange}
          className="mt-1"
        />
        <span>
          <span className="block text-sm font-medium text-gray-800">Mark as New Release</span>
          <span className="block text-xs text-gray-500">
            This will be submitted as `{String(formData.newRelease)}` in the multipart request.
          </span>
        </span>
      </label>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-black px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Movie" : "Create Movie"}
        </button>
      </div>
    </form>
  );
};

export default CreateMovie;
