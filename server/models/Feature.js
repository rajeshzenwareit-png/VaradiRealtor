// ES6 + Mongoose model for CustomGrid "features"
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    // Tailwind/React Icon name you use in the UI (optional, for future use)
    icon: { type: String, default: "" },

    text: { type: String, required: true, trim: true },  // "Residential Homes"
    desc: { type: String, required: true, trim: true },  // subtitle/description

    // For ordering in the grid
    sortOrder: { type: Number, default: 0 },

    // Toggle visibility without deleting
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

featureSchema.index({ text: "text", desc: "text" });

export const Feature = mongoose.model("Feature", featureSchema);
