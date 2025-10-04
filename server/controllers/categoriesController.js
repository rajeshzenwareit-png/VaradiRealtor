import mongoose from "mongoose";
import { Category } from "../models/Categories.js";

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/** GET /api/categories  -> list (with optional query filters) */
export async function listCategories(req, res, next) {
  try {
    const { name } = req.query; // simple filter example
    const where = {};
    if (name) where.name = new RegExp(`^${name}$`, "i");

    const data = await Category.find(where).sort({ createdAt: -1 }).lean();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

/** GET /api/categories/:id -> single */
export async function getCategory(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid ID" });

    const doc = await Category.findById(id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (err) {
    next(err);
  }
}

/** POST /api/categories -> create */
export async function createCategory(req, res, next) {
  try {
    const { name, iconClass, colorClass } = req.body;

    // simple required checks
    if (!name || !iconClass || !colorClass) {
      return res.status(400).json({ error: "name, iconClass, colorClass are required" });
    }

    const doc = await Category.create({ name, iconClass, colorClass });
    res.status(201).json({ data: doc });
  } catch (err) {
    // handle duplicate key (unique name)
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Category name already exists" });
    }
    next(err);
  }
}

/** PUT /api/categories/:id -> full update (or use PATCH for partial) */
export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid ID" });

    const { name, iconClass, colorClass } = req.body;
    if (!name && !iconClass && !colorClass) {
      return res.status(400).json({ error: "Provide at least one field to update" });
    }

    const doc = await Category.findByIdAndUpdate(
      id,
      { $set: { ...(name && { name }), ...(iconClass && { iconClass }), ...(colorClass && { colorClass }) } },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: doc });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ error: "Category name already exists" });
    }
    next(err);
  }
}

/** DELETE /api/categories/:id -> remove */
export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ error: "Invalid ID" });

    const doc = await Category.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json({ data: { _id: doc._id, deleted: true } });
  } catch (err) {
    next(err);
  }
}
