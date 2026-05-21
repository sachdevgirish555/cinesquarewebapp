import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEnquiry, fetchEnquiries } from "../features/Enquiry/enquirySlice";
import { getEnquiryApi } from "../services/enquiryService";
import {
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
} from "lucide-react";
import * as FramerMotion from "framer-motion";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Motion = FramerMotion.motion;

const Enquiry = () => {
  const dispatch = useDispatch();
  const { enquiries, pagination, loading, error } = useSelector(
    (state) => state.enquiry
  );

  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);
  const [exportLoading, setExportLoading] = useState(false);
  const pageSizeOptions = [10, 25, 50, 100];

  useEffect(() => {
    dispatch(fetchEnquiries({ page, limit }));
  }, [dispatch, page, limit]);

  const categories = useMemo(() => {
    const uniqueCategories = enquiries
      .map((item) => item.category || "General")
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [enquiries]);

  const filteredData = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return enquiries.filter((item) => {
      const itemCategory = item.category || "General";
      const matchesCategory = category === "All" || itemCategory === category;
      const searchableText = [
        item.firstName,
        item.lastName,
        item.email,
        item.phone,
        item.category,
        item.message,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [category, enquiries, searchTerm]);

  const stats = useMemo(() => {
    const total = pagination?.totalEnquiries || enquiries.length;
    const uniqueCount = Math.max(categories.length - 1, 0);
    const currentPageCount = enquiries.length;

    return [
      { label: "Total Enquiries", value: total },
      { label: "On This Page", value: currentPageCount },
      { label: "Categories", value: uniqueCount },
    ];
  }, [categories.length, enquiries.length, pagination?.totalEnquiries]);

  const totalPages = pagination?.totalPages || 1;
  const totalEnquiries = pagination?.totalEnquiries || enquiries.length;
  const pageStart = totalEnquiries === 0 ? 0 : (page - 1) * limit + 1;
  const pageEnd = Math.min(page * limit, totalEnquiries);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getFullName = (item) => {
    const name = `${item.firstName || ""} ${item.lastName || ""}`.trim();
    return name || "Unknown User";
  };

  const buildCsvRow = (item) =>
    [
      `"${getFullName(item).replace(/"/g, '""')}"`,
      `"${item.email || ""}"`,
      `"${item.phone || ""}"`,
      `"${item.category || "General"}"`,
      `"${(item.message || "").replace(/"/g, '""')}"`,
      `"${formatDate(item.createdAt)}"`,
    ].join(",");

  const downloadRowsAsCsv = (rows, fileName) => {
    if (!rows || rows.length === 0) return;

    const headers = ["Name", "Email", "Phone", "Category", "Message", "Date"];
    const csvContent = [
      headers.join(","),
      ...rows.map(buildCsvRow),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCurrentCsv = () => {
    const currentRows = filteredData.length > 0 ? filteredData : enquiries;
    downloadRowsAsCsv(currentRows, `enquiries_page_${page}.csv`);
  };

  const downloadAllCsv = async () => {
    if (exportLoading || totalEnquiries === 0) return;

    setExportLoading(true);

    try {
      const chunkSize = 100;
      const firstResponse = await getEnquiryApi(1, chunkSize);
      const firstPageRows = firstResponse.data || firstResponse.enquiries || [];
      const total =
        firstResponse.total ||
        firstResponse.totalEnquiries ||
        firstResponse.pagination?.total ||
        firstPageRows.length;
      const totalPagesForExport =
        firstResponse.totalPages ||
        firstResponse.pagination?.totalPages ||
        Math.max(1, Math.ceil(total / chunkSize));

      let allRows = [...firstPageRows];

      if (totalPagesForExport > 1) {
        const remainingResponses = await Promise.all(
          Array.from({ length: totalPagesForExport - 1 }, (_, index) =>
            getEnquiryApi(index + 2, chunkSize),
          ),
        );

        allRows = [
          ...allRows,
          ...remainingResponses.flatMap(
            (response) => response.data || response.enquiries || [],
          ),
        ];
      }

      const uniqueRows = Array.from(
        new Map(allRows.map((item) => [item._id, item])).values(),
      );

      downloadRowsAsCsv(uniqueRows, "all-enquiries.csv");
    } catch (err) {
      toast.error(err?.message || err?.error || "Unable to export all enquiries.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete enquiry?",
      text: "This will permanently remove this enquiry from the admin panel.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete enquiry",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteEnquiry(id)).unwrap();
      Swal.fire({
        title: "Deleted",
        text: "The enquiry has been removed.",
        icon: "success",
        confirmButtonColor: "#111827",
      });
    } catch (err) {
      Swal.fire({
        title: "Delete failed",
        text: err || "Unable to delete this enquiry. Please try again.",
        icon: "error",
        confirmButtonColor: "#111827",
      });
    }
  };

  const handleRefresh = () => {
    dispatch(fetchEnquiries({ page, limit }));
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-yellow-300">
                Admin Enquiries
              </p>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Customer Enquiry Desk
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                Review incoming franchise, contact, advertising, and feedback
                requests from one clean workspace.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
              <button
                onClick={downloadCurrentCsv}
                disabled={filteredData.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-gray-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className="h-4 w-4" />
                Export Current
              </button>
              <button
                onClick={downloadAllCsv}
                disabled={exportLoading || totalEnquiries === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-yellow-300 bg-white/10 px-4 py-2.5 text-sm font-semibold text-yellow-100 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Download className={`h-4 w-4 ${exportLoading ? "animate-bounce" : ""}`} />
                {exportLoading ? "Downloading All..." : "Download All CSV"}
              </button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm text-gray-300">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-100 bg-white p-4 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_160px]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, phone, category, or message..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
              />
            </label>

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 outline-none transition focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-400/10"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="m-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 sm:m-6">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Unable to load enquiries</p>
              <p className="mt-1 text-red-600">{error}</p>
            </div>
          </div>
        )}

        <div className="min-h-[420px]">
          {loading ? (
            <div className="flex h-80 flex-col items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-950 animate-spin"></div>
              <p className="text-sm font-medium text-gray-500">Loading enquiries...</p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left text-sm text-gray-600">
                  <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Contact</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 font-semibold">Message</th>
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 text-right font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredData.map((item) => (
                      <tr
                        key={item._id}
                        className="transition-colors hover:bg-yellow-50/40"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 font-bold text-yellow-700">
                              {getFullName(item).charAt(0).toUpperCase() || (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-950">
                                {getFullName(item)}
                              </p>
                              <p className="text-xs text-gray-400">ID: {item._id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <a
                              href={`mailto:${item.email}`}
                              className="flex items-center gap-2 text-gray-700 transition hover:text-yellow-700"
                            >
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span>{item.email || "-"}</span>
                            </a>
                            <a
                              href={item.phone ? `tel:${item.phone}` : undefined}
                              className="flex items-center gap-2 text-xs text-gray-500 transition hover:text-yellow-700"
                            >
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span>{item.phone || "-"}</span>
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                            {item.category || "General"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p
                            className="max-w-sm line-clamp-2 leading-6 text-gray-600"
                            title={item.message}
                          >
                            {item.message || "-"}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 whitespace-nowrap text-gray-500">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDate(item.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="inline-flex items-center justify-center rounded-xl border border-red-100 bg-red-50 p-2 text-red-600 transition hover:border-red-200 hover:bg-red-100"
                            title="Delete enquiry"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 p-4 lg:hidden">
                {filteredData.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-yellow-100 font-bold text-yellow-700">
                          {getFullName(item).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-950">
                            {getFullName(item)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(item.createdAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="rounded-xl border border-red-100 bg-red-50 p-2 text-red-600"
                        title="Delete enquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {item.email || "-"}
                      </p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {item.phone || "-"}
                      </p>
                    </div>

                    <span className="mt-4 inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.category || "General"}
                    </span>

                    <p className="mt-4 rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-600">
                      {item.message || "No message provided."}
                    </p>
                  </div>
                ))}
              </div>

              {filteredData.length === 0 && (
                <div className="flex h-80 flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                    <Inbox className="h-8 w-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-semibold text-gray-950">
                    No enquiries found
                  </p>
                  <p className="mt-1 max-w-md text-sm leading-6 text-gray-500">
                    Try changing your search or category filter, or refresh the
                    list to check for new enquiries.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {!loading && (
          <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-950">
                {pageStart}-{pageEnd}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-950">{totalEnquiries}</span>{" "}
              enquiries. Page{" "}
              <span className="font-semibold text-gray-950">{page}</span> of{" "}
              <span className="font-semibold text-gray-950">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Motion.div>
  );
};

export default Enquiry;
