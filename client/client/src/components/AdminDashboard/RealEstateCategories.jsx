// src/pages/RealEstateCategories.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

/* ---------------------- LocalStorage persistence ---------------------- */
const LS_KEY = "re_categories_v1";
const SEED = [
  { id: "c1", name: "Apartments", slug: "apartments", type: "Residential", parentId: "", status: "published", icon: "🏢", description: "Flats & apartments", sortOrder: 1 },
  { id: "c2", name: "Villas", slug: "villas", type: "Residential", parentId: "", status: "published", icon: "🏡", description: "", sortOrder: 2 },
  { id: "c3", name: "Office Space", slug: "office-space", type: "Commercial", parentId: "", status: "pending", icon: "🏬", description: "", sortOrder: 3 },
  { id: "c4", name: "Plots", slug: "plots", type: "Land", parentId: "", status: "drafting", icon: "📐", description: "", sortOrder: 4 },
];
function readStore(defaultData = SEED) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(LS_KEY, JSON.stringify(defaultData));
  return defaultData;
}
function writeStore(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

/* ---------------- Mock API (now backed by localStorage) --------------- */
async function fetchCategoriesAPI() {
  await new Promise((r) => setTimeout(r, 150));
  return readStore();
}
async function createCategoryAPI(payload) {
  await new Promise((r) => setTimeout(r, 120));
  const next = [{ id: String(Date.now()), ...payload }, ...readStore()];
  writeStore(next);
  return next[0];
}
async function updateCategoryAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 120));
  const cur = readStore();
  const up = { id, ...payload };
  const next = cur.map((x) => (x.id === id ? { ...x, ...up } : x));
  writeStore(next);
  return up;
}
async function deleteCategoryAPI(id) {
  await new Promise((r) => setTimeout(r, 100));
  const cur = readStore();
  writeStore(cur.filter((x) => x.id !== id));
  return { ok: true };
}

/* ------------------------------ Utils -------------------------------- */
const slugify = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pretty = (s) => (s ? s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase() : "—");

