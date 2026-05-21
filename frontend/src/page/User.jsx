import React, { useEffect, useState } from "react";
import AddUser from "../components/AddUser";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers } from "../features/User/userSlice";
import { Plus, X, User as UserIcon, Mail, Shield, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const User = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((s) => s.user);
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    dispatch(getUsers(token));
  }, [dispatch]);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete User?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'rounded-2xl shadow-xl border-0',
        confirmButton: 'rounded-lg',
        cancelButton: 'rounded-lg'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser({ id, token }));

        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-2xl shadow-xl border-0'
          }
        });
      }
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Users Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage admin roles and application users</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg shadow-sm font-medium transition-colors sm:w-auto"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* ================= TABLE (Desktop) ================= */}
      <div className="hidden min-h-[400px] md:block">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-900">No users found</p>
            <p className="text-sm text-gray-500">There are no users to display.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                        {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4"/>}
                      </div>
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        user.role === "admin"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {user.role === "admin" && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= CARDS (Mobile) ================= */}
      <div className="grid gap-4 p-4 md:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-4">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 space-y-3">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-base font-medium text-gray-900">No users found</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                    {user.name?.charAt(0).toUpperCase() || <UserIcon className="w-4 h-4"/>}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3 shrink-0" />
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  title="Delete User"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    user.role === "admin"
                      ? "bg-red-50 text-red-600 border-red-100"
                      : "bg-gray-50 text-gray-600 border-gray-200"
                  }`}
                >
                  {user.role === "admin" && <Shield className="w-3 h-3" />}
                  {user.role}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
            <div className="pt-2">
              <AddUser />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default User;
