import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import { loginUser } from "../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      await dispatch(loginUser(form)).unwrap();
      toast.success("Admin login successful. Session active for 15 minutes.");
    } catch (err) {
      toast.error(err || "Login failed.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fef3c7,_transparent_35%),radial-gradient(circle_at_bottom_right,_#dbeafe,_transparent_30%),linear-gradient(135deg,_#f8fafc,_#eef2ff_45%,_#f9fafb)]">
      <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="hidden rounded-[2rem] border border-white/70 bg-white/60 p-10 shadow-[0_20px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              <ShieldCheck className="h-4 w-4" />
              Production Admin Access
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900">
              Manage CineSquare operations from one secure admin workspace.
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-600">
              Access movies, cinemas, galleries, enquiries, and system settings through
              a protected admin experience designed for fast daily operations.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Session Policy
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">5 Min</p>
                <p className="mt-1 text-sm text-gray-500">Auto logout protection</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Access
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">Admin</p>
                <p className="mt-1 text-sm text-gray-500">Restricted dashboard only</p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Security
                </p>
                <p className="mt-2 text-lg font-bold text-gray-900">Protected</p>
                <p className="mt-1 text-sm text-gray-500">Token-based login flow</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-amber-500 shadow-lg">
              <ShieldCheck className="h-7 w-7 text-gray-900" />
            </div>
            <h2 className="mt-5 text-3xl font-bold text-gray-900">Admin Login</h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to the CineSquare admin panel.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/65 backdrop-blur-[2px]">
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-3 shadow-lg">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                  <span className="text-sm font-medium text-gray-700">Signing you in...</span>
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter admin email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              Admin sessions expire automatically after 15 minutes. You will need to login again after timeout.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_14px_30px_rgba(17,24,39,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ? "Signing In..." : "Login to Admin Panel"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
