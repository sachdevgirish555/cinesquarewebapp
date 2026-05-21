import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCinema, resetCinemaState, updateCinema } from "../features/Cinema/cinemaSlice";

const SOCIAL_OPTIONS = [
  { label: "Facebook", value: "facebook" },
  { label: "Instagram", value: "instagram" },
  { label: "Twitter", value: "twitter" },
  { label: "YouTube", value: "youtube" },
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const emptySocial = { icon: "", link: "" };
const emptyForm = {
  city: "",
  name: "",
  address: "",
  phone: "",
  img: null,
  social: [{ ...emptySocial }],
};

const emptyErrors = {
  city: "",
  name: "",
  address: "",
  phone: "",
  img: "",
  social: "",
};

const inputClassName = (hasError) =>
  `w-full rounded-xl border px-4 py-3 outline-none transition ${
    hasError ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-black"
  }`;

const getImagePreviewCandidates = (img) => {
  if (!img || typeof img !== "string") {
    return [];
  }

  const trimmedImg = img.trim();
  if (!trimmedImg) {
    return [];
  }

  if (trimmedImg.startsWith("blob:") || trimmedImg.startsWith("http")) {
    return [trimmedImg];
  }

  const cleanedPath = trimmedImg.replace(/^\/+/, "");
  const fileName = cleanedPath.split("/").pop();

  return [...new Set([
    `https://backend.cinesquare.in/${cleanedPath}`,
    `https://backend.cinesquare.in/uploads/${cleanedPath}`,
    fileName ? `https://backend.cinesquare.in/uploads/${fileName}` : null,
  ].filter(Boolean))];
};

const normalizePhones = (value) =>
  value
    .split(",")
    .map((phone) => phone.trim())
    .filter(Boolean);

const sanitizeSocial = (socialItems) =>
  socialItems.map((item) => ({
    icon: item.icon.trim(),
    link: item.link.trim(),
  }));

const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const validateField = (name, value, form, isEdit) => {
  switch (name) {
    case "city": {
      const trimmed = value.trim();
      if (!trimmed) return "City is required.";
      if (trimmed.length < 2) return "City must be at least 2 characters.";
      if (trimmed.length > 80) return "City must be under 80 characters.";
      if (!/^[A-Za-z\s,.-]+$/.test(trimmed)) {
        return "City can contain letters, spaces, comma, dot and hyphen only.";
      }
      return "";
    }
    case "name": {
      const trimmed = value.trim();
      if (!trimmed) return "Cinema name is required.";
      if (trimmed.length < 2) return "Cinema name must be at least 2 characters.";
      if (trimmed.length > 120) return "Cinema name must be under 120 characters.";
      return "";
    }
    case "address": {
      const trimmed = value.trim();
      if (!trimmed) return "Address is required.";
      if (trimmed.length < 10) return "Address must be at least 10 characters.";
      if (trimmed.length > 250) return "Address must be under 250 characters.";
      return "";
    }
    case "phone": {
      const phones = normalizePhones(value);
      if (phones.length === 0) return "At least one phone number is required.";
      if (phones.length > 5) return "You can add up to 5 phone numbers.";

      const invalidPhone = phones.find((phone) => !/^\d{10}$/.test(phone));
      if (invalidPhone) return "Each phone number must be exactly 10 digits.";

      if (new Set(phones).size !== phones.length) {
        return "Duplicate phone numbers are not allowed.";
      }

      return "";
    }
    case "img":
      if (!value && !isEdit) return "Cinema image is required.";
      if (!value) return "";
      if (!value.type?.startsWith("image/")) return "Please upload a valid image file.";
      if (value.size > MAX_IMAGE_SIZE) return "Image size must be 5MB or less.";
      return "";
    case "social": {
      const socialItems = sanitizeSocial(form.social).filter(
        (item) => item.icon || item.link,
      );

      if (socialItems.length === 0) {
        return "Add at least one social link.";
      }

      if (socialItems.length > 6) {
        return "You can add up to 6 social links.";
      }

      const invalidItem = socialItems.find((item) => {
        if (!item.icon || !item.link) return true;
        if (!SOCIAL_OPTIONS.some((option) => option.value === item.icon)) return true;
        if (!isValidUrl(item.link)) return true;
        return false;
      });

      if (invalidItem) {
        return "Every social row needs a platform and a valid URL.";
      }

      const duplicates = new Set();
      for (const item of socialItems) {
        if (duplicates.has(item.icon)) {
          return "Each social platform should be added only once.";
        }
        duplicates.add(item.icon);
      }

      return "";
    }
    default:
      return "";
  }
};

const validateForm = (form, isEdit) => {
  const nextErrors = {
    city: validateField("city", form.city, form, isEdit),
    name: validateField("name", form.name, form, isEdit),
    address: validateField("address", form.address, form, isEdit),
    phone: validateField("phone", form.phone, form, isEdit),
    img: validateField("img", form.img, form, isEdit),
    social: validateField("social", form.social, form, isEdit),
  };

  return {
    errors: nextErrors,
    isValid: Object.values(nextErrors).every((error) => !error),
  };
};

const CreateCinema = ({ closeModal, editData }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.cinema);

  const isEdit = Boolean(editData);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState(emptyErrors);
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [previewAttemptIndex, setPreviewAttemptIndex] = useState(0);

  useEffect(() => {
    if (editData) {
      setForm({
        city: editData.city || "",
        name: editData.name || "",
        address: editData.address || "",
        phone: Array.isArray(editData.phone)
          ? editData.phone.join(",")
          : editData.phone
            ? String(editData.phone)
            : "",
        img: null,
        social:
          Array.isArray(editData.social) && editData.social.length > 0
            ? editData.social.map((item) => ({
                icon: item.icon || "",
                link: item.link || "",
              }))
            : [{ ...emptySocial }],
      });
      const previewCandidates = getImagePreviewCandidates(editData.img);
      setImagePreview(previewCandidates[0] || null);
      setPreviewAttemptIndex(0);
    } else {
      setForm(emptyForm);
      setImagePreview(null);
      setPreviewAttemptIndex(0);
    }

    setErrors(emptyErrors);
    setTouched({});
    dispatch(resetCinemaState());
  }, [dispatch, editData]);

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const phoneList = useMemo(() => normalizePhones(form.phone), [form.phone]);
  const socialPayload = useMemo(
    () =>
      sanitizeSocial(form.social).filter((item) => item.icon && item.link),
    [form.social],
  );
  const previewCandidates = useMemo(() => {
    if (imagePreview?.startsWith("blob:")) {
      return [imagePreview];
    }

    return getImagePreviewCandidates(editData?.img);
  }, [editData?.img, imagePreview]);

  const displayImagePreview =
    imagePreview?.startsWith("blob:")
      ? imagePreview
      : previewCandidates[previewAttemptIndex] || imagePreview || null;

  const setFieldValue = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value, { ...form, [name]: value }, isEdit),
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, form[name], form, isEdit),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setFieldValue("img", file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
    setPreviewAttemptIndex(0);
  };

  const handlePreviewError = () => {
    if (imagePreview?.startsWith("blob:")) {
      setImagePreview(null);
      return;
    }

    setPreviewAttemptIndex((prev) => {
      if (prev < previewCandidates.length - 1) {
        return prev + 1;
      }

      return prev;
    });
  };

  const handleSocialChange = (index, field, value) => {
    const updatedSocial = form.social.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: value } : item,
    );

    setForm((prev) => ({ ...prev, social: updatedSocial }));

    if (touched.social) {
      setErrors((prev) => ({
        ...prev,
        social: validateField("social", updatedSocial, { ...form, social: updatedSocial }, isEdit),
      }));
    }
  };

  const handleSocialBlur = () => {
    setTouched((prev) => ({ ...prev, social: true }));
    setErrors((prev) => ({
      ...prev,
      social: validateField("social", form.social, form, isEdit),
    }));
  };

  const addSocialField = () => {
    if (form.social.length >= 6) return;
    setForm((prev) => ({
      ...prev,
      social: [...prev.social, { ...emptySocial }],
    }));
  };

  const removeSocialField = (index) => {
    const updatedSocial =
      form.social.length === 1
        ? [{ ...emptySocial }]
        : form.social.filter((_, itemIndex) => itemIndex !== index);

    setForm((prev) => ({ ...prev, social: updatedSocial }));

    if (touched.social) {
      setErrors((prev) => ({
        ...prev,
        social: validateField("social", updatedSocial, { ...form, social: updatedSocial }, isEdit),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(form, isEdit);
    setErrors(validation.errors);
    setTouched({
      city: true,
      name: true,
      address: true,
      phone: true,
      img: true,
      social: true,
    });

    if (!validation.isValid) {
      return;
    }

    const formData = new FormData();
    formData.append("city", form.city.trim());
    formData.append("name", form.name.trim());
    formData.append("address", form.address.trim());

    phoneList.forEach((phone) => {
      formData.append("phone", phone);
    });

    formData.append("social", JSON.stringify(socialPayload));

    if (form.img) {
      formData.append("img", form.img);
    }

    try {
      if (isEdit) {
        await dispatch(updateCinema({ id: editData._id, data: formData })).unwrap();
      } else {
        await dispatch(createCinema(formData)).unwrap();
      }

      dispatch(resetCinemaState());
      closeModal();
    } catch {
      // Error message already comes from Redux state.
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Update Cinema" : "Add Cinema"}
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cinema Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={120}
            placeholder="CINE SQUARE CINEMAS"
            className={inputClassName(Boolean(errors.name))}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-red-600">{errors.name}</span>
            <span className="text-gray-400">{form.name.trim().length}/120</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">City</label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={80}
            placeholder="SIKAR, RAJASTHAN"
            className={inputClassName(Boolean(errors.city))}
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            <span className="text-red-600">{errors.city}</span>
            <span className="text-gray-400">{form.city.trim().length}/80</span>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          onBlur={handleBlur}
          rows="3"
          maxLength={250}
          placeholder="4th Floor, Shiv Mandir Cine Mall, Fatehpur Road..."
          className={inputClassName(Boolean(errors.address))}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-red-600">{errors.address}</span>
          <span className="text-gray-400">{form.address.trim().length}/250</span>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Phone Numbers
        </label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="9785464572,9876543210"
          className={inputClassName(Boolean(errors.phone))}
        />
        <p className="mt-1 text-xs text-gray-500">
          Use comma-separated 10-digit numbers. Each number will be sent as its own
          `phone` field in `FormData`.
        </p>
        <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Cinema Image</label>
        <label
          className={`relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed ${
            errors.img ? "border-red-400 bg-red-50" : "border-gray-300 bg-gray-50"
          }`}
        >
          {displayImagePreview ? (
            <img
              src={displayImagePreview}
              alt="Cinema preview"
              className="absolute inset-0 h-full w-full object-cover"
              onError={handlePreviewError}
            />
          ) : (
            <div className="px-6 text-center text-sm text-gray-500">
              <p className="font-medium text-gray-700">Click to upload cinema image</p>
              <p className="mt-1">JPG, PNG or WEBP up to 5MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, img: true }));
              setErrors((prev) => ({
                ...prev,
                img: validateField("img", form.img, form, isEdit),
              }));
            }}
            className="hidden"
          />
        </label>
        <p className="mt-2 text-xs text-gray-500">
          {isEdit ? "Upload a new image only if you want to replace the current one." : "Cinema image is required for new entries."}
        </p>
        {isEdit && displayImagePreview && (
          <p className="mt-1 text-xs text-green-700">Current cinema image loaded for preview.</p>
        )}
        <p className="mt-1 text-xs text-red-600">{errors.img}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">Social Links</label>
          <button
            type="button"
            onClick={addSocialField}
            disabled={form.social.length >= 6}
            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add Social
          </button>
        </div>

        <div className="space-y-3">
          {form.social.map((item, index) => (
            <div key={`${item.icon}-${index}`} className="grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <select
                value={item.icon}
                onChange={(e) => handleSocialChange(index, "icon", e.target.value)}
                onBlur={handleSocialBlur}
                className={`${inputClassName(Boolean(errors.social))} bg-white`}
              >
                <option value="">Select Platform</option>
                {SOCIAL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                value={item.link}
                onChange={(e) => handleSocialChange(index, "link", e.target.value)}
                onBlur={handleSocialBlur}
                placeholder="https://www.instagram.com/..."
                className={inputClassName(Boolean(errors.social))}
              />

              <button
                type="button"
                onClick={() => removeSocialField(index)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {(phoneList.length > 0 || socialPayload.length > 0) && (
        <div className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
          Payload preview: `phone={phoneList.join(" | ")}` and
          `social='{JSON.stringify(socialPayload)}'`
        </div>
      )}

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

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
          className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Saving..." : isEdit ? "Update Cinema" : "Create Cinema"}
        </button>
      </div>
    </form>
  );
};

export default CreateCinema;
