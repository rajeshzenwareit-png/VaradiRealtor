import { Router } from "express";
import {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoriesController.js";

const router = Router();

router.get("/", listCategories);     // list
router.get("/:id", getCategory);    // read one
router.post("/", createCategory);    // create
router.put("/:id", updateCategory); // update
// If you prefer partial update too:
// router.patch("/api/categories/:id", updateCategory);
router.delete("/:id", deleteCategory); // delete

export default router;
