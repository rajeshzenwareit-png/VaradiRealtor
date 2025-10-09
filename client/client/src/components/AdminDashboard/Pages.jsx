// src/pages/Pages.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { FiPlus, FiRefreshCw, FiX, FiEdit2, FiTrash2, FiImage, FiLink2 } from "react-icons/fi";

/* ---------------- Mock store (replace with backend) ---------------- */
const LS_KEY = "cms_pages_v1";
const readStore = () => {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch { return []; }
};
const writeStore = (data) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
};

/* ------------------------------ Utils -------------------------------- */
const BASE_URL = "https://www.tirupatirealestates.com/en/";
const slugify = (s="") =>
  s.toString().trim().toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function fileToDataUrl(file) {
  if (!file) return "";
  const buf = await file.arrayBuffer();
  return await new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result || "");
    r.readAsDataURL(new Blob([buf], { type: file.type || "application/octet-stream" }));
  });
}

/* ------------------------------ Component ----------------------------- */
export default function Pages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [deletingIds, setDeletingIds] = useState(new Set());

  /* form state — mirrors RealEstateProjects style */
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    contentHtml: "",
    // SEO
    seoTitle: "",
    seoDescription: "",
    seoIndex: "index",
    seoImageUrl: "",
    seoImageDataUrl: "",
    // Settings
    status: "Draft",
    template: "Default",
    // Main image
    imageUrl: "",
    imageDataUrl: "",
  });

  const resetForm = () =>
    setForm({
      name: "",
      slug: "",
      description: "",
      contentHtml: "",
      seoTitle: "",
      seoDescription: "",
      seoIndex: "index",
      seoImageUrl: "",
      seoImageDataUrl: "",
      status: "Draft",
      template: "Default",
      imageUrl: "",
      imageDataUrl: "",
    });

  /* Load list (like fetchProjectsAPI) */
  const loadPages = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = readStore();
      setItems(data);
    } catch {
      setError("Failed to load pages. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  /* Drawer openers (same pattern as Projects) */
  const openCreate = () => {
    setEditingId(null);
    resetForm();
    setDrawerOpen(true);
    // reset editor content
    if (editorRef.current) editorRef.current.innerHTML = "<p>Start typing your content…</p>";
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name || "",
      slug: p.slug || "",
      description: p.description || "",
      contentHtml: p.contentHtml || "",
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      seoIndex: p.seoIndex || "index",
      seoImageUrl: p.seoImageUrl || "",
      seoImageDataUrl: p.seoImageDataUrl || "",
      status: p.status || "Draft",
      template: p.template || "Default",
      imageUrl: p.imageUrl || "",
      imageDataUrl: p.imageDataUrl || "",
    });
    setDrawerOpen(true);
    if (editorRef.current) {
      editorRef.current.innerHTML = p.contentHtml || "<p>Start typing your content…</p>";
    }
  };

  /* Submit (create/update) */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError("Name is required.");
    const slug = (form.slug || slugify(name)).trim();
    if (!slug) return setError("Permalink (slug) is required.");

    setSaving(true);
    setError("");
    try {
      const payload = {
        id: editingId || String(Date.now()),
        name,
        slug,
        description: form.description.trim(),
        contentHtml: form.contentHtml,
        seoTitle: form.seoTitle.trim(),
        seoDescription: form.seoDescription.trim(),
        seoIndex: form.seoIndex,
        seoImageUrl: form.seoImageUrl.trim(),
        seoImageDataUrl: form.seoImageDataUrl,
        status: form.status,
        template: form.template,
        imageUrl: form.imageUrl.trim(),
        imageDataUrl: form.imageDataUrl,
        updatedAt: new Date().toISOString(),
      };
      const cur = readStore();
      const exists = cur.some((x) => x.id === payload.id);
      const next = exists ? cur.map((x) => (x.id === payload.id ? payload : x)) : [payload, ...cur];
      writeStore(next);
      setItems(next);
      setDrawerOpen(false);
      setEditingId(null);
      resetForm();
    } catch {
      setError(editingId ? "Failed to update page." : "Failed to create page.");
    } finally {
      setSaving(false);
    }
  };

  /* Delete (optimistic like Projects) */
  const handleDelete = async (id) => {
    if (!confirm("Delete this page?")) return;
    setDeletingIds((s) => new Set(s).add(id));
    const prev = items;
    setItems((p) => p.filter((x) => x.id !== id));
    try {
      const next = prev.filter((x) => x.id !== id);
      writeStore(next);
    } catch {
      setItems(prev);
      setError("Failed to delete page.");
    } finally {
      setDeletingIds((s) => {
        const n = new Set(s);
        n.delete(id);
        return n;
      });
    }
  };

  /* Permalink preview */
  const permalink = useMemo(() => {
    const slug = (form.slug || slugify(form.name)).trim();
    return BASE_URL + (slug ? `${slug}/` : "");
  }, [form.slug, form.name]);

  /* Simple rich-text (matches input styling + compact toolbar) */
  const editorRef = useRef(null);
  const exec = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    setForm((f) => ({ ...f, contentHtml: editorRef.current?.innerHTML || "" }));
  };
  const onEditorInput = () => {
    setForm((f) => ({ ...f, contentHtml: editorRef.current?.innerHTML || "" }));
  };

  const handleUpload = async (file, key) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setForm((f) => ({ ...f, [key]: dataUrl }));
  };

  return (
    <div className="h-full w-full">
      {/* Header + actions (same as Projects) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold">Pages</h1>
          <p className="text-sm text-gray-500">Create and manage static website pages.</p>
        </div>
        <div className="flex items-center gap-2 sm:justify-end">
          <button
            onClick={loadPages}
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
            title="Create Page"
          >
            <FiPlus />
            <span className="hidden xs:inline">Create</span>
          </button>
        </div>
      </div>

      {/* Table (same table style as Projects) */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="p-3 sm:p-4">
          {error && (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading pages…</div>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">No pages yet.</p>
              <button onClick={openCreate} className="rounded-xl bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
                Create your first page
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2 text-sm">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="text-left text-gray-500">
                    <th className="px-3 py-2 whitespace-nowrap">Name</th>
                    <th className="px-3 py-2 whitespace-nowrap">Permalink</th>
                    <th className="px-3 py-2 whitespace-nowrap">Status</th>
                    <th className="px-3 py-2 whitespace-nowrap">Template</th>
                    <th className="px-3 py-2 whitespace-nowrap">Updated</th>
                    <th className="px-3 py-2 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => {
                    const isDeleting = deletingIds.has(p.id);
                    return (
                      <tr key={p.id} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-3 py-3 font-medium whitespace-nowrap">{p.name}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="text-xs text-gray-600">{BASE_URL}{p.slug}/</span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-gray-200 px-2.5 py-0.5 text-xs">
                            {p.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">{p.template}</td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          {p.updatedAt ? new Date(p.updatedAt).toLocaleString() : "—"}
                        </td>
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
          )}
        </div>
      </div>

      {/* Drawer (form UI copied from Projects style) */}
      <div className={`fixed inset-0 z-50 ${drawerOpen ? "" : "pointer-events-none"}`} aria-hidden={!drawerOpen}>
        {/* Backdrop */}
        <button
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${drawerOpen ? "opacity-100" : "opacity-0"}`}
          aria-label="Close form backdrop"
        />
        {/* Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full md:w-auto md:max-w-2xl lg:max-w-3xl bg-white shadow-2xl transition-transform duration-300
            ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex items-center justify-between border-b p-3 sm:p-4">
            <h2 className="text-base sm:text-lg font-semibold">{editingId ? "Edit Page" : "Create Page"}</h2>
            <button onClick={() => setDrawerOpen(false)} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close">
              <FiX />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 sm:p-4 space-y-4 overflow-y-auto h-[calc(100%-56px)] sm:h-[calc(100%-57px)]"
          >
            {/* Top row: Name + Permalink */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-gray-600">Name *</span>
                <input
                  type="text"
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: f.slug ? f.slug : slugify(e.target.value),
                    }))
                  }
                  required
                  placeholder="e.g., About Us"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Permalink (slug)</span>
                <div className="mt-1 flex rounded-xl border overflow-hidden">
                  <span className="px-3 py-2 text-xs sm:text-sm text-gray-500 bg-gray-50 whitespace-nowrap">
                    {BASE_URL}
                  </span>
                  <input
                    type="text"
                    className="w-full px-3 py-2 focus:outline-none"
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                    placeholder="about-us"
                  />
                  <span className="px-2 py-2 text-gray-400 bg-gray-50">/</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Preview: <span className="font-mono">{permalink}</span>
                </p>
              </label>
            </div>

            {/* Description */}
            <label className="block">
              <span className="text-sm text-gray-600">Description</span>
              <textarea
                rows={2}
                className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short summary used in listings."
              />
            </label>

            {/* Content (toolbar + editor) */}
            <div>
              <span className="text-sm text-gray-600">Content</span>
              <div className="mt-1">
                <div className="flex flex-wrap gap-2 border rounded-t-xl p-2 bg-gray-50">
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Bold" onClick={() => exec("bold")}><b>B</b></button>
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Italic" onClick={() => exec("italic")}><i>I</i></button>
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Underline" onClick={() => exec("underline")}><u>U</u></button>
                  <span className="w-px h-6 bg-gray-200 mx-1" />
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Heading" onClick={() => exec("formatBlock", "<h2>")}>H2</button>
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Paragraph" onClick={() => exec("formatBlock", "<p>")}>P</button>
                  <span className="w-px h-6 bg-gray-200 mx-1" />
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Bulleted list" onClick={() => exec("insertUnorderedList")}>• List</button>
                  <button type="button" className="px-2 py-1 rounded hover:bg-gray-100" title="Numbered list" onClick={() => exec("insertOrderedList")}>1. List</button>
                  <button
                    type="button"
                    className="px-2 py-1 rounded hover:bg-gray-100"
                    title="Link"
                    onClick={() => {
                      const url = prompt("Enter URL");
                      if (url) exec("createLink", url);
                    }}
                  >
                    <FiLink2 className="inline" /> Link
                  </button>
                </div>
                <div
                  ref={editorRef}
                  onInput={onEditorInput}
                  className="min-h-40 max-h-[50vh] overflow-auto rounded-b-xl border border-t-0 p-3 focus:outline-none"
                  contentEditable
                  suppressContentEditableWarning
                  dangerouslySetInnerHTML={{ __html: form.contentHtml || "<p>Start typing your content…</p>" }}
                />
              </div>
            </div>

            {/* SEO Section (styled like other inputs) */}
            <div className="rounded-2xl border p-3 sm:p-4">
              <h3 className="font-medium mb-3">Search Engine Optimize</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-600">SEO Title</span>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="Optional; falls back to Name"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">SEO Description</span>
                  <input
                    type="text"
                    className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    value={form.seoDescription}
                    onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                    placeholder="Optional; falls back to Description"
                  />
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">SEO Image — Add from URL</span>
                  <div className="mt-1 flex rounded-xl border overflow-hidden">
                    <span className="px-2 py-2 text-gray-400 bg-gray-50"><FiImage /></span>
                    <input
                      type="url"
                      className="w-full px-3 py-2 focus:outline-none"
                      value={form.seoImageUrl}
                      onChange={(e) => setForm({ ...form, seoImageUrl: e.target.value })}
                      placeholder="https://example.com/og.jpg"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm text-gray-600">SEO Image — Choose image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 block w-full text-sm"
                    onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (f) await handleUpload(f, "seoImageDataUrl");
                    }}
                  />
                </label>

                <div className="sm:col-span-2">
                  <span className="text-sm text-gray-600 block mb-1">Indexing</span>
                  <div className="flex items-center gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="seoIndex"
                        value="index"
                        checked={form.seoIndex === "index"}
                        onChange={() => setForm({ ...form, seoIndex: "index" })}
                      />
                      <span>Index</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="radio"
                        name="seoIndex"
                        value="noindex"
                        checked={form.seoIndex === "noindex"}
                        onChange={() => setForm({ ...form, seoIndex: "noindex" })}
                      />
                      <span>No Index</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Status + Template + Main Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm text-gray-600">Status</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Draft</option>
                  <option>Published</option>
                  <option>Archived</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Template</span>
                <select
                  className="mt-1 w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  value={form.template}
                  onChange={(e) => setForm({ ...form, template: e.target.value })}
                >
                  <option>Default</option>
                  <option>Home</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Image — Add from URL</span>
                <div className="mt-1 flex rounded-xl border overflow-hidden">
                  <span className="px-2 py-2 text-gray-400 bg-gray-50"><FiImage /></span>
                  <input
                    type="url"
                    className="w-full px-3 py-2 focus:outline-none"
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    placeholder="https://example.com/hero.jpg"
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm text-gray-600">Image — Choose image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm"
                  onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (f) await handleUpload(f, "imageDataUrl");
                  }}
                />
              </label>
            </div>

            {/* Previews (compact) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-sm text-gray-600">SEO Image Preview</span>
                <div className="mt-1 border rounded-xl p-2 bg-gray-50">
                  {(form.seoImageUrl || form.seoImageDataUrl) ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={form.seoImageUrl || form.seoImageDataUrl}
                      className="max-h-40 rounded object-contain bg-white mx-auto"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="h-24 grid place-items-center text-gray-400 text-sm">No image selected</div>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Main Image Preview</span>
                <div className="mt-1 border rounded-xl p-2 bg-gray-50">
                  {(form.imageUrl || form.imageDataUrl) ? (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={form.imageUrl || form.imageDataUrl}
                      className="max-h-40 rounded object-contain bg-white mx-auto"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  ) : (
                    <div className="h-24 grid place-items-center text-gray-400 text-sm">No image selected</div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer buttons (same as Projects) */}
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
                {saving ? (editingId ? "Updating…" : "Creating…") : editingId ? "Update Page" : "Create Page"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Tiny footer to match your text */}
      <div className="mt-6 text-center text-xs text-gray-500">
        Copyright 2025 © SLN Developers Tirupati.
      </div>
    </div>
  );
}
