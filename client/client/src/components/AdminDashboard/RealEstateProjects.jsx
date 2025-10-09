// src/pages/Projects.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
export default function RealEstateProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null); // null = create, string = edit id
  const [deletingIds, setDeletingIds] = useState(new Set());

  // Pagination state
  const [page, setPage] = useState(1);       // 1-based
  const [pageSize, setPageSize] = useState(10); // 5,10,20,50

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
      setPage(1); // reset page on reload
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
        setPage(1); // new row appears on page 1
      }
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch (e) {
      setError(editingId ? "Failed to update project." : "Failed to create project.");
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

  /* ----------------------------- Pagination ---------------------------- */
  const total = projects.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * pageSize;
  const pageEnd = Math.min(pageStart + pageSize, total);

  const pagedProjects = useMemo(
    () => projects.slice(pageStart, pageEnd),
    [projects, pageStart, pageEnd]
  );

  function getPageNumbers(current, totalP, max = 5) {
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalP, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
  const pageNumbers = useMemo(() => getPageNumbers(page, totalPages, 5), [page, totalPages]);

  const money = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? `₹${n.toLocaleString("en-IN")}` : "—";
  };

  const StatusBadge = ({ value }) => (
    <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs">
      {value || "—"}
    </span>
  );

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
      {/* Header + actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">Manage your projects and create new ones.</p>
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
            title="Create Project"
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
            <>
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
                    {pagedProjects.map((p) => {
                      const isDeleting = deletingIds.has(p.id);
                      return (
                        <tr key={p.id} className="bg-gray-50 hover:bg-gray-100">
                          <td className="px-3 py-3 font-medium whitespace-nowrap">{p.name}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{p.client || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap"><StatusBadge value={p.status} /></td>
                          <td className="px-3 py-3 whitespace-nowrap">{p.startDate || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{p.endDate || "—"}</td>
                          <td className="px-3 py-3 whitespace-nowrap">{money(p.budget)}</td>
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
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Project" : "Create Project"}</h2>
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
                {creating ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Project" : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
