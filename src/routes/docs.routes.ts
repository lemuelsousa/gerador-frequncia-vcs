import { Router } from "express";
import { docsCreationHandler } from "../handler/docs.handler";

const router = Router();

router.post("/docs", docsCreationHandler);

export default router;
