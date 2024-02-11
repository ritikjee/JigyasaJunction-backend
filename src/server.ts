import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import connectDb from "./lib/connectDB";
import authrouter from "./routes/auth.route";
const app: Express = express();

dotenv.config();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 8080;
connectDb();

app.use("/api/auth", authrouter);

app.listen(PORT, () => console.log("Server running on port " + PORT));
