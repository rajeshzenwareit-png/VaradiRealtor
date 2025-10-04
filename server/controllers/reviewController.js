// controllers/reviewController.js
import mongoose from "mongoose";
import Review from "../models/Review.js";

// GET all (no limit) — newest first
export const getAllReviews = async (_req, res) => {
  try {
    const reviews = await Review.find({})
      .sort({ createdAt: -1 })
      .select("name rating comment video_review createdAt");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET by id
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid review id" });

    const review = await Review.findById(id)
      .select("name rating comment video_review createdAt");

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const createReview = async (req, res) => {
  try {
    const { name, rating, comment, video_review } = req.body;

    // basic required checks (schema will also validate)
    if (!name || rating === undefined)
      return res.status(400).json({ error: "name and rating are required" });

    const review = await Review.create({
      name,
      rating,
      comment,
      video_review,
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE (partial) by id
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid review id" });

    const updatable = ["name", "rating", "comment", "video_review"];
    const update = {};
    for (const key of updatable) if (key in req.body) update[key] = req.body[key];

    const review = await Review.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).select("name rating comment video_review createdAt");

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
