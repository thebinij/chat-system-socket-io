import { Router } from "express";
import { fetchAllChats, sendChat } from "../controllers/chatControllers.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, fetchAllChats);
router.post("/",authMiddleware, sendChat);

export default router;
