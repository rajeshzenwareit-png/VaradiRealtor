
// routes/reviewRoutes.js
import { Router } from "express";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
} from "../controllers/reviewController.js";

const router = Router();

router.get("/", getAllReviews);    // GET /api/reviews/all
router.get("/:id", getReviewById);    // GET /api/reviews/:id
router.post("/", createReview);       // POST /api/reviews
router.patch("/:id", updateReview);   // PATCH /api/reviews/:id

export default router;

