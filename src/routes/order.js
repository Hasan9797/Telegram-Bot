import { Router } from "express";
const router = Router();

import {
  getAll,
  addProduct,
  updateProduct,
  deleteProduct,
  getById,
} from "../controllers/product.js";

router.get("/", getAll);
router.get("/:id", getById);
router.post("/add", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

export default router;
