import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import path from "path";
import authRoutes from "./routes/auth.routes";
import namesRoutes from "./routes/docs.routes";
import { logger } from "./utils/logger";
import "express-session";

dotenv.config();

const PORT = parseInt(process.env.PORT || "3000");

const app = express();
app.use(express.json());

const allowedOrigin = process.env.ALLOWED_ORIGINS || "http://localhost:3000";

app.use(cors({ origin: allowedOrigin }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

// trust proxy for correct secure cookie handling when behind a proxy
app.set("trust proxy", 1);

app.use(
  session({
    store: new session.MemoryStore(),
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 10,
    },
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  const health = {
    status: "ok",
    redis: "not-applicable",
    time: new Date().toISOString(),
  };
  logger.info("Health endpoint - OK", health);
  res.json(health);
});

app.use("/", authRoutes);

app.use((req, res, next) => {
  logger.info("Guard Middleawre", {
    timestamp: Date.now(),
    url: req.originalUrl,
    sessionUserId: req.session.user?.id,
  });

  const openPaths = [
    "/auth/login",
    "/auth/callback",
    "/auth/logout",
    "/health",
    "/favicon.ico",
  ];

  if (openPaths.includes(req.path)) {
    return next();
  }

  const user = req.session?.user;
  if (user) {
    logger.info("Guard: Authenticated. Proceeding to next.");
    return next();
  }
  logger.info("Guard: Not authenticated. Redirecting to /auth/login");
  res.redirect("/auth/login");
});

app.get("/", (req, res) => {
  res.render("app", {
    title: "frequencia | voluntário civil",
  });
});

app.use("/api", namesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
