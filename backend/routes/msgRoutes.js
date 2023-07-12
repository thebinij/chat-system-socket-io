import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { sendMsg, allMessages } from "../controllers/msgControllers.js";

const router = Router();

router.route("/").post(authMiddleware, sendMsg);
router.route("/:chatId").get(authMiddleware, allMessages);

export default router;
