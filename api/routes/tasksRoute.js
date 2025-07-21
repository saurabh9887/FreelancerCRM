import express from "express";
import { AddUpdateTask, getAllTasks, getSingleTaskByID } from "../Controllers/tasksController.js";

const router = express.Router();

// get client list
router.post("/getAllTasks", getAllTasks);
router.get("/getSingleTaskByID", getSingleTaskByID);
router.post("/AddUpdateTask", AddUpdateTask);
// router.delete("/deleteClientByID", deleteClientByID);

export default router;
