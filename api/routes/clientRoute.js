import express from "express";
import {
  AddUpdateClient,
  deleteClientByID,
  getAllClients,
  getSingleClientByID,
} from "../Controllers/clientController.js";

const router = express.Router();

// get client list
router.post("/getAllClients", getAllClients);
router.get("/getSingleClientByID", getSingleClientByID);
router.post("/AddUpdateClient", AddUpdateClient);
router.delete("/deleteClientByID", deleteClientByID);

export default router;
