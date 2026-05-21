import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import AddCinemaGallery from "../../components/AddCinemaGallery";
import { getCinemas } from "../../features/Cinema/cinemaSlice";
import {
  deleteGallery,
  getGalleryByCinema,
} from "../../features/CinemaGallery/gallerySlice";

const getImageUrl = (img) => {
  if (!img || typeof img !== "string") {
    return "";
  }

  const normalized = img.replace(/\\/g, "/").replace(/^\/+/, "");
  return `https://backend.cinesquare.in/uploads/${normalized}`;
};

const getTotalImages = (galleryItems) =>
  galleryItems.reduce((total, item) => {
    const images = Array.isArray(item?.images) ? item.images.length : 0;
    return total + images;
  }, 0);

const CinemaGallery = () => {
  const dispatch = useDispatch();
  const { galleries, loading, error } = useSelector((state) => state.gallery);
  const { cinemas } = useSelector((state) => state.cinema);

  const [cinemaId, setCinemaId] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch(getCinemas());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getGalleryByCinema(cinemaId));
  }, [cinemaId, dispatch]);

  const safeGalleries = useMemo(
    () => (Array.isArray(galleries) ? galleries : []),
    [galleries],
  );

  const selectedCinema = useMemo(
    () =>
      Array.isArray(cinemas)
        ? cinemas.find((cinema) => cinema._id === cinemaId) || null
        : null,
    [cinemaId, cinemas],
  );

  const totalImages = useMemo(() => getTotalImages(safeGalleries), [safeGalleries]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Gallery?",
      text: "This will remove all images in this gallery.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      dispatch(deleteGallery(id));
      Swal.fire("Deleted!", "Gallery deleted successfully.", "success");
    }
  };

  return (
    <div className="space-y-6 p-2 sm:p-6">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Admin Gallery
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Cinema Gallery</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Manage cinema gallery collections, review uploaded media, and keep each
              location’s gallery clean and organized for the admin team.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Cinemas
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Array.isArray(cinemas) ? cinemas.length : 0}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Gallery Sets
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{safeGalleries.length}</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Images
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalImages}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 md:grid-cols-[minmax(280px,420px)_auto] md:items-end">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter by Cinema
              </label>
              <select
                value={cinemaId}
                onChange={(e) => setCinemaId(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-black"
              >
                <option value="">Select Cinema</option>
                {Array.isArray(cinemas) &&
                  cinemas.map((cinema) => (
                    <option key={cinema._id} value={cinema._id}>
                      {cinema.name} , {cinema.city}
                    </option>
                  ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setCinemaId("")}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700"
            >
              Clear Filter
            </button>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm sm:w-auto"
          >
            Upload Gallery
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Active Context
          </p>
          <p className="mt-2 text-sm font-medium text-gray-900">
            {selectedCinema
              ? `${selectedCinema.name} , ${selectedCinema.city}`
              : "No cinema selected"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {selectedCinema
              ? "Only gallery sets for this cinema are shown below."
              : "Choose a cinema to review and manage its gallery collections."}
          </p>
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-500 shadow-sm">
          Loading gallery data...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {!cinemaId && !loading ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Select a cinema to begin</h2>
          <p className="mt-2 text-sm text-gray-500">
            Once you choose a cinema, this page will show its gallery sets, image count,
            and quick admin actions.
          </p>
        </div>
      ) : safeGalleries.length === 0 && !loading ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">No gallery sets found</h2>
          <p className="mt-2 text-sm text-gray-500">
            This cinema does not have gallery images yet. Upload a new gallery set to get started.
          </p>
          <button
            onClick={() => setOpenModal(true)}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Upload First Gallery
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {safeGalleries.map((gallery, galleryIndex) => {
            const safeImages = Array.isArray(gallery?.images) ? gallery.images : [];

            return (
              <section
                key={gallery?._id || `gallery-${galleryIndex}`}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-gray-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                      Gallery Set {galleryIndex + 1}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedCinema ? selectedCinema.name : "Cinema Gallery"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {safeImages.length} image{safeImages.length === 1 ? "" : "s"} in this set
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      Gallery ID: {gallery?._id?.slice(-6) || "N/A"}
                    </span>
                    <button
                      onClick={() => handleDelete(gallery._id)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Delete Set
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {safeImages.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {safeImages.map((img, index) => (
                        <div
                          key={`${gallery._id || "gallery"}-${index}`}
                          className="group overflow-hidden rounded-2xl border border-gray-200 bg-gray-50"
                        >
                          <div className="relative">
                            <img
                              src={getImageUrl(img)}
                              alt={`gallery-${index + 1}`}
                              className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />
                            <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
                              Image {index + 1}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="truncate text-sm text-gray-600">
                              {String(img).replace(/\\/g, "/").split("/").pop()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
                      No images are available in this gallery set.
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setOpenModal(false)}
              className="absolute right-5 top-5 rounded-full border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-black"
            >
              Close
            </button>

            <AddCinemaGallery
              selectedCinema={cinemaId}
              closeModal={() => setOpenModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaGallery;
