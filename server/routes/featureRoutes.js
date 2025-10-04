import express from "express";
import {
  listFeatures,
  getFeature,
  createFeature,
  updateFeature,
  deleteFeature
} from "../controllers/featureController.js";

const router = express.Router();

// GET all features (supports ?active=true|false & ?q=search)
router.get("/", listFeatures);

// GET a single feature by ID
router.get("/:id", getFeature);

// CREATE a new feature
router.post("/", createFeature);

// UPDATE a feature by ID
router.put("/:id", updateFeature);

// DELETE a feature by ID
router.delete("/:id", deleteFeature);

export default router;
