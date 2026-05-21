import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Menu } from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar";
import { logout, syncSessionState } from "../features/auth/authSlice";

const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { sessionExpiresAt } = useSelector((state) => state.auth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    dispatch(syncSessionState());
  }, [dispatch]);

  useEffect(() => {
    if (!sessionExpiresAt) {
      setTimeLeft("Session expired");
      return;
    }

    const updateTime = () => {
      const remaining = sessionExpiresAt - Date.now();

      if (remaining <= 0) {
        setTimeLeft("Session expired");
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeLeft(`${minutes}m ${String(seconds).padStart(2, "0")}s`);
    };

    updateTime();
    const intervalId = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(intervalId);
  }, [sessionExpiresAt]);

  useEffect(() => {
    if (!sessionExpiresAt) {
      return undefined;
    }

    const timeout = sessionExpiresAt - Date.now();
    if (timeout <= 0) {
      dispatch(logout());
      return undefined;
    }

    const timerId = window.setTimeout(async () => {
      dispatch(logout());
      await Swal.fire({
        title: "Session Expired",
        text: "Your admin session expired after 15 minutes. Please login again.",
        icon: "info",
        confirmButtonColor: "#2563eb",
      });
      window.location.assign("/login");
    }, timeout);

    return () => window.clearTimeout(timerId);
  }, [dispatch, sessionExpiresAt]);

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex min-h-screen w-full flex-1 flex-col transition-all duration-300 ease-in-out lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:px-8">
          {/* Mobile hamburger */}
          <button
            className="-ml-2 rounded-xl p-2 text-gray-600 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Session timer */}
          <div className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            Session: {timeLeft}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden p-4 sm:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
