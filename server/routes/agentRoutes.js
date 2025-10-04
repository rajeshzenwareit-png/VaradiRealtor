// routes/agentRoutes.js
import express from "express";
import { getAgents } from "../controllers/agentController.js";

const router = express.Router();

// GET /api/agents
router.get("/", getAgents);

export default router;
