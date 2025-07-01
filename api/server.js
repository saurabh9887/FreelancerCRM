import express from "express";
import authRoute from "./routes/authRoute.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);

app.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
