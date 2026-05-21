import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getEmailConfigAPI,
  updateEmailConfigAPI,
} from "../services/emailConfigService";

const decodeJwtPayload = (token) => {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const formatDateTime = (timestamp) => {
  if (!timestamp) {
    return "N/A";
  }

  return new Date(timestamp).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getMaskedPassword = (value) => {
  if (!value) {
    return "Not configured";
  }

  if (value.length <= 4) {
    return "*".repeat(value.length);
  }

  return `${"*".repeat(Math.max(value.length - 4, 4))}${value.slice(-2)}`;
};

const getStatusStyles = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "expired":
      return "bg-red-100 text-red-700";
    case "missing":
      return "bg-yellow-100 text-yellow-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Settings = () => {
  const authToken = useSelector((state) => state.auth.token) || localStorage.getItem("token");

  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    emailUser: "",
    emailPass: "",
  });
  const [storedPassword, setStoredPassword] = useState("");

  const decodedToken = useMemo(() => decodeJwtPayload(authToken || ""), [authToken]);
  const expiresAt = decodedToken?.exp ? decodedToken.exp * 1000 : null;
  const isExpired = expiresAt ? Date.now() > expiresAt : false;

  const [tokenStatus, setTokenStatus] = useState(
    !authToken ? "missing" : isExpired ? "expired" : "unknown",
  );

  useEffect(() => {
    const fetchConfig = async () => {
      if (!authToken) {
        setLoading(false);
        setError("No authentication token found. Please login again.");
        setTokenStatus("missing");
        return;
      }

      if (isExpired) {
        setLoading(false);
        setError("Your token appears to be expired. Please login again.");
        setTokenStatus("expired");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await getEmailConfigAPI(authToken);
        const data = res?.data || {};

        setConfig(data);
        setStoredPassword(data.emailPass || "");
        setForm({
          emailUser: data.emailUser || "",
          emailPass: "",
        });
        setTokenStatus("active");
      } catch (fetchError) {
        const message =
          fetchError?.message ||
          fetchError?.data?.message ||
          "Failed to load email configuration.";

        setError(message);
        setTokenStatus(fetchError?.data?.message?.toLowerCase().includes("token") ? "invalid" : "unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [authToken, isExpired]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess("");
    setError("");
  };

  const validateForm = () => {
    const trimmedEmail = form.emailUser.trim();
    const finalPassword = form.emailPass.trim() || storedPassword;

    if (!trimmedEmail) {
      return "SMTP email user is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    if (!finalPassword) {
      return "SMTP password or app password is required.";
    }

    if (finalPassword.length < 8) {
      return "SMTP password must be at least 8 characters.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    if (!authToken) {
      setError("No active token available. Please login again.");
      return;
    }

    const result = await Swal.fire({
      title: "Update SMTP Config?",
      text: "Do you want to save these email settings for the admin panel?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, save settings",
    });

    if (!result.isConfirmed) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      emailUser: form.emailUser.trim(),
      emailPass: form.emailPass.trim() || storedPassword,
    };

    try {
      const res = await updateEmailConfigAPI(authToken, payload);
      const updatedData = res?.data || payload;

      setConfig((prev) => ({
        ...prev,
        ...updatedData,
        emailPassConfigured: true,
      }));
      setStoredPassword(payload.emailPass);
      setForm((prev) => ({
        ...prev,
        emailUser: payload.emailUser,
        emailPass: "",
      }));
      setSuccess("SMTP email configuration updated successfully.");
      setTokenStatus("active");
    } catch (saveError) {
      const message =
        saveError?.message ||
        saveError?.data?.message ||
        "Failed to update email configuration.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Admin Settings
        </p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">SMTP Email Configuration</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-500">
          Manage the enquiry SMTP credentials used by the admin panel. This page
          loads the current email configuration from the API and lets you update it
          without exposing the full stored password.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Email Config</h2>
              <p className="mt-1 text-sm text-gray-500">
                Update the SMTP email and app password used for enquiry mail delivery.
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusStyles(
                config?.emailPassConfigured ? "active" : "missing",
              )}`}
            >
              {config?.emailPassConfigured ? "Configured" : "Not Configured"}
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-sm text-gray-500">Loading SMTP configuration...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 pt-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    SMTP Email User
                  </label>
                  <input
                    name="emailUser"
                    value={form.emailUser}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    SMTP Password / App Password
                  </label>
                  <input
                    name="emailPass"
                    type="password"
                    value={form.emailPass}
                    onChange={handleChange}
                    placeholder={storedPassword ? "Enter new password to replace existing one" : "Enter SMTP password"}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Current Password Status
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {config?.emailPassConfigured ? "Password configured" : "Password not configured"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Masked value: {getMaskedPassword(storedPassword)}
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Config Source
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    {config?.source || "N/A"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Password is never rendered in full on this screen.
                  </p>
                </div>
              </div>

              {(error || success) && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    error
                      ? "border border-red-200 bg-red-50 text-red-700"
                      : "border border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {error || success}
                </div>
              )}

              <div className="flex justify-end border-t border-gray-200 pt-4">
                <button
                  type="submit"
                  disabled={saving || loading}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Update SMTP Config"}
                </button>
              </div>
            </form>
          )}
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Token Status</h2>
            <p className="mt-1 text-sm text-gray-500">
              Quick overview of whether the current admin token looks active for this page.
            </p>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Current State
                </p>
                <span
                  className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusStyles(
                    tokenStatus,
                  )}`}
                >
                  {tokenStatus}
                </span>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Expires At
                </p>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {formatDateTime(expiresAt)}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Token Preview
                </p>
                <p className="mt-2 break-all text-sm text-gray-600">
                  {authToken ? `${authToken.slice(0, 18)}...${authToken.slice(-12)}` : "No token"}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Guidance
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  If token status is expired, invalid, or missing, re-login before saving SMTP settings.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Security Notes</h2>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Stored password is masked in the UI and never shown in full.</li>
              <li>A new password is only sent if you type one, otherwise the current configured value is reused.</li>
              <li>The page uses the current admin bearer token to call GET and PUT email-config APIs.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Settings;
