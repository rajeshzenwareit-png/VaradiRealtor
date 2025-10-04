import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createEnquiry } from "../controllers/EnquiryController.js";

const router = Router();

const limiter = rateLimit({ windowMs: 60_000, limit: 20 });

// router.post("/enquiries", limiter, createEnquiry);
router.post("/", createEnquiry);

export default router;
