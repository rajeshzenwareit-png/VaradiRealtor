import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import propertyRoutes from "./routes/propertyRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import categoryRouter from "./routes/categoriesRoutes.js";
import featureRoutes from "./routes/featureRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/properties", propertyRoutes); // ✅ properties route
app.use("/api/agents", agentRoutes);        // fixed missing "/" and plural
app.use("/api/blogs", blogRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/enquiries", enquiryRoutes);   // fixed route to match REST naming
app.use("/api/categories",categoryRouter);
app.use("/api/features", featureRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

