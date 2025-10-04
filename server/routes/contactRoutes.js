// server/routes/contactRoutes.js
import express from "express";
import { handleContactForm } from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", handleContactForm);

export default router;
