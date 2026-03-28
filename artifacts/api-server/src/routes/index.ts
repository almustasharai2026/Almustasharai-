import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import authRouter from "./auth.js";
import chatRouter from "./chat.js";
import documentsRouter from "./documents.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(chatRouter);
router.use(documentsRouter);
router.use(adminRouter);

export default router;
