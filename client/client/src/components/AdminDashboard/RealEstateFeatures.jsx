// src/pages/RealEstateFeature.jsx
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

/* ---------------- Mock API (replace with your backend) ---------------- */
async function fetchFeaturesAPI() {
  await new Promise((r) => setTimeout(r, 400));
  return [
    { id: "f1", name: "Swimming Pool", icon: "🏊", status: "Active" },
    { id: "f2", name: "Gym", icon: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png", status: "Inactive" },
    { id: "f3", name: "Power Backup", icon: "🔌", status: "Active" },
  ];
}
async function createFeatureAPI(payload) {
  await new Promise((r) => setTimeout(r, 300));
  return { id: String(Date.now()), ...payload };
}
async function updateFeatureAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 300));
  return { id, ...payload };
}
async function deleteFeatureAPI(id) {
  await new Promise((r) => setTimeout(r, 250));
  return { ok: true };
}

/* ------------------------------ Component ----------------------------- */
export default function RealEstateFeatures() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const [form, setForm] = useState({ name: "", icon: "", status: "Active" });

  const resetForm = () => setForm({ name: "", icon: "", status: "Active" });

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchFeaturesAPI();
      setItems(data);
    } catch (e) {
      setError("Failed to load features. Please try again.");
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
      icon: row.icon || "",
      status: row.status || "Active",
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const up = await updateFeatureAPI(editingId, form);
        setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...up } : x)));
      } else {
        const created = await createFeatureAPI(form);
        setItems((prev) => [created, ...prev]);
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(editingId ? "Failed to update feature." : "Failed to create feature.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this feature?")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deleteFeatureAPI(id);
      if (!res?.ok) throw new Error();
    } catch {
      setItems(prev); // rollback
      setError("Failed to delete feature.");
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

  const StatusBadge = ({ value }) => {
    const isActive = (value || "").toLowerCase() === "active";
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${
          isActive
            ? "bg-emerald-100 text-emerald-700"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        {value || "—"}
      </span>
    );
  };

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Features</h1>
          <p className="text-sm text-gray-500">Manage feature Name, Icon, and Status.</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
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
            title="Create Feature"
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
            <div className="py-12 text-center text-gray-500">Loading features…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No features yet.</p>
              <button
                onClick={openCreate}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
              >
                Create your first feature
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2 whitespace-nowrap">Icon</th>
                    <th className="px-3 py-2 whitespace-nowrap">Name</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => {
                    const isDeleting = deletingIds.has(row.id);
                    return (
                      <tr key={row.id} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-3 py-3">
                          <div className="flex items-center">{renderIconCell(row.icon)}</div>
                        </td>
                        <td className="px-3 py-3 font-medium whitespace-nowrap">{row.name}</td>
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
          className={`absolute right-0 top-0 h-full w-full md:w-auto md:max-w-md lg:max-w-lg bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Feature" : "Create Feature"}</h2>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)] sm:h-[calc(100%-57px)]">
            <label className="block">
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
              <span className="text-sm text-gray-600">Icon (emoji or image URL)</span>
              <input
                type="text"
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
                placeholder="🏠  or  https://example.com/icon.png"
              />
              <p className="mt-1 text-xs text-gray-500">
                Tip: paste an emoji (e.g., 🏊) or an image URL (PNG/SVG/JPG).
              </p>
            </label>

            <label className="block">
              <span className="text-sm text-gray-600">Status</span>
              <select
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </label>

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
                {saving ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Feature" : "Create Feature"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
