import express from 'express'
import { changePassword, deleteCourse, deleteProfessorProfile, deleteStudentProfile, getCourses, getProfessor, getStudents, login, logout, microsoftLogin, register, registerCourse, registerProfessor, registerStudent, updateCouseDetails, updateProfessorDetails, updateStudentDetails } from '../controllers/Administration.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import passport from 'passport';


const router= express.Router();

// Microsoft authentication route
router.get('/auth/microsoft', passport.authenticate('administration-microsoft'));

router.get(
  '/auth/callback',
  passport.authenticate('administration-microsoft', { failureRedirect: '/api/v1/auth/failure' }),
  microsoftLogin
);

router.route('/register').post(register);
router.route('/login').post(login);


//route for students
router.route('/students/register').post(isAuthenticated,registerStudent);
router.route('/students').get(isAuthenticated,getStudents);
router.route('/students/update/:id').post(isAuthenticated,updateStudentDetails);
router.route('/students/delete/:id').delete(isAuthenticated,deleteStudentProfile);

//route for professors
router.route('/professor/register').post(isAuthenticated, registerProfessor);
router.route('/professor').get(isAuthenticated, getProfessor);
router.route('/professor/update/:id').post(isAuthenticated,updateProfessorDetails);
router.route('/professor/delete/:id').delete(isAuthenticated,deleteProfessorProfile)

// route for courses
router.route('/courses/register').post(isAuthenticated,registerCourse);
router.route('/courses').get(isAuthenticated,getCourses);
router.route('/courses/update/:id').post(isAuthenticated,updateCouseDetails);
router.route('/courses/delete/:id').delete(isAuthenticated,deleteCourse);

router.route("/changePassword").post(isAuthenticated, changePassword);


export default router