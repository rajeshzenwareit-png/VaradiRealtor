// src/pages/Projects.jsx
import React, { useEffect, useState, useCallback } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2 } from "react-icons/fi";

/** ---- Mock APIs (replace with your backend calls) ---- */
async function fetchProjectsAPI() {
  await new Promise((r) => setTimeout(r, 600));
  return [
    { id: "p1", name: "Real Estate Site", client: "Prakruthi", status: "In Progress", startDate: "2025-10-01", endDate: "", budget: "250000", description: "Premium real estate site" },
    { id: "p2", name: "UpShik Landing", client: "UpShik Academy", status: "Planned", startDate: "", endDate: "", budget: "", description: "" },
    { id: "p3", name: "Cavree Portal", client: "Cavree", status: "Live", startDate: "2025-06-10", endDate: "2025-09-01", budget: "500000", description: "Membership portal" },
  ];
}
async function createProjectAPI(payload) {
  await new Promise((r) => setTimeout(r, 500));
  return { id: String(Date.now()), ...payload };
}
async function updateProjectAPI(id, payload) {
  await new Promise((r) => setTimeout(r, 500));
  return { id, ...payload };
}
async function deleteProjectAPI(id) {
  await new Promise((r) => setTimeout(r, 400));
  return { ok: true };
}

/** ---- Component ---- */
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null); // null = create, string = edit id
  const [deletingIds, setDeletingIds] = useState(new Set());

  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "Planned",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      client: "",
      status: "Planned",
      startDate: "",
      endDate: "",
      budget: "",
      description: "",
    });

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProjectsAPI();
      setProjects(data);
    } catch (e) {
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  /** open create drawer */
  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setDrawerOpen(true);
  };

  /** open edit drawer */
  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      client: p.client || "",
      status: p.status || "Planned",
      startDate: p.startDate || "",
      endDate: p.endDate || "",
      budget: p.budget || "",
      description: p.description || "",
    });
    setDrawerOpen(true);
  };

  /** create or update submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError("Project name is required.");
    setCreating(true);
    setError("");
    try {
      if (editingId) {
        const updated = await updateProjectAPI(editingId, form);
        setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p)));
      } else {
        const created = await createProjectAPI(form);
        setProjects((prev) => [created, ...prev]);
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(editingId ? "Failed to update project." : "Failed to create property.");
    } finally {
      setCreating(false);
    }
  };

  /** delete */
  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This action cannot be undone.")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = projects;
    setProjects((p) => p.filter((x) => x.id !== id)); // optimistic
    try {
      const res = await deleteProjectAPI(id);
      if (!res?.ok) throw new Error("Delete failed");
    } catch (e) {
      setProjects(prev); // rollback
      setError("Failed to delete project.");
    } finally {
      setDeletingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  };

  return (
    <div className="h-full w-full">
      {/* Header + actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">Manage your projects and create new ones.</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <button
            onClick={loadProjects}
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
            title="Create Property"
          >
            <FiPlus />
            <span className="hidden xs:inline">Create</span>
          </button>
        </div>
      </div>

      {/* Content container */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-3 sm:p-4">
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading projects…</div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No projects yet.</p>
              <button onClick={openCreate} className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                Create your first project
              </button>
            </div>
          ) : (
            /* One responsive table (headers visible on mobile via horizontal scroll) */
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2 whitespace-nowrap">Name</th>
                    <th className="px-3 py-2 whitespace-nowrap">Client</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Start</th>
                    <th className="px-3 py-2 whitespace-nowrap">End</th>
                    <th className="px-3 py-2 whitespace-nowrap">Budget</th>
                    <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => {
                    const isDeleting = deletingIds.has(p.id);
                    return (
                      <tr key={p.id} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-3 py-3 font-medium whitespace-nowrap">{p.name}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{p.client || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">{p.startDate || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{p.endDate || "—"}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{p.budget ? `₹${p.budget}` : "—"}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100"
                              title="Edit"
                            >
                              <FiEdit2 /> <span className="hidden sm:inline">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              disabled={isDeleting}
                              className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 hover:bg-gray-100 disabled:opacity-50"
                              title="Delete"
                            >
                              <FiTrash2 /> <span className="hidden sm:inline">{isDeleting ? "Deleting…" : "Delete"}</span>
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

      {/* Right-side drawer (full width on mobile, panel on md+) */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        {/* Backdrop */}
        <button
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close form backdrop"
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full md:w-auto md:max-w-md lg:max-w-lg bg-white shadow-2xl transition-transform duration-300
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Project" : "Create Property"}</h2>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
              <FiX />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)] sm:h-[calc(100%-57px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Project Name *</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Client</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Status</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>On Hold</option>
                  <option>Live</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Start Date</span>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">End Date</span>
                <input
                  type="date"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Budget (₹)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="text-sm text-gray-600">Description</span>
                <textarea
                  rows="4"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                disabled={creating}
                className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700 disabled:opacity-60"
              >
                {creating ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Project" : "Create Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
