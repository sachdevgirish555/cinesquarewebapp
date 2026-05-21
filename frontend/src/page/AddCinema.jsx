import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import CreateCinema from "../components/CreateCinema";
import { deleteCinema, getCinemas } from "../features/Cinema/cinemaSlice";

const ITEMS_PER_PAGE = 10;

const DashboardCinema = () => {
  const dispatch = useDispatch();
  const { cinemas, loading, error } = useSelector((state) => state.cinema);

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getCinemas());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(cinemas.length / ITEMS_PER_PAGE));
  const paginatedCinemas = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return cinemas.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [cinemas, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeModal = () => {
    setOpen(false);
    setEditData(null);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Cinema?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      dispatch(deleteCinema(id));
    }
  };

  const startItem = cinemas.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, cinemas.length);

  return (
    <div className="rounded-xl bg-white p-4 shadow sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cinemas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage cinema details with validated admin fields and multipart upload support.
          </p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white sm:w-auto"
        >
          Add Cinema
        </button>
      </div>

      {error && !open && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Name</th>
              <th className="p-3 font-semibold">City</th>
              <th className="p-3 font-semibold">Phone</th>
              <th className="p-3 font-semibold">Social</th>
              <th className="p-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Loading cinemas...
                </td>
              </tr>
            ) : cinemas.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No cinemas found.
                </td>
              </tr>
            ) : (
              paginatedCinemas.map((cinema) => (
                <tr key={cinema._id} className="border-t border-gray-200">
                  <td className="p-3">
                    <img
                      src={`https://backend.cinesquare.in/uploads/${String(cinema.img || "").replace(/^\/+/, "")}`}
                      alt={cinema.name}
                      className="h-16 w-16 rounded object-cover"
                    />
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{cinema.name}</td>
                  <td className="p-3 text-gray-700">{cinema.city}</td>
                  <td className="p-3 text-gray-700">
                    {Array.isArray(cinema.phone)
                      ? cinema.phone.join(", ")
                      : cinema.phone || "-"}
                  </td>
                  <td className="p-3 text-gray-700">
                    {Array.isArray(cinema.social) ? cinema.social.length : 0} links
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditData(cinema);
                          setOpen(true);
                        }}
                        className="rounded bg-yellow-500 px-3 py-1 font-medium text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cinema._id)}
                        className="rounded bg-red-500 px-3 py-1 font-medium text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {loading ? (
          <div className="rounded-xl border border-gray-200 p-6 text-center text-gray-500">
            Loading cinemas...
          </div>
        ) : cinemas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No cinemas found.
          </div>
        ) : (
          paginatedCinemas.map((cinema) => (
            <div key={cinema._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <img
                  src={`https://backend.cinesquare.in/uploads/${String(cinema.img || "").replace(/^\/+/, "")}`}
                  alt={cinema.name}
                  className="h-16 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{cinema.name}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{cinema.city}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {Array.isArray(cinema.phone) ? cinema.phone.join(", ") : cinema.phone || "-"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {Array.isArray(cinema.social) ? cinema.social.length : 0} social link(s)
                  </p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setEditData(cinema); setOpen(true); }}
                  className="flex-1 rounded-lg bg-yellow-500 py-2 text-sm font-semibold text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cinema._id)}
                  className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && cinemas.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>
            Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
            <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900">{cinemas.length}</span> cinemas
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="rounded-lg bg-white px-3 py-1.5 font-medium text-gray-900">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={closeModal}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 text-xl text-gray-500 hover:text-black"
            >
              x
            </button>

            <CreateCinema closeModal={closeModal} editData={editData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardCinema;