/* ------------------------------ Component ----------------------------- */
export default function RealEstateCategories() {
  const TYPES = ["Residential", "Commercial", "Land", "Industrial", "Mixed Use"];
  const STATUS_OPTIONS = ["published", "drafting", "pending"];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Pagination
  const [page, setPage] = useState(1);          // 1-based
  const [pageSize, setPageSize] = useState(10); // 5,10,20,50

  const [form, setForm] = useState({
    name: "",
    slug: "",
    type: "Residential",
    parentId: "",
    status: "published",
    icon: "",
    description: "",
    sortOrder: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      slug: "",
      type: "Residential",
      parentId: "",
      status: "published",
      icon: "",
      description: "",
      sortOrder: "",
    });

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCategoriesAPI();
      setItems(data);
      setPage(1); // reset to first page after reload
    } catch (e) {
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name || "",
      slug: row.slug || "",
      type: row.type || "Residential",
      parentId: row.parentId || "",
      status: row.status || "published",
      icon: row.icon || "",
      description: row.description || "",
      sortOrder: row.sortOrder ?? "",
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = form.name.trim();
    if (!trimmedName) return setError("Name is required.");

    const finalSlug = (form.slug || slugify(trimmedName)).trim();
    if (!finalSlug) return setError("Slug could not be generated — please enter a slug.");

    if (editingId && form.parentId === editingId) {
      return setError("A category cannot be its own parent.");
    }

    const payload = {
      ...form,
      name: trimmedName,
      slug: finalSlug,
      sortOrder:
        form.sortOrder === "" || form.sortOrder == null
          ? 0
          : Math.max(0, Number(form.sortOrder)),
    };

    if (!STATUS_OPTIONS.includes(payload.status)) {
      return setError("Invalid status.");
    }

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const up = await updateCategoryAPI(editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...up } : x)));
      } else {
        const created = await createCategoryAPI(payload);
        setItems((prev) => [created, ...prev]);
        setPage(1); // show new item on first page
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(editingId ? "Failed to update category." : "Failed to create category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deleteCategoryAPI(id);
      if (!res?.ok) throw new Error();
    } catch {
      setItems(prev); // rollback
      setError("Failed to delete category.");
    } finally {
      setDeletingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  const renderIconCell = (val) => {
    if (!val) return "—";
    const isUrl = /^https?:\/\//i.test(val);
    if (isUrl) {
      return (
        <img
          src={val}
          alt="icon"
          className="h-6 w-6 rounded object-contain bg-white border"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      );
    }
    return <span className="text-lg leading-none">{val}</span>;
  };

  const StatusBadge = ({ value }) => {
    const v = (value || "").toLowerCase();
    const cls =
      v === "published"
        ? "bg-emerald-100 text-emerald-700"
        : v === "pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-slate-200 text-slate-700"; // drafting
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${cls}`}>
        {pretty(v)}
      </span>
    );
  };

  // Parent options should not include the currently edited category
  const parentOptions = useMemo(
    () => items.filter((c) => c.id !== editingId),
    [items, editingId]
  );
  const parentName = (id) => items.find((x) => x.id === id)?.name || "—";

  /* ----------------------------- Pagination ---------------------------- */
  const sortedItems = useMemo(
    () => items.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [items]
  );

  const total = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, total);

  const pagedItems = useMemo(
    () => sortedItems.slice(pageStart, pageEnd),
    [sortedItems, pageStart, pageEnd]
  );

  function getPageNumbers(current, totalP, max = 5) {
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalP, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  const pageNumbers = useMemo(() => getPageNumbers(page, totalPages, 5), [page, totalPages]);

  const PageButton = ({ children, onClick, disabled, active, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`h-9 min-w-9 px-3 rounded-lg border text-sm
        ${active ? "bg-sky-600 text-white border-sky-600" : "hover:bg-gray-50"}
        disabled:opacity-50`}
    >
      {children}
    </button>
  );

  /* ------------------------------- UI --------------------------------- */
  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Property Categories</h1>
          <p className="text-sm text-gray-500">Define and organize your real estate categories.</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          {/* Rows per page */}
          <label className="hidden sm:flex items-center gap-2 text-sm text-gray-500 mr-2">
            <span>Rows:</span>
            <select
              className="rounded-lg border px-2 py-1.5"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>

          <button
            onClick={loadItems}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border px-3 sm:px-4 py-2 hover:bg-gray-50 active:scale-[.98] disabled:opacity-60"
            title="Reload"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span className="hidden xs:inline">Reload</span>
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-3 sm:px-4 py-2 text-white hover:bg-sky-700 active:scale-[.98]"
            title="Create Category"
          >
            <FiPlus />
            <span className="hidden xs:inline">Create</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-3 sm:p-4">
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading categories…</div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No categories yet.</p>
              <button
                onClick={openCreate}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
              >
                Create your first category
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                  <thead className="bg-white sticky top-0 z-10">
                    <tr className="text-left text-gray-500">
                      <th className="px-3 py-2 whitespace-nowrap">Icon</th>
                      <th className="px-3 py-2 whitespace-nowrap">Name</th>
                      <th className="px-3 py-2 whitespace-nowrap">Slug</th>
                      <th className="px-3 py-2 whitespace-nowrap">Type</th>
                      <th className="px-3 py-2 whitespace-nowrap">Parent</th>
                      <th className="px-3 py-2 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2 whitespace-nowrap">Order</th>
                      <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedItems.map((row) => {
                      const isDeleting = deletingIds.has(row.id);
                      return (
                        <tr key={row.id} className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-3 py-3">
                            <div className="flex items-center">{renderIconCell(row.icon)}</div>
                          </td>
                          <td className="px-3 py-3 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.slug || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.type || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.parentId ? parentName(row.parentId) : "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <StatusBadge value={row.status} />
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.sortOrder ?? 0}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEdit(row)}
                                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100"
                                title="Edit"
                              >
                                <FiEdit2 /> <span className="hidden sm:inline">Edit</span>
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                disabled={isDeleting}
                                className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
                                title="Delete"
                              >
                                <FiTrash2 />{" "}
                                <span className="hidden sm:inline">{isDeleting ? "Deleting…" : "Delete"}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{total === 0 ? 0 : pageStart + 1}</span>–
                  <span className="font-medium">{pageEnd}</span> of <span className="font-medium">{total}</span>
                </div>

                <div className="flex items-center gap-2">
                  <PageButton title="First page" onClick={() => setPage(1)} disabled={page === 1}>«</PageButton>
                  <PageButton title="Previous page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</PageButton>

                  {pageNumbers[0] > 1 && <span className="px-1 text-gray-500">…</span>}

                  {pageNumbers.map((n) => (
                    <PageButton key={n} title={`Page ${n}`} onClick={() => setPage(n)} active={n === page}>
                      {n}
                    </PageButton>
                  ))}

                  {pageNumbers[pageNumbers.length - 1] < totalPages && <span className="px-1 text-gray-500">…</span>}

                  <PageButton title="Next page" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</PageButton>
                  <PageButton title="Last page" onClick={() => setPage(totalPages)} disabled={page === totalPages}>»</PageButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Drawer */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        {/* Backdrop */}
        <button
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close form backdrop"
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full md:w-auto md:max-w-xl lg:max-w-2xl bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Category" : "Create Category"}</h2>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)] sm:h-[calc(100%-57px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Name *</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: f.slug ? f.slug : slugify(name),
                    }));
                  }}
                  required
                  placeholder="e.g., Apartments"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Slug</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="auto if left empty"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Type</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Parent Category</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.parentId}
                  onChange={(e) => setForm({ ...form, parentId: e.target.value })}
                >
                  <option value="">— None —</option>
                  {parentOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">Optional: create nested categories.</p>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Status</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {pretty(s)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Icon (emoji or image URL)</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="🏢  or  https://example.com/icon.png"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Sort Order</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                  placeholder="0"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Description</span>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief description, SEO text, etc."
                />
              </label>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-2 border-t">
              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="rounded-xl border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {saving ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Category" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
