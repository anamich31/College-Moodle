import express from "express";
import connectDB from "./utils/db.js";
import dotenv from "dotenv";
import cors from "cors";
import administrationRoute from "./route/Administration.route.js";
import professorRoute from "./route/Professor.route.js";
import studentRoute from "./route/Student.route.js";
import cookieParser from "cookie-parser";
import { logout } from "./controllers/Professor.controller.js";
import path from "path";




dotenv.config({});
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "300mb" }));
app.use(express.urlencoded({ extended: true, limit: "300mb" }));
app.use(cookieParser());

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));



// Routes
  app.use("/api/v1/administration", administrationRoute);
  app.use("/api/v1/professor", professorRoute);
  app.use("/api/v1/student", studentRoute);
  app.use("/api/v1/logout", logout);


// Folder to serve PDF files
const pdfDirectory = path.resolve("uploads"); // Change 'uploads' to your actual folder
app.use("/api/v1/files", express.static(pdfDirectory));

// Dynamic endpoint to serve specific files
app.get("/api/v1/files/:fileName", (req, res) => {
  const { fileName } = req.params;
  const filePath = path.join(pdfDirectory, fileName);

  if (!fileName || !fileName.endsWith(".pdf")) {
    return res.status(400).json({ error: "Invalid file request" });
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(500).json({ error: "File download failed" });
    }
  });
});

// Server initialization
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
