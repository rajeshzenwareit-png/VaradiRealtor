import express from "express";
import { 
  getProperties, 
  getPropertyById, 
  createProperty, 
  updateProperty 
} from "../controllers/propertyController.js";

const router = express.Router();

// GET all properties (includes amenities automatically)
router.get("/", getProperties);

// GET single property by ID
router.get("/:id", getPropertyById);

// CREATE new property (with amenities)
router.post("/", createProperty);

// UPDATE property (including amenities)
router.put("/:id", updateProperty);

export default router;
