import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    iconClass: { type: String, required: true },  // e.g., "fa-solid fa-house"
    colorClass: { type: String, required: true }  // e.g., "text-blue-600"
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

