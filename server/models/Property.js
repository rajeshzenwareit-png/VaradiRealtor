// models/Property.js
import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true, required: true },
    price: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, default: 0, min: 0 },

    propertyType: { type: String, trim: true, required: true },

    country: { type: String, trim: true, required: true },
    stateName: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },

    images: { type: [String], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    amenities: { type: [String], default: [] },
    square: { type: Number, min: 0, default: 0 },
    category_type: { type: String, trim: true, default: "" },

    videoUrl: { type: String, trim: true, default: "No url found" },

    // 👇 NEW
    brochureUrl: {
      type: String,
      trim: true,
      default: "",                              // optional
      // validate it's a URL ending in .pdf (basic check)
    },
    // Optional but handy for clean downloads:
    brochureFileName: { type: String, trim: true, default: "" },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

/** Indexes (keep your existing ones) */
PropertySchema.index(
  { propertyType: 1, location: 1, bedrooms: 1, price: 1 },
  { name: "propertyType_location_bedrooms_price" }
);
PropertySchema.index({ price: 1 }, { name: "price_only" });
PropertySchema.index({ createdAt: -1 }, { name: "createdAt_desc" });
PropertySchema.index({ category_type: 1 }, { name: "category_type_only" });
PropertySchema.index({ square: 1 }, { name: "square_only" });
PropertySchema.index({ country: 1, stateName: 1, city: 1 }, { name: "country_state_city" });
PropertySchema.index(
  { title: "text", description: "text", location: "text", city: "text", stateName: "text", country: "text" },
  { name: "text_search" }
);

const Property = mongoose.model("Property", PropertySchema);
export default Property;
