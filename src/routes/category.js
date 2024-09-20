import { Router } from "express";
const router = Router();

import categoryService from "../controllers/category.js";

router.get("/", categoryService.getAll);
router.get("/:id", categoryService.getById);
router.post("/add", categoryService.addCategory);
router.put("/update/:id", categoryService.updateCategory);
router.delete("/delete/:id", categoryService.deleteCategory);

export default router;
