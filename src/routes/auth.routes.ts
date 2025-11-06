import { Router } from "express";
import {
  callbackUriHandler,
  loginConsentHandler,
  logoutHandler,
  profileInfoHandler,
} from "../handler/auth.handler";

const router = Router();

router.get("/auth/login", loginConsentHandler);
router.get("/auth/callback", callbackUriHandler);
router.get("/profile", profileInfoHandler);
router.get("/auth/logout", logoutHandler)

export default router;
