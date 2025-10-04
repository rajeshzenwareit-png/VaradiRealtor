import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  rating: { type: Number, min: 0, max: 5, required: true },
  comment: { type: String, trim: true },
  // video URL with no regex validation
  video_review: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
