import express from "express";
import { AddUpdateTask } from "../Controllers/tasksController.js";

const router = express.Router();

// get client list
// router.post("/getAllClients", getAllTasks);
// router.get("/getSingleClientByID", getSingleClientByID);
router.post("/AddUpdateTask", AddUpdateTask);
// router.delete("/deleteClientByID", deleteClientByID);

export default router;
