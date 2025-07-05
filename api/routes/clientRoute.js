import express from "express";
import {
  AddUpdateClient,
  getAllClients,
} from "../Controllers/clientController.js";

const router = express.Router();

// get client list
router.post("/getAllClients", getAllClients);
router.post("/AddUpdateClient", AddUpdateClient);

export default router;
