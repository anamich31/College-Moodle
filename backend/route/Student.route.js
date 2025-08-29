import express from "express";
import { changePassword, getAttendance, getcourseDetails, getCourses, getmarks, getPattern, getProfessorDetails, getSchedule, getUploadedPdf, login,} from "../controllers/Student.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();


router.route('/login').post(login);


router.route("/:id").get(isAuthenticated,getSchedule);

router.route('/courses/getcourses/:id').get(isAuthenticated,getCourses);
router.route('/courses/:courseCode').get(isAuthenticated,getcourseDetails);
router.route('/courses/:courseCode/uploadedpdf').get(isAuthenticated,getUploadedPdf);
router.route('/courses/:courseCode/pattern').get(isAuthenticated,getPattern)  
router.route('/courses/:courseCode/marks').get(isAuthenticated,getmarks) 
router.route('/courses/:courseCode/professorDetails').get(isAuthenticated,getProfessorDetails)

router.route('/attendance/:id').get(isAuthenticated,getAttendance);
router.route('/changePassword').post(isAuthenticated,changePassword);

export default router;