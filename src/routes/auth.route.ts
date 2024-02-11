import { Router } from "express";
import {
  getUserDetails,
  login,
  register,
  verify,
} from "../controllers/auth.controller";
const authrouter = Router();

authrouter.post("/register", register);
authrouter.post("/login", login);
authrouter.post("/verify", verify);
authrouter.get("/user/me", getUserDetails);

export default authrouter;
