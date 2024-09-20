import { Router } from "express";
const router = Router();

import {
  getByIdUser,
  regesterUser,
  loginUser,
  updateUser,
  deleteUser,
} from "../controllers/auth.js";

router.get("/byId/:id", getByIdUser);
router.post("/register", regesterUser);
router.post("/login", loginUser);
router.put("/update/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);

export default router;
