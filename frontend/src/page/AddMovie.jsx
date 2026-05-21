import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteMovie, getMovies } from "../features/movies/movieSlice";
import CreateMovie from "../components/CreateMovie";

const ITEMS_PER_PAGE = 10;

const DashboardMovies = () => {
  const dispatch = useDispatch();
  const { movies, loading, deleteLoading, error } = useSelector((state) => state.movies);

  const [openModal, setOpenModal] = useState(false);
  const [editMovie, setEditMovie] = useState(null);
  const [deleteMovieData, setDeleteMovieData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(movies.length / ITEMS_PER_PAGE));
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return movies.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, movies]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeModal = () => {
    setOpenModal(false);
    setEditMovie(null);
  };

  const startItem = movies.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, movies.length);

  return (
    <div className="rounded-xl bg-white p-4 shadow sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Movies</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage movie records with validated fields before sending them to the API.
          </p>
        </div>

        <button
          onClick={() => {
            setEditMovie(null);
            setOpenModal(true);
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black sm:w-auto"
        >
          <Plus size={18} /> Add Movie
        </button>
      </div>

      {error && !openModal && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 md:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 font-semibold">Poster</th>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Language</th>
              <th className="p-3 font-semibold">Rating</th>
              <th className="p-3 font-semibold">Release Date</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  Loading movies...
                </td>
              </tr>
            ) : movies.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No movies found.
                </td>
              </tr>
            ) : (
              paginatedMovies.map((movie) => (
                <tr key={movie._id} className="border-t border-gray-200">
                  <td className="p-3">
                    <img
                      src={`https://backend.cinesquare.in/uploads/${movie.image}`}
                      alt={movie.title}
                      className="h-20 w-14 rounded object-cover"
                    />
                  </td>
                  <td className="p-3 font-semibold text-gray-900">{movie.title}</td>
                  <td className="p-3 text-gray-700">{movie.language}</td>
                  <td className="p-3 text-gray-700">{movie.rating || "-"}</td>
                  <td className="p-3 text-gray-700">
                    {movie.year && /^\d{4}-\d{2}-\d{2}/.test(movie.year)
                      ? new Date(movie.year).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : movie.year || "-"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        movie.newRelease
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {movie.newRelease ? "New Release" : "Regular"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditMovie(movie);
                          setOpenModal(true);
                        }}
                        className="rounded bg-gray-100 p-2 text-gray-700"
                        aria-label={`Edit ${movie.title}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteMovieData(movie)}
                        className="rounded bg-red-100 p-2 text-red-600"
                        aria-label={`Delete ${movie.title}`}
                      >
                        <Trash2 size={16} />
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
            Loading movies...
          </div>
        ) : movies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No movies found.
          </div>
        ) : (
          paginatedMovies.map((movie) => (
            <div key={movie._id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <img
                  src={`https://backend.cinesquare.in/uploads/${movie.image}`}
                  alt={movie.title}
                  className="h-24 w-16 shrink-0 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 leading-snug">{movie.title}</p>
                  <p className="text-sm text-gray-500">
                    {movie.language} ·{" "}
                    {movie.year && /^\d{4}-\d{2}-\d{2}/.test(movie.year)
                      ? new Date(movie.year).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : movie.year || "-"}
                  </p>
                  <p className="text-sm text-gray-500">Rating: {movie.rating || "N/A"}</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      movie.newRelease ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {movie.newRelease ? "New Release" : "Regular"}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    onClick={() => { setEditMovie(movie); setOpenModal(true); }}
                    className="rounded-lg bg-gray-100 p-2 text-gray-700"
                    aria-label={`Edit ${movie.title}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteMovieData(movie)}
                    className="rounded-lg bg-red-100 p-2 text-red-600"
                    aria-label={`Delete ${movie.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && movies.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
          <p>
            Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
            <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
            <span className="font-semibold text-gray-900">{movies.length}</span> movies
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

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute right-4 top-4 text-gray-500">
              <X size={20} />
            </button>

            <CreateMovie movieData={editMovie} onClose={closeModal} />
          </div>
        </div>
      )}

      {deleteMovieData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900">Delete Movie</h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{deleteMovieData.title}</span>?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setDeleteMovieData(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  dispatch(deleteMovie(deleteMovieData._id));
                  setDeleteMovieData(null);
                }}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardMovies;
