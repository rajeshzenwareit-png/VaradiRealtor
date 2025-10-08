// src/pages/RealEstateInvestors.jsx
import React, { useCallback, useEffect, useState } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

/* ---------------- Mock API (replace with your backend) ---------------- */
async function fetchInvestorsAPI() {
  await new Promise((r) => setTimeout(r, 400));
  return [
    {
      id: "i1",
      name: "Anil Kumar",
      type: "Individual",
      company: "",
      email: "anil@example.com",
      phone: "+91-9876543210",
      stage: "Committed",
      amount: 7500000,
      notes: "Prefers residential projects",
      joinedDate: "2025-07-01",
    },
    {
      id: "i2",
      name: "Cavree Capital",
      type: "Institution",
      company: "Cavree Capital",
      email: "funds@cavree.com",
      phone: "+1-650-555-0100",
      stage: "Contacted",
      amount: 0,
      notes: "Requested deck",
      joinedDate: "",
    },
    {
      id: "i3",
      name: "Priya Desai",
      type: "Individual",
      company: "",
      email: "",
      phone: "",
      stage: "Lead",
      amount: 2500000,
      notes: "",
      joinedDate: "2025-09-20",
    },
  ];
}
async function createInvestorAPI(payload) {
  await new Promise((r) => setTimeout(r, 300));
  return { id: String(Date.now()), ...payload };
}
async function updateInvestorAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 300));
  return { id, ...payload };
}
async function deleteInvestorAPI(id) {
  await new Promise((r) => setTimeout(r, 250));
  return { ok: true };
}

/* ------------------------------ Component ----------------------------- */
export default function RealEstateInvestors() {
  const TYPES = ["Individual", "Institution"];
  const STAGES = ["Lead", "Contacted", "Committed", "Inactive"];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  const [form, setForm] = useState({
    name: "",
    type: "Individual",
    company: "",
    email: "",
    phone: "",
    stage: "Lead",
    amount: "",
    notes: "",
    joinedDate: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      type: "Individual",
      company: "",
      email: "",
      phone: "",
      stage: "Lead",
      amount: "",
      notes: "",
      joinedDate: "",
    });

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchInvestorsAPI();
      setItems(data);
    } catch (e) {
      setError("Failed to load investors. Please try again.");
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
      type: row.type || "Individual",
      company: row.company || "",
      email: row.email || "",
      phone: row.phone || "",
      stage: row.stage || "Lead",
      amount: row.amount ?? "",
      notes: row.notes || "",
      joinedDate: row.joinedDate || "",
    });
    setDrawerOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Name is required.");

    // sanitize
    const payload = {
      ...form,
      amount:
        form.amount === "" || form.amount == null ? 0 : Math.max(0, Number(form.amount)),
    };

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        const up = await updateInvestorAPI(editingId, payload);
        setItems((prev) => prev.map((x) => (x.id === editingId ? { ...x, ...up } : x)));
      } else {
        const created = await createInvestorAPI(payload);
        setItems((prev) => [created, ...prev]);
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(editingId ? "Failed to update investor." : "Failed to create investor.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this investor?")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deleteInvestorAPI(id);
      if (!res?.ok) throw new Error();
    } catch {
      setItems(prev); // rollback
      setError("Failed to delete investor.");
    } finally {
      setDeletingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  const StageBadge = ({ value }) => {
    const v = (value || "").toLowerCase();
    const cls =
      v === "committed"
        ? "bg-emerald-100 text-emerald-700"
        : v === "contacted"
        ? "bg-blue-100 text-blue-700"
        : v === "inactive"
        ? "bg-slate-200 text-slate-700"
        : "bg-amber-100 text-amber-700"; // lead
    const pretty = (s) => (s ? s.slice(0, 1).toUpperCase() + s.slice(1) : "—");
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${cls}`}>
        {pretty(v)}
      </span>
    );
  };

  const money = (n) =>
    n && !isNaN(n) && Number(n) > 0 ? `₹${Number(n).toLocaleString("en-IN")}` : "—";

  return (
    <div className="h-full w-full">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Investors</h1>
          <p className="text-sm text-gray-500">Manage investor details and pipeline stage.</p>
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
            title="Create Investor"
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
            <div className="py-12 text-center text-gray-500">Loading investors…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No investors yet.</p>
              <button
                onClick={openCreate}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700"
              >
                Create your first investor
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2 whitespace-nowrap">Name</th>
                    <th className="px-3 py-2 whitespace-nowrap">Type</th>
                    <th className="px-3 py-2 whitespace-nowrap">Company</th>
                    <th className="px-3 py-2 whitespace-nowrap">Email</th>
                    <th className="px-3 py-2 whitespace-nowrap">Phone</th>
                    <th className="px-3 py-2 whitespace-nowrap">Stage</th>
                    <th className="px-3 py-2 whitespace-nowrap">Committed Amount</th>
                    <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((row) => {
                    const isDeleting = deletingIds.has(row.id);
                    return (
                      <tr key={row.id} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-3 py-3 font-medium whitespace-nowrap">{row.name}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{row.type || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{row.company || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{row.email || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{row.phone || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <StageBadge value={row.stage} />
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">{money(row.amount)}</td>
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
          className={`absolute right-0 top-0 h-full w-full md:w-auto md:max-w-xl lg:max-w-2xl bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Investor" : "Create Investor"}</h2>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)] sm:h-[calc(100%-57px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-gray-600">Name *</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g., Anil Kumar"
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
                <span className="text-sm text-gray-600">Company</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Company name (optional)"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Email</span>
                <input
                  type="email"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@domain.com"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Phone</span>
                <input
                  type="tel"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Stage</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                >
                  {STAGES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Committed Amount (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="e.g., 5000000"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Joined Date</span>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.joinedDate}
                  onChange={(e) => setForm({ ...form, joinedDate: e.target.value })}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Notes</span>
                <textarea
                  rows={4}
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Anything important…"
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
                {saving ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Investor" : "Create Investor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
