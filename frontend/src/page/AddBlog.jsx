import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import CreateBlog from "../components/CreateBlog";
import { deleteBlog, getBlogs } from "../features/Blog/blogSlice";

const ITEMS_PER_PAGE = 9;

const getBlogImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  return `https://backend.cinesquare.in/uploads/${image.replace(/^\/+/, "")}`;
};

const DashboardBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, loading, deleteLoading, error } = useSelector((state) => state.blogs);

  const [openModal, setOpenModal] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [deleteBlogData, setDeleteBlogData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  const totalPages = Math.max(1, Math.ceil(blogs.length / ITEMS_PER_PAGE));
  const paginatedBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return blogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [blogs, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const closeModal = () => {
    setOpenModal(false);
    setEditBlog(null);
  };

  const handleDelete = async () => {
    if (!deleteBlogData?._id) {
      return;
    }

    await dispatch(deleteBlog(deleteBlogData._id));
    setDeleteBlogData(null);
  };

  const totalCategories = useMemo(
    () => new Set(blogs.map((blog) => blog.category).filter(Boolean)).size,
    [blogs],
  );

  const startItem = blogs.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, blogs.length);

  return (
    <div className="space-y-6 rounded-xl bg-white p-4 shadow sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blogs</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage blog posts, categories, and featured images from one admin page.
          </p>
        </div>

        <button
          onClick={() => {
            setEditBlog(null);
            setOpenModal(true);
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-black sm:w-auto"
        >
          <Plus size={18} /> Add Blog
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Total Blogs
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{blogs.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Categories
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalCategories}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            This Page
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{paginatedBlogs.length}</p>
        </div>
      </div>

      {error && !openModal && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 px-6 py-12 text-center text-gray-500">
          Loading blogs...
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">
          <h3 className="text-xl font-semibold text-gray-900">No blogs created yet</h3>
          <p className="mt-2 text-sm text-gray-500">
            Start by adding your first blog post for the website.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {paginatedBlogs.map((blog) => (
              <div
                key={blog._id}
                className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={getBlogImageUrl(blog.image)}
                    alt={blog.title}
                    className="h-48 w-full object-cover"
                  />

                  <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => {
                        setEditBlog(blog);
                        setOpenModal(true);
                      }}
                      className="rounded-full bg-white p-2 text-gray-700 shadow hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => setDeleteBlogData(blog)}
                      className="rounded-full bg-white p-2 text-red-600 shadow hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {blog.category || "Uncategorized"}
                  </span>

                  <h3 className="line-clamp-2 text-lg font-bold text-gray-900">
                    {blog.title}
                  </h3>

                  <p className="line-clamp-3 text-sm text-gray-600">{blog.excerpt}</p>

                  <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
                    <span>
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : "No date"}
                    </span>
                    <span>ID: {blog._id?.slice(-6) || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
            <p>
              Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
              <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
              <span className="font-semibold text-gray-900">{blogs.length}</span> blogs
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
        </>
      )}

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b bg-gray-50 px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900">
                {editBlog ? "Edit Blog" : "Add New Blog"}
              </h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-black">
                <X size={22} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-76px)] overflow-y-auto p-6">
              <CreateBlog blogData={editBlog} onClose={closeModal} />
            </div>
          </div>
        </div>
      )}

      {deleteBlogData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-2 text-lg font-bold text-gray-900">Delete Blog?</h3>
            <p className="mb-4 text-sm text-gray-600">
              Are you sure you want to delete
              <span className="font-semibold"> {deleteBlogData.title}</span>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteBlogData(null)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
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

export default DashboardBlogs;
