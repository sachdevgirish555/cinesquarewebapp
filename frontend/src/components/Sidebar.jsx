import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Clapperboard,
  Film,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageCircleQuestion,
  Settings,
  SlidersHorizontal,
  UserPlus,
  Video,
  Videotape,
  X,
} from "lucide-react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { logout } from "../features/auth/authSlice";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout Admin?",
      text: "Do you want to logout and clear the current admin session data?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout",
    });

    if (!result.isConfirmed) {
      return;
    }

    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/movie", icon: Film, label: "Movies" },
    { path: "/dashboard/cinema", icon: Videotape, label: "Cinema" },
    { path: "/dashboard/cinema-gallery", icon: Clapperboard, label: "Cinema Gallery" },
    { path: "/dashboard/blog", icon: FileText, label: "Blog" },
    { path: "/dashboard/slider", icon: SlidersHorizontal, label: "Slider" },
    { path: "/dashboard/video", icon: Video, label: "Video" },
    { path: "/dashboard/user", icon: UserPlus, label: "Users" },
    { path: "/dashboard/enquiry", icon: MessageCircleQuestion, label: "Enquiries" },
    { path: "/dashboard/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex min-h-screen w-64 flex-col border-r border-gray-800 bg-gray-900 shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 shrink-0 border-b border-gray-800 bg-gray-900/50 px-6">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 shadow-lg shadow-yellow-400/20">
                <Film className="h-5 w-5 text-gray-900" />
              </div>
              <span className="text-xl font-bold tracking-wide text-white">
                Cine<span className="text-yellow-400">Square</span>
              </span>
            </div>

            <button
              className="-mr-2 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white lg:hidden"
              onClick={() => setIsOpen(false)}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <nav className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-400/10 text-yellow-400 shadow-sm"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? "text-yellow-400" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-gray-800 bg-gray-900/50 p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-5 w-5 text-gray-500 transition-colors group-hover:text-red-500" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
