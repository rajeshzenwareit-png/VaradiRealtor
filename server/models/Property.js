// models/Property.js
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true, required: true },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 0, min: 0 },

    // propertyType maps from "category" in your frontend
    propertyType: { type: String, trim: true, required: true },

    // NEW FIELDS from your state
    country: { type: String, trim: true, required: true },
    stateName: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },

    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },

    // New field: Amenities
    amenities: { type: [String], default: [] },

    // New field: Built-up / carpet area (e.g., in sq ft)
    square: { type: Number, min: 0, default: 0 },

    // New field: Category (e.g., "rent", "sale", "lease")
    category_type: { type: String, trim: true, default: "" },

    videoUrl: {
      type: String,
      trim: true,
      default: "No url found",
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

/**
 * Indexes
 */
PropertySchema.index(
  { propertyType: 1, location: 1, bedrooms: 1, price: 1 },
  { name: "propertyType_location_bedrooms_price" }
);
PropertySchema.index({ price: 1 }, { name: "price_only" });
PropertySchema.index({ createdAt: -1 }, { name: "createdAt_desc" });
PropertySchema.index({ category_type: 1 }, { name: "category_type_only" });
PropertySchema.index({ square: 1 }, { name: "square_only" });

// 🔎 New indexes for fast filtering by location hierarchy
PropertySchema.index({ country: 1, stateName: 1, city: 1 }, { name: "country_state_city" });

// Optional: text index for keyword search
PropertySchema.index(
  { title: "text", description: "text", location: "text", city: "text", stateName: "text", country: "text" },
  { name: "text_search" }
);

const Property = mongoose.model("Property", PropertySchema);
export default Property;
