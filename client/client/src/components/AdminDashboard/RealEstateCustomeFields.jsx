// src/pages/RealEstateCustomeFields.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

/* ---------------- Mock APIs (replace with your backend) ---------------- */
// Categories for linking (you can reuse your real categories endpoint)
async function fetchCategoriesAPI() {
  await new Promise((r) => setTimeout(r, 250));
  return [
    { id: "c1", name: "Apartments" },
    { id: "c2", name: "Villas" },
    { id: "c3", name: "Office Space" },
    { id: "c4", name: "Plots" },
  ];
}

// Custom fields CRUD
async function fetchCustomFieldsAPI() {
  await new Promise((r) => setTimeout(r, 350));
  return [
    {
      id: "cf1",
      name: "Car Parking",
      key: "car_parking",
      type: "select",
      options: ["Yes", "No", "Basement"],
      categoryIds: ["c1", "c2"],
      required: false,
      helpText: "Choose parking availability",
      sortOrder: 1,
      status: "published",
    },
    {
      id: "cf2",
      name: "RERA Number",
      key: "rera_number",
      type: "text",
      options: [],
      categoryIds: [],
      required: false,
      helpText: "",
      sortOrder: 2,
      status: "pending",
    },
    {
      id: "cf3",
      name: "Facing",
      key: "facing",
      type: "radio",
      options: ["East", "West", "North", "South"],
      categoryIds: ["c1", "c2", "c4"],
      required: false,
      helpText: "",
      sortOrder: 3,
      status: "drafting",
    },
  ];
}
async function createCustomFieldAPI(payload) {
  await new Promise((r) => setTimeout(r, 280));
  return { id: String(Date.now()), ...payload };
}
async function updateCustomFieldAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 280));
  return { id, ...payload };
}
async function deleteCustomFieldAPI(id) {
  await new Promise((r) => setTimeout(r, 220));
  return { ok: true };
}

