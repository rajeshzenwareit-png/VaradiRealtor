// src/pages/RealEstateFacilities.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

/* ---------------- Mock API (replace with your backend) ---------------- */
async function fetchFacilitiesAPI() {
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      id: "fac1",
      name: "Club House",
      type: "Amenity",
      category: "Common",
      icon: "🏛️",
      status: "published",
      is24x7: false,
      openTime: "09:00",
      closeTime: "21:00",
      contact: "",
      notes: "Booking via app",
    },
    {
      id: "fac2",
      name: "Gym",
      type: "Amenity",
      category: "Indoor",
      icon: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
      status: "pending",
      is24x7: true,
      openTime: "",
      closeTime: "",
      contact: "+91-9000000000",
      notes: "",
    },
    {
      id: "fac3",
      name: "Power Backup",
      type: "Utility",
      category: "Common",
      icon: "🔌",
      status: "drafting",
      is24x7: true,
      openTime: "",
      closeTime: "",
      contact: "",
      notes: "DG maintenance on Sundays",
    },
  ];
}
async function createFacilityAPI(payload) {
  await new Promise((r) => setTimeout(r, 300));
  return { id: String(Date.now()), ...payload };
}
async function updateFacilityAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 300));
  return { id, ...payload };
}
async function deleteFacilityAPI(id) {
  await new Promise((r) => setTimeout(r, 250));
  return { ok: true };
}

/* ------------------------------ Component ----------------------------- */
export default function RealEstateFacilities() {
  const TYPES = ["Amenity", "Service", "Utility"];
  const CATEGORIES = ["Indoor", "Outdoor", "Common", "Unit"];
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
    type: "Amenity",
    category: "Common",
    icon: "",
    status: "published",
    is24x7: false,
    openTime: "",
    closeTime: "",
    contact: "",
    notes: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      type: "Amenity",
      category: "Common",
      icon: "",
      status: "published",
      is24x7: false,
      openTime: "",
      closeTime: "",
      contact: "",
      notes: "",
    });

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFacilitiesAPI();
      setItems(data);
      setPage(1); // reset to first page on reload
    } catch (e) {
      setError("Failed to load facilities. Please try again.");
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
      type: row.type || "Amenity",
      category: row.category || "Common",
      icon: row.icon || "",
      status: row.status || "published",
      is24x7: !!row.is24x7,
      openTime: row.openTime || "",
      closeTime: row.closeTime || "",
      contact: row.contact || "",
      notes: row.notes || "",
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    if (!STATUS_OPTIONS.includes(form.status)) return setError("Invalid status.");
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const up = await updateFacilityAPI(editingId, form);
        setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...up } : x)));
      } else {
        const created = await createFacilityAPI(form);
        setItems((prev) => [created, ...prev]);
        setPage(1); // new item appears on first page
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(editingId ? "Failed to update facility." : "Failed to create facility.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this facility?")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deleteFacilityAPI(id);
      if (!res?.ok) throw new Error();
    } catch {
      setItems(prev); // rollback
      setError("Failed to delete facility.");
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
    return <span className="text-lg leading-none">{val}</span>; // emoji / text
  };

  const pretty = (s) => (s ? s.slice(0, 1).toUpperCase() + s.slice(1) : "—");

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

  /* ----------------------------- Pagination ---------------------------- */
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, total);

  const pagedItems = useMemo(
    () => items.slice(pageStart, pageEnd),
    [items, pageStart, pageEnd]
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

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Facilities</h1>
          <p className="text-sm text-gray-500">Manage facility details (name, type, status, hours, etc.).</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          {/* Page size selector */}
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
            title="Create Facility"
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
            <div className="py-12 text-center text-gray-500">Loading facilities…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No facilities yet.</p>
              <button
                onClick={openCreate}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
              >
                Create your first facility
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
                      <th className="px-3 py-2 whitespace-nowrap">Type</th>
                      <th className="px-3 py-2 whitespace-nowrap">Category</th>
                      <th className="px-3 py-2 whitespace-nowrap">24×7</th>
                      <th className="px-3 py-2 whitespace-nowrap">Open</th>
                      <th className="px-3 py-2 whitespace-nowrap">Close</th>
                      <th className="px-3 py-2 whitespace-nowrap">Status</th>
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
                          <td className="px-3 py-3 whitespace-nowrap">{row.type || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.category || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.is24x7 ? "Yes" : "No"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.openTime || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{row.closeTime || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">
                            <StatusBadge value={row.status} />
                          </td>
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
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Facility" : "Create Facility"}</h2>
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
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g., Club House"
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
                <span className="text-sm text-gray-600">Category</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
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
                  placeholder="🏛️  or  https://example.com/icon.png"
                />
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
                <span className="text-sm text-gray-600">24×7 Availability</span>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    id="is24x7"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={form.is24x7}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        is24x7: e.target.checked,
                        openTime: e.target.checked ? "" : form.openTime,
                        closeTime: e.target.checked ? "" : form.closeTime,
                      })
                    }
                  />
                  <label htmlFor="is24x7" className="text-sm text-gray-700">
                    Open all day
                  </label>
                </div>
              </label>

              {!form.is24x7 && (
                <>
                  <label className="block">
                    <span className="text-sm text-gray-600">Open Time</span>
                    <input
                      type="time"
                      className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.openTime}
                      onChange={(e) => setForm({ ...form, openTime: e.target.value })}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-600">Close Time</span>
                    <input
                      type="time"
                      className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      value={form.closeTime}
                      onChange={(e) => setForm({ ...form, closeTime: e.target.value })}
                    />
                  </label>
                </>
              )}

              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Contact</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  placeholder="+91-XXXXXXXXXX or email"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Notes</span>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Booking rules, instructions…"
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
                {saving ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Facility" : "Create Facility"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
