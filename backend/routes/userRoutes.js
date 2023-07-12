import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { allUsers,addUser } from "../controllers/userControllers.js";

const router = Router();

router.route("/").get(authMiddleware, allUsers);
router.route("/add").post(authMiddleware, addUser);

export default router;