/* ------------------------------ Utils -------------------------------- */
const slugify = (s) =>
  (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const pretty = (s) => (s ? s.slice(0, 1).toUpperCase() + s.slice(1).toLowerCase() : "—");

/* ------------------------------ Component ----------------------------- */
export default function RealEstateCustomeFields() {
  const INPUT_TYPES = ["text","number","textarea","date","select","multiselect","checkbox","radio"];
  const STATUS_OPTIONS = ["published", "drafting", "pending"];

  const [categories, setCategories] = useState([]);
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

  // form state
  const [form, setForm] = useState({
    name: "",
    key: "",
    type: "text",
    optionsRaw: "",
    categoryIds: [],
    required: false,
    helpText: "",
    sortOrder: "",
    status: "published",
  });

  const resetForm = () =>
    setForm({
      name: "",
      key: "",
      type: "text",
      optionsRaw: "",
      categoryIds: [],
      required: false,
      helpText: "",
      sortOrder: "",
      status: "published",
    });

  /* ------------------------ Loaders ------------------------ */
  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [cats, fields] = await Promise.all([fetchCategoriesAPI(), fetchCustomFieldsAPI()]);
      setCategories(cats);
      setItems(fields);
      setPage(1); // reset to first page
    } catch {
      setError("Failed to load custom fields or categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  /* ------------------------ Handlers ------------------------ */
  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setDrawerOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      name: row.name || "",
      key: row.key || "",
      type: row.type || "text",
      optionsRaw: (row.options || []).join(", "),
      categoryIds: row.categoryIds || [],
      required: !!row.required,
      helpText: row.helpText || "",
      sortOrder: row.sortOrder ?? "",
      status: row.status || "published",
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError("Name is required.");

    const fieldKey = (form.key || slugify(name)).trim();
    if (!fieldKey) return setError("Key could not be generated — please enter a key.");

    if (!STATUS_OPTIONS.includes(form.status)) return setError("Invalid status.");

    // options only for select/multiselect/radio
    const needsOptions = ["select", "multiselect", "radio"].includes(form.type);
    const options = needsOptions
      ? form.optionsRaw.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (needsOptions && options.length === 0) {
      return setError("Please provide at least one option (comma separated).");
    }

    const payload = {
      name,
      key: fieldKey,
      type: form.type,
      options,
      categoryIds: form.categoryIds,
      required: !!form.required,
      helpText: form.helpText.trim(),
      sortOrder: form.sortOrder === "" || form.sortOrder == null ? 0 : Math.max(0, Number(form.sortOrder)),
      status: form.status,
    };

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const up = await updateCustomFieldAPI(editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...up } : x)));
      } else {
        const created = await createCustomFieldAPI(payload);
        setItems((prev) => [created, ...prev]);
        setPage(1); // show new item
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch {
      setError(editingId ? "Failed to update custom field." : "Failed to create custom field.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this custom field?")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deleteCustomFieldAPI(id);
      if (!res?.ok) throw new Error();
    } catch {
      setItems(prev); // rollback
      setError("Failed to delete custom field.");
    } finally {
      setDeletingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  /* ------------------------ Pagination helpers ------------------------ */
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

  /* ------------------------ UI ------------------------ */
  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Custom Fields</h1>
          <p className="text-sm text-gray-500">Define property-specific fields and attach them to categories.</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          {/* Rows selector */}
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
            onClick={loadAll}
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
            title="Create Field"
          >
            <FiPlus />
            <span className="hidden xs:inline">Create</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-3 sm:p-4">
          {error && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading custom fields…</div>
          ) : total === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No custom fields yet.</p>
              <button onClick={openCreate} className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                Create your first field
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                  <thead className="bg-white sticky top-0 z-10">
                    <tr className="text-left text-gray-500">
                      <th className="px-3 py-2 whitespace-nowrap">Name</th>
                      <th className="px-3 py-2 whitespace-nowrap">Key</th>
                      <th className="px-3 py-2 whitespace-nowrap">Type</th>
                      <th className="px-3 py-2 whitespace-nowrap">Categories</th>
                      <th className="px-3 py-2 whitespace-nowrap">Required</th>
                      <th className="px-3 py-2 whitespace-nowrap">Status</th>
                      <th className="px-3 py-2 whitespace-nowrap">Order</th>
                      <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedItems.map((row) => {
                      const isDeleting = deletingIds.has(row.id);
                      const cats = row.categoryIds?.length
                        ? row.categoryIds.map((id) => categories.find((c) => c.id === id)?.name || id).join(", ")
                        : "All";
                      return (
                        <tr key={row.id} className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-3 py-3 font-medium whitespace-nowrap">{row.name}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.key}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.type}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{cats}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.required ? "Yes" : "No"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
                                (row.status || "").toLowerCase() === "published"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : (row.status || "").toLowerCase() === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {pretty(row.status)}
                            </span>
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
          className={`absolute right-0 top-0 h-full w-full md:w-auto md:max-w-2xl bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Custom Field" : "Create Custom Field"}</h2>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Name */}
              <label className="block">
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
                      key: f.key ? f.key : slugify(name),
                    }));
                  }}
                  required
                  placeholder="e.g., Car Parking"
                />
              </label>

              {/* Key */}
              <label className="block">
                <span className="text-sm text-gray-600">Key / Slug</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: slugify(e.target.value) })}
                  placeholder="auto if left empty"
                />
              </label>

              {/* Type */}
              <label className="block">
                <span className="text-sm text-gray-600">Input Type</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {INPUT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              {/* Status */}
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

              {/* Categories (multi-select) */}
              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Applies To Categories</span>
                <select
                  multiple
                  className="mt-1 w-full min-h-28 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.categoryIds}
                  onChange={(e) => {
                    const vals = Array.from(e.target.selectedOptions).map((o) => o.value);
                    setForm({ ...form, categoryIds: vals });
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Hold <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> to select multiple. Leave empty for “All”.
                </p>
              </label>

              {/* Options (only when needed) */}
              {["select", "multiselect", "radio"].includes(form.type) && (
                <label className="block sm:col-span-2">
                  <span className="text-sm text-gray-600">
                    Options (comma separated) {form.type === "multiselect" ? "(multiple selectable)" : ""}
                  </span>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={form.optionsRaw}
                    onChange={(e) => setForm({ ...form, optionsRaw: e.target.value })}
                    placeholder="e.g., Yes, No, Basement"
                  />
                </label>
              )}

              {/* Required */}
              <label className="block">
                <span className="text-sm text-gray-600">Required</span>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    id="required"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={form.required}
                    onChange={(e) => setForm({ ...form, required: e.target.checked })}
                  />
                  <label htmlFor="required" className="text-sm text-gray-700">
                    This field is required while creating a property
                  </label>
                </div>
              </label>

              {/* Sort Order */}
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

              {/* Help Text */}
              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Help Text</span>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.helpText}
                  onChange={(e) => setForm({ ...form, helpText: e.target.value })}
                  placeholder="Shown as a hint under the input."
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
                {saving ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Field" : "Create Field"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
