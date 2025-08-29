import jwt from 'jsonwebtoken';
import { Student } from '../models/student.model.js';
import { Professor } from '../models/Professor.model.js';
import { Administration } from '../models/Administration.model.js';
import { Courses } from '../models/Courses.model.js';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "User is not authenticated",
                success: false,
            });
        }

        let decode;
        try {
            decode = jwt.verify(token, process.env.SECRET_KEY);
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token",
                success: false,
            });
        }

        req.id = decode.userId;

        const urlParts = req.originalUrl.split('/');
        const versionIndex = urlParts.indexOf('v1');
        const role = versionIndex !== -1 && urlParts.length > versionIndex + 1 ? urlParts[versionIndex + 1] : null;

        if (!['student', 'professor', 'administration'].includes(role)) {
            return res.status(400).json({
                message: "Invalid user role in route",
                success: false,
            });
        }

        const { courseCode } = req.params;

        if (role === 'student') {
            const student = await Student.findById(req.id).lean();
            if (!student) {
                return res.status(403).json({
                    message: "Access forbidden",
                    success: false,
                });
            }

            if (courseCode) {
                const isOpted = await Courses.exists({
                    _id: { $in: student.coursesOpted },
                    courseCode,
                });
                if (!isOpted) {
                    return res.status(403).json({
                        message: "Access forbidden: Not enrolled in this course",
                        success: false,
                    });
                }
            }
        } else if (role === 'professor') {
            const professor = await Professor.findById(req.id).lean();
            if (!professor) {
                return res.status(403).json({
                    message: "Access forbidden",
                    success: false,
                });
            }

            if (courseCode) {
                const hasCourse = await Courses.exists({
                    _id: { $in: professor.courses },
                    courseCode,
                });
                if (!hasCourse) {
                    return res.status(403).json({
                        message: "Access forbidden: You do not teach this course",
                        success: false,
                    });
                }
            }
        } else if (role === 'administration') {
            const administrater = await Administration.findById(req.id).lean();
            if (!administrater) {
                return res.status(403).json({
                    message: "Access forbidden",
                    success: false,
                });
            }
        }

        next();
    } catch (error) {
        console.error("Authentication Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
};

export default isAuthenticated;
