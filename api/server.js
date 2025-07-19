import express from "express";
import authRoute from "./routes/authRoute.js";
import clientRoute from "./routes/clientRoute.js";
import tasksRoute from "./routes/tasksRoute.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/client", clientRoute);
app.use("/api/task", tasksRoute);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});

// ALTER TABLE client
// MODIFY COLUMN clientKeyID VARCHAR(36) NOT NULL DEFAULT (UUID());
