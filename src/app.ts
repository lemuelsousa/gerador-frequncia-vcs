import express from "express";
import path from "path";
import namesRoutes from "./routes/docs.routes";
import cors from "cors";

const app = express();
app.use(express.json());

const allowedOrigin = [
  "http://localhost:3000",
  "https://freqvcpmpa.fly.dev",
];

app.use(cors({ origin: allowedOrigin }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("app", {
    title: "frequencia | voluntário civil",
  });
});

app.use("/api", namesRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
