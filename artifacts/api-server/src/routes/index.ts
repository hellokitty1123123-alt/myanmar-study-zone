import { Router, type IRouter } from "express";
import healthRouter from "./health";
import newsroomRouter from "./newsroom";

const router: IRouter = Router();

router.use(healthRouter);
router.use(newsroomRouter);

export default router;
