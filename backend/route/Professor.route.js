import express from "express";
import {
  addExtraClass,
  addPattern,
  changePassword,
  deletePdf,
  deletePdfFromSupa,
  getCourseDetails,
  getCoursesByProfCode,
  getPattern,
  getSchedule,
  getStudentsByCourse,
  getUploadedPdf,
  login,
  logout,
  removePattern,
  updateAttendance,
  updateAttendancebySheet,
  updateMarksBySheet,
  updateMarksIndividually,
  uploadPdf,
  uploadPdfbySupa,
} from "../controllers/Professor.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import fileUpload from "express-fileupload";
import passport from "passport";
import multer from "multer";
import { excelUpload } from "../middlewares/multer.js";

const router = express.Router();

// Multer setup (memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.route("/login").post(login);
router.route("/logout").get(logout);


router.route("/:id").get(isAuthenticated,getSchedule)

// -------------------Get Courses Routes ----------------------------
router.route("/courses/getcourses/:id").get(isAuthenticated, getCoursesByProfCode);
router.route("/courses/:courseCode").get(isAuthenticated, getCourseDetails);
router.route("/courses/:courseCode/students").get(isAuthenticated, getStudentsByCourse);

// ----------------PDF Routes-------------------------------
router.route("/courses/:courseCode/uploadpdf").post(isAuthenticated, fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }), uploadPdf);
router.route("/courses/:courseCode/deletepdf/:pdfid").delete(isAuthenticated, deletePdf);
router.route("/courses/:courseCode/getpdf").get(isAuthenticated,getUploadedPdf)

// ----------------Extra Class Route-----------------------------
router.route("/addExtraClass").post(isAuthenticated,addExtraClass);

// ----------------Pattern Routes--------------------------------
router.route("/courses/:courseCode/updatepattern").get(isAuthenticated, getPattern);
router.route("/courses/:courseCode/updatepattern").post(isAuthenticated, addPattern);
router.route("/courses/:courseCode/updatepattern/:patternId").delete(isAuthenticated, removePattern);

// ----------------Attendance Route---------------------------------
router.route("/courses/:courseCode/attendance").get(isAuthenticated, getStudentsByCourse);
router.route("/courses/:courseCode/attendance/:rollNo").put(isAuthenticated, updateAttendance);
router.route("/courses/:courseCode/attendance/uploadattendancesheet").post(isAuthenticated,excelUpload.single("file"), updateAttendancebySheet);

// ----------------Marks Route----------------------------------------
router.route("/courses/:courseCode/uploadmarkssheet/:patternid").post(isAuthenticated,excelUpload.single("file"), updateMarksBySheet);
router.route("/courses/:courseCode/updatemarks/:patternid/:rollNo").post(isAuthenticated,updateMarksIndividually)

router.route("/changePassword").post(isAuthenticated, changePassword);




// Use file upload middleware to handle incoming file uploads
router.use(fileUpload());
router.route("/courses/:courseCode/uploadpdfbysupabase").post(isAuthenticated,uploadPdfbySupa) // Ensure user is authenticated

router.route("/courses/:courseCode/deletepdfbysupabase/:fileName").delete(isAuthenticated,deletePdfFromSupa)

export default router;
