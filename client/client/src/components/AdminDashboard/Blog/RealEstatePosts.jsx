// src/pages/RealEstatePosts.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  FiPlus,
  FiRefreshCw,
  FiX,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

/* ----------------------------- Mock APIs ----------------------------- */
async function fetchPostsAPI() {
  await new Promise((r) => setTimeout(r, 600));
  return Array.from({ length: 23 }).map((_, i) => ({
    id: `post${i + 1}`,
    title: `Post ${i + 1}`,
    author: i % 2 ? "Admin" : "Editor",
    status: ["draft", "published"][i % 2],
    publishDate: `2025-10-${(i % 28) + 1}`,
    content: "<p>This is demo post content.</p>",
    featuredImage: "",
  }));
}

async function createPostAPI(payload) {
  await new Promise((r) => setTimeout(r, 500));
  return { id: String(Date.now()), ...payload };
}

async function updatePostAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 500));
  return { id, ...payload };
}

async function deletePostAPI(id) {
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}

/* ----------------------------- Component ----------------------------- */
export default function RealEstatePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Form data
  const [form, setForm] = useState({
    title: "",
    author: "",
    status: "draft",
    publishDate: "",
    content: "",
    featuredImage: "",
  });
  const [preview, setPreview] = useState(null);

  const resetForm = () =>
    setForm({
      title: "",
      author: "",
      status: "draft",
      publishDate: "",
      content: "",
      featuredImage: "",
    });

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPostsAPI();
      setPosts(data);
      setPage(1);
    } catch {
      setError("Failed to load posts. Try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  /* ----------------------------- CRUD handlers ----------------------------- */
  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setPreview(null);
    setDrawerOpen(true);
  };

  const openEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      author: post.author,
      status: post.status,
      publishDate: post.publishDate,
      content: post.content,
      featuredImage: post.featuredImage,
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return setError("Title is required.");
    setCreating(true);
    setError("");
    try {
      if (editingId) {
        const updated = await updatePostAPI(editingId, form);
        setPosts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p))
        );
      } else {
        const created = await createPostAPI(form);
        setPosts((prev) => [created, ...prev]);
      }
      setDrawerOpen(false);
      resetForm();
      setEditingId(null);
    } catch {
      setError("Failed to save post.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post? This action cannot be undone.")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = posts;
    setPosts((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deletePostAPI(id);
      if (!res.ok) throw new Error();
    } catch {
      setPosts(prev); // rollback
      setError("Failed to delete post.");
    } finally {
      setDeletingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  /* ----------------------------- Pagination ----------------------------- */
  const total = posts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageStart = (page - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, total);
  const pagedPosts = useMemo(
    () => posts.slice(pageStart, pageEnd),
    [posts, pageStart, pageEnd]
  );

  const getPageNumbers = (current, totalP, max = 5) => {
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalP, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const pageNumbers = useMemo(
    () => getPageNumbers(page, totalPages, 5),
    [page, totalPages]
  );

  /* ----------------------------- Render ----------------------------- */
  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Posts</h1>
          <p className="text-sm text-gray-500">
            Manage your blog posts and create new ones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPosts}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span>Reload</span>
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 py-2 text-white hover:bg-sky-700"
          >
            <FiPlus />
            <span>Create</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-4">
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading posts…</div>
          ) : posts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No posts yet.</p>
              <button
                onClick={openCreate}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                  <thead className="text-gray-500">
                    <tr>
                      <th className="px-3 py-2 text-left">Title</th>
                      <th className="px-3 py-2 text-left">Author</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Publish Date</th>
                      <th className="px-3 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedPosts.map((p) => {
                      const isDeleting = deletingIds.has(p.id);
                      return (
                        <tr key={p.id} className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-3 py-3 font-medium">{p.title}</td>
                          <td className="px-3 py-3">{p.author}</td>
                          <td className="px-3 py-3 capitalize">{p.status}</td>
                          <td className="px-3 py-3">{p.publishDate || "—"}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEdit(p)}
                                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100"
                              >
                                <FiEdit2 /> Edit
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
                              >
                                <FiTrash2 />{" "}
                                {isDeleting ? "Deleting…" : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <div>
                  Showing {pageStart + 1}–{pageEnd} of {total}
                </div>
                <div className="flex gap-2">
                  {pageNumbers.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-3 py-1 rounded-lg border ${
                        n === page
                          ? "bg-sky-600 text-white border-sky-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drawer form */}
      <div
        className={`fixed inset-0 z-50 ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full md:max-w-lg bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="font-semibold">
              {editingId ? "Edit Post" : "Create Post"}
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <FiX />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]"
          >
            <label className="block">
              <span className="text-sm text-gray-600">Title *</span>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
                required
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-sky-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Author</span>
              <input
                type="text"
                value={form.author}
                onChange={(e) =>
                  setForm({ ...form, author: e.target.value })
                }
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-sky-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Status</span>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-sky-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Publish Date</span>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) =>
                  setForm({ ...form, publishDate: e.target.value })
                }
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-sky-500"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Featured Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                    setForm({ ...form, featuredImage: file.name });
                  }
                }}
                className="mt-1 w-full rounded-lg border px-3 py-2"
              />
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-3 w-32 h-32 object-cover rounded-lg border"
                />
              )}
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Content</span>
              <Editor
                apiKey="h1g9qklccrs0qshe7ak35inaw08dj5i542fbp0auof90xabw"
                value={form.content}
                onEditorChange={(content) =>
                  setForm({ ...form, content })
                }
                init={{
                  height: 300,
                  menubar: false,
                  plugins: [
                    "link", "lists", "image", "media", "table", "codesample",
                  ],
                  toolbar:
                    "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image",
                }}
              />
            </label>

            <div className="flex justify-end gap-2 border-t pt-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="rounded-lg border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {creating
                  ? editingId
                    ? "Updating…"
                    : "Creating…"
                  : editingId
                  ? "Update Post"
                  : "Create Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

