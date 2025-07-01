import express from "express";
import { login } from "../Controllers/authController.js";

const router = express.Router();

// router.post("/register", register);
router.post("/login", login); //User login
// router.post("/logout", logout);

export default router;
