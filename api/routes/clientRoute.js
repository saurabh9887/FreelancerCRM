import express from "express";
import { getAllClients } from "../Controllers/clientController.js";

const router = express.Router();

// get client list
router.post("/getAllClients", getAllClients);

export default router;
