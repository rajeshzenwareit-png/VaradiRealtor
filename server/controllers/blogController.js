// controllers/blog.controller.js
import Blog from "../models/Blog.js";

/** Utility: wrap async controller to bubble errors to Express error handler */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/** Create one blog (uses alias fields: img, text, longText) */
export const createBlog = asyncHandler(async (req, res) => {
  const { title, img, text, longText } = req.body;

  if (!title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const doc = await Blog.create({
    title: title.trim(),
    img: img || "",           // alias -> coverImage
    text: text || "",         // alias -> excerpt
    longText: longText || "", // alias -> content
  });

  return res.status(201).json({ message: "Created", data: doc });
});

/** Bulk insert: accepts an array like your `items` */
export const bulkInsert = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body) ? req.body : [];
  if (!items.length) {
    return res.status(400).json({ message: "Provide an array of items" });
  }

  // Basic normalization
  const payload = items.map((it) => ({
    title: it.title?.trim() || "Untitled",
    img: it.img || "",
    text: it.text || "",
    longText: it.longText || "",
  }));

  const inserted = await Blog.insertMany(payload);
  return res.status(201).json({ message: "Inserted", count: inserted.length, data: inserted });
});

/** Get all blogs with pagination, search, and sorting */
export const getBlogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    q = "",
    sort = "-createdAt", // e.g. "-createdAt" | "createdAt" | "title" | "-title"
    fields = "",         // e.g. "title,img,text,createdAt"
    from,                 // ISO date string to filter createdAt >= from
    to,                   // ISO date string to filter createdAt <= to
  } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const filter = {};
  if (q) {
    // text search over title/excerpt/content based on the text index
    filter.$text = { $search: q };
  }
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }

  // Build projection from fields list (aliases work automatically)
  const projection =
    fields
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .reduce((acc, f) => ((acc[f] = 1), acc), {}) || null;

  const total = await Blog.countDocuments(filter);
  const docs = await Blog.find(filter, projection)
    .sort(sort)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  return res.json({
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum) || 1,
    data: docs,
  });
});

/** Get one blog by Mongo _id */
export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Blog.findById(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ data: doc });
});

/** Update (partial) by id — only allow allowed fields */
export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Whitelist updatable fields
  const allowed = ["title", "img", "text", "longText"];
  const update = {};
  for (const key of allowed) {
    if (key in req.body) update[key] = req.body[key];
  }

  if (update.title && !update.title.trim()) {
    return res.status(400).json({ message: "Title cannot be empty" });
  }

  const doc = await Blog.findByIdAndUpdate(
    id,
    update,
    { new: true, runValidators: true }
  );

  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ message: "Updated", data: doc });
});

/** Delete by id */
export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doc = await Blog.findByIdAndDelete(id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  return res.json({ message: "Deleted", data: { _id: doc._id } });
});
