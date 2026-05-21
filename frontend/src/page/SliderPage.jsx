import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddSlider from "../components/AddSlider";
import { deleteSlider, getSlider } from "../features/Slider/sliderSlice";
import {
  AlertCircle,
  Image,
  ImagePlus,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

const uploadBaseUrl = "https://backend.cinesquare.in/uploads/";

const SliderPage = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const { sliders, loading, error } = useSelector((state) => state.slider);

  useEffect(() => {
    dispatch(getSlider());
  }, [dispatch]);

  const sliderStats = useMemo(
    () => [
      { label: "Total Slides", value: sliders?.length || 0 },
      { label: "Visible On Home", value: Math.min(sliders?.length || 0, 6) },
      { label: "Recommended Size", value: "1920x900" },
    ],
    [sliders?.length]
  );

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete slider?",
      text: "This image will be removed from the homepage slider.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete slider",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteSlider(id)).unwrap();
      Swal.fire({
        title: "Deleted",
        text: "Slider image removed successfully.",
        icon: "success",
        confirmButtonColor: "#111827",
      });
    } catch (err) {
      Swal.fire({
        title: "Delete failed",
        text: err || "Unable to delete this slider. Please try again.",
        icon: "error",
        confirmButtonColor: "#111827",
      });
    }
  };

  const handleRefresh = () => {
    dispatch(getSlider());
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">
                Homepage Slider
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Slider Management
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                Upload, review, and manage the hero slider images shown on the
                website homepage. Keep images sharp, compressed, and campaign-ready.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-yellow-300"
              >
                <Plus className="h-4 w-4" />
                Add Slider
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {sliderStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm text-gray-300">{item.label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:m-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Unable to load sliders</p>
              <p className="mt-1 text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-950">Uploaded Slides</h2>
              <p className="mt-1 text-sm text-gray-500">
                The first 6 slides are used in the homepage display order.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-2xl border border-gray-100 bg-gray-100"
                />
              ))}
            </div>
          ) : sliders?.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                <ImagePlus className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-lg font-semibold text-gray-950">No sliders found</p>
              <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
                Add your first homepage banner to start building the slider
                experience for visitors.
              </p>
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Add Slider
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sliders.map((slide, index) => (
                <article
                  key={slide._id}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                    <img
                      src={`${uploadBaseUrl}${slide.img}`}
                      alt={slide.text || `Homepage slider ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      #{index + 1}
                    </div>
                    {index < 6 && (
                      <div className="absolute bottom-3 left-3 rounded-full bg-yellow-400 px-3 py-1 text-xs font-semibold text-gray-950 shadow">
                        Homepage Visible
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(slide._id)}
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
                      title="Delete slider"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <Image className="h-4 w-4" />
                      Slider Caption
                    </div>
                    <p className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-6 text-gray-950">
                      {slide.text || "Untitled slider"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            className="absolute inset-0 bg-gray-950/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close modal"
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-yellow-600">
                  New Banner
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950">
                  Add Slider Image
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Upload a production-ready homepage banner with a clear caption.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6">
              <AddSlider closeModal={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}

      {loading && open && (
        <div className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 rounded-xl bg-gray-950 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          <Loader2 className="h-4 w-4 animate-spin" />
          Updating sliders...
        </div>
      )}
    </div>
  );
};

export default SliderPage;
