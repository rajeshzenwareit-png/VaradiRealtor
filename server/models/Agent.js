import mongoose from "mongoose";

const AgentSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  avatar: String,
  about: String,
});

const Agent = mongoose.model("Agent", AgentSchema);

export default Agent;
