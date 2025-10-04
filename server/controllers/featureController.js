import { Feature } from "../models/Feature.js";

// GET /api/features
// supports query: ?active=true|false (default true), ?q=search, ?limit, ?skip
export const listFeatures = async (req, res, next) => {
  try {
    const { active = "true", q, limit = 50, skip = 0 } = req.query;

    const filter = {};
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false; // explicit
    if (q) filter.$text = { $search: q };

    const items = await Feature.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/features/:id
export const getFeature = async (req, res, next) => {
  try {
    const item = await Feature.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Feature not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/features
export const createFeature = async (req, res, next) => {
  try {
    const { icon = "", text, desc, sortOrder = 0, isActive = true } = req.body;
    const created = await Feature.create({ icon, text, desc, sortOrder, isActive });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

// PUT /api/features/:id
export const updateFeature = async (req, res, next) => {
  try {
    const updated = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Feature not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/features/:id  (hard delete; switch to soft by setting isActive=false)
export const deleteFeature = async (req, res, next) => {
  try {
    const deleted = await Feature.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Feature not found" });
    res.json({ message: "Feature removed" });
  } catch (err) {
    next(err);
  }
};
