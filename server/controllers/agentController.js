// controllers/agentController.js
import Agent from "../models/Agent.js";

// GET all agents
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
