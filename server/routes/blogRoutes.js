// routes/blog.routes.js
import { Router } from "express";
import {
  createBlog,
  bulkInsert,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = Router();

router.post("/", createBlog);        // create single
router.post("/bulk", bulkInsert);    // bulk insert array of items
router.get("/", getBlogs);           // list with pagination/search
router.get("/:id", getBlogById);     // read
router.patch("/:id", updateBlog);    // partial update
router.delete("/:id", deleteBlog);   // delete

export default router;

