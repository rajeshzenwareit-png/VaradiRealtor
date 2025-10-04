import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    // Primary fields (stored in Mongo)
    title: { type: String, required: true, trim: true, maxlength: 180 },

    // Store one image URL; expose as "img"
    coverImage: {
      type: String,
      trim: true,
      maxlength: 2048,
      alias: "img", // write/read with doc.img
    },

    // Short summary; expose as "text"
    excerpt: {
      type: String,
      trim: true,
      maxlength: 500,
      alias: "text", // write/read with doc.text
    },

    // Full content; expose as "longText"
    content: {
      type: String,
      trim: true,
      alias: "longText", // write/read with doc.longText
    },

    createdAt: { type: Date, default: Date.now, index: true },
  },
  {
    // Also adds updatedAt
    timestamps: { createdAt: true, updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Optional: quick text index for searching
BlogSchema.index({ title: "text", excerpt: "text", content: "text" });

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
