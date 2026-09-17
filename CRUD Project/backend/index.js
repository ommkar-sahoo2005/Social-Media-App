import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import relationshipsRoute from "./routes/relationships.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";

const app = express();

// Needed to simulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------- MIDDLEWARES ----------
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// --------- MULTER STORAGE ----------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../frontend/public/upload"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

// --------- UPLOAD ROUTE ----------
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

// --------- STATIC FILE SERVE ----------
app.use(
  "/upload",
  express.static(path.join(__dirname, "../frontend/public/upload"))
);

// --------- API ROUTES ----------
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipsRoute);

// --------- SERVER ----------
app.listen(1010, () => {
  console.log("Server running on port 1010");
});
