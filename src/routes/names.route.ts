import { Router } from "express";
import { postNamesHandler } from "../handler/names.handler";

const router = Router();

router.post("/names", postNamesHandler);

export default router;
