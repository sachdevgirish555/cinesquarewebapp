import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBlog,
  resetCreateBlog,
  updateBlog,
} from "../features/Blog/blogSlice";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptyForm = {
  title: "",
  excerpt: "",
  category: "",
  image: null,
};

const emptyErrors = {
  title: "",
  excerpt: "",
  category: "",
  image: "",
};

const getImagePreview = (image) => {
  if (!image || typeof image !== "string") {
    return null;
  }

  const normalized = image.replace(/^\/+/, "");
  return normalized.startsWith("http")
    ? normalized
    : `https://backend.cinesquare.in/uploads/${normalized}`;
};

const validateField = (name, value, form, isEdit) => {
  switch (name) {
    case "title": {
      const trimmed = value.trim();
      if (!trimmed) return "Blog title is required.";
      if (trimmed.length < 5) return "Blog title must be at least 5 characters.";
      if (trimmed.length > 150) return "Blog title must be under 150 characters.";
      return "";
    }
    case "excerpt": {
      const trimmed = value.trim();
      if (!trimmed) return "Excerpt is required.";
      if (trimmed.length < 20) return "Excerpt must be at least 20 characters.";
      if (trimmed.length > 500) return "Excerpt must be under 500 characters.";
      return "";
    }
    case "category": {
      const trimmed = value.trim();
      if (!trimmed) return "Category is required.";
      if (trimmed.length < 2) return "Category must be at least 2 characters.";
      if (trimmed.length > 40) return "Category must be under 40 characters.";
      if (!/^[A-Za-z\s&/-]+$/.test(trimmed)) {
        return "Category can contain letters, spaces, &, / and - only.";
      }
      return "";
    }
    case "image":
      if (!value && !isEdit) return "Blog image is required.";
      if (!value) return "";
      if (!value.type?.startsWith("image/")) return "Please upload a valid image file.";
      if (value.size > MAX_IMAGE_SIZE) return "Image size must be 5MB or less.";
      return "";
    default:
      return "";
  }
};

const validateForm = (form, isEdit) => {
  const errors = {
    title: validateField("title", form.title, form, isEdit),
    excerpt: validateField("excerpt", form.excerpt, form, isEdit),
    category: validateField("category", form.category, form, isEdit),
    image: validateField("image", form.image, form, isEdit),
  };

  return {
    errors,
    isValid: Object.values(errors).every((error) => !error),
  };
};

const inputClassName = (hasError) =>
  `w-full rounded-xl border px-4 py-3 outline-none transition ${
    hasError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"
  }`;

const CreateBlog = ({ blogData, onClose }) => {
  const dispatch = useDispatch();
  const { createLoading, updateLoading, error } = useSelector((state) => state.blogs);

  const isEdit = Boolean(blogData);
  const isSubmitting = isEdit ? updateLoading : createLoading;

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (blogData) {
      setFormData({
        title: blogData.title || "",
        excerpt: blogData.excerpt || "",
        category: blogData.category || "",
        image: null,
      });
      setImagePreview(getImagePreview(blogData.image));
    } else {
      setFormData(emptyForm);
      setImagePreview(null);
    }

    setErrors(emptyErrors);
    setTouched({});
    dispatch(resetCreateBlog());
  }, [blogData, dispatch]);

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const excerptLength = useMemo(() => formData.excerpt.trim().length, [formData.excerpt]);

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
    const { name, value, files, type } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;
      if (imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      setFieldValue("image", file);
      setImagePreview(file ? URL.createObjectURL(file) : getImagePreview(blogData?.image));
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
      excerpt: true,
      category: true,
      image: true,
    });

    if (!validation.isValid) {
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("excerpt", formData.excerpt.trim());
    data.append("category", formData.category.trim());

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await dispatch(updateBlog({ id: blogData._id, formData: data })).unwrap();
      } else {
        await dispatch(createBlog(data)).unwrap();
      }

      dispatch(resetCreateBlog());
      onClose();
    } catch {
      // Redux already exposes the API error in the UI.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Update Blog" : "Add Blog"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Create and manage blog posts with validated content and image upload support.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Blog Title</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={150}
          placeholder="Enter blog title"
          className={inputClassName(Boolean(errors.title))}
        />
        <p className="mt-1 text-xs text-red-600">{errors.title}</p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Excerpt</label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="5"
          maxLength={500}
          placeholder="Short blog description"
          className={`${inputClassName(Boolean(errors.excerpt))} resize-none`}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-red-600">{errors.excerpt}</span>
          <span className="text-gray-400">{excerptLength}/500</span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={40}
          placeholder="e.g. News, Events, Cinema"
          className={inputClassName(Boolean(errors.category))}
        />
        <p className="mt-1 text-xs text-red-600">{errors.category}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Blog Image</label>
        <label
          className={`relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed ${
            errors.image ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Blog preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="px-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">Click to upload blog image</p>
              <p className="mt-1">JPG, PNG or WEBP up to 5MB</p>
            </div>
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, image: true }));
              setErrors((prev) => ({
                ...prev,
                image: validateField("image", formData.image, formData, isEdit),
              }));
            }}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          {isEdit ? "Upload a new image only if you want to replace the current one." : "Blog image is required for new posts."}
        </p>
        <p className="mt-1 text-xs text-red-600">{errors.image}</p>
      </div>

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
          {isSubmitting ? "Saving..." : isEdit ? "Update Blog" : "Create Blog"}
        </button>
      </div>
    </form>
  );
};

export default CreateBlog;
