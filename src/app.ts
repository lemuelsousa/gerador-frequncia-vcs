import express from "express";
import path from "path";
import { vcNames } from "./reposiroty/repository";
import namesRoutes from "./routes/names.route";
const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.render("app", {
    title: "frequencia | voluntário civil",
    names: vcNames,
  });
});

app.use("/api", namesRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
