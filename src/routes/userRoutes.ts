import express from "express";
import upload from "../midleware/upload";
import {
  index,
  login,
  register,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/index", index);
router.delete("/deleteUser/:userId", deleteUser);

export default router;
