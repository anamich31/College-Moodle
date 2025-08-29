import { Courses } from "../models/Courses.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Student } from "../models/student.model.js";
import { Professor } from "../models/Professor.model.js";


export  const login=async(req,res)=>{
    try {
      const {instituteMailId,password}=req.body;
      if(!instituteMailId || !password){
        return res.status(400).json({
          message:"All the fields are nedded",
          success:false
          
        })
      }


      const sanitizedinstituteMailId = String(instituteMailId).trim().toLowerCase();
        
        const sanitizedPassword = String(password).trim();

      let student= await Student.findOne({instituteMailId});

      if(!student){
        return res.status(400).json({
          message:"Institude Mail Id not found",
          success:false
        })
      }

      const isPasswordMatched= await bcrypt.compare(sanitizedPassword,student.password);

      if(!isPasswordMatched){
        return res.status(400).json({
          message:"Incorrect Password",
          success:false
        })
      }

       const tokenData={
          userId:student._id
      }
      const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

      student={
          _id:student._id,
          fullname:student.fullname,
          instituteMailId:student.instituteMailId,
      }

      return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
          message:`Welcome back!! `,
          user:student,
          success:true
      })

    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }
}

export const microsoftLogin = async (req, res) => {
  try {
    const microsoftEmail = req.user.emails[0]?.value;

    if (!microsoftEmail) {
      return res.status(400).json({
        message: 'Email not found in Microsoft profile.',
        success: false,
      });
    }

    // Check if email exists in the database
    let student = await Student.findOne({ instituteMailId: microsoftEmail });

    if (!student) {
      return res.status(404).json({
        message: 'User not found. Please register first.',
        success: false,
      });
    }

    // Generate JWT token
    const tokenData = { userId: student._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

    req.user.token = token; // Attach token to req.user for redirect

     return res.status(200).json({
      message: `Welcome back, ${student.instituteMailId}!`,
      user: {
        _id: student._id,
        fullname:student.fullname,
          instituteMailId:student.instituteMailId,
      },
      success: true,
    });
      // return res.redirect(`${process.env.FRONTEND_URL}/student`)
    

  } catch (error) {
    console.error('Error during authentication:', error);
    return res.status(500).json({
      message: 'Something went wrong during authentication.',
      success: false,
    });
  }
};

export const logout = async(req,res)=>{
  try {
    return res.status(200).cookie("token","",{maxAge:0}).json({
      message:"Logged out Successfully",
      success:true
  })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}

export const getCourses= async(req,res)=>{
  try {
    const studentid=req.params.id;

    const student= await Student.findById(studentid);

    if(!student){
      return res.status(404).json({
        message:"Student Not found",
        success:false
      })
    }

    let courses= [];

    await Promise.all(
      student.coursesOpted.map(async(id)=>{
        const course= await Courses.findById(id);
        if(course)courses.push(course.courseCode);
      })
    )

    return res.status(200).json({
      message:"Courses found",
      courses:courses,
      success:true
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
    
  }
}

export const getSchedule= async(req,res)=>{
  try {
    const studentId=req.params.id;
   
    
    const student= await Student.findById(studentId).populate("coursesOpted");

    let schedule=[];
    let extraClass=[];
    let labTiming=[];
    let haslab=false;
    student.coursesOpted.forEach((course)=>{
      course.classTiming.forEach(time=>{
        schedule.push({
          day:time.day,
          time:time.time,
          _id:time._id,
          courseCode:course.courseCode
        });
      })
      course.extraClass.forEach(time=>{
        extraClass.push({
          date:time.date,
          time:time.time,
          _id:time._id,
          courseCode:course.courseCode
        });
      })

      if(course.hasLab){
        haslab=true;
        course.labTiming.forEach(time=>{
          labTiming.push({
            day:time.day,
            startTime:time.startTime,
            endTime:time.endTime,
            _id:time._id,
            courseCode:course.courseCode
          });
        })
      }
    })

 

    return res.status(200).json({
      message:"Schedule Fetched Successfully",
      success:true,
      schedule:{
        classTime:schedule,
        extraClass:extraClass,
        hasLab:haslab,
        labTiming:labTiming
      }
    })
    
    
  } catch (error) {
    console.log("Error While Fetching Schedule");
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
    
  }
}

export const getUploadedPdf = async (req, res) => {
    try {
      const { courseCode } = req.params;
  
      // Find the course by courseCode
      const course = await Courses.findOne({ courseCode });
  
      if (!course) {
        return res.status(404).json({
          message: "Course not found.",
          success: false,
        });
      }
  
  
      return res.status(200).json({
        message: "Course pdf retrieved successfully.",
        uploadedPdf: course.uploadedPdf,
        success: true,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "An error occurred while retrieving the pdf.",
        success: false,
      });
    }
  };


// -----------------------------------------------frontend Code For student view pdf--------------------------
//   import React, { useState, useEffect } from "react";
// import axios from "axios";

// const ViewPdf = ({ courseCode }) => {
//   const [pdfUrl, setPdfUrl] = useState("");
//   const [message, setMessage] = useState("");

//   // Fetch the PDF URL for the course
//   useEffect(() => {
//     const fetchPdf = async () => {
//       try {
//         const response = await axios.get(`/api/v1/courses/${courseCode}/pdf`);
        
//         if (response.data.success) {
//           setPdfUrl(response.data.pdfUrl); // Assume pdfUrl is returned from the backend
//         } else {
//           setMessage("No PDF available for this course.");
//         }
//       } catch (error) {
//         console.error("Error fetching PDF:", error);
//         setMessage("An error occurred while fetching the PDF.");
//       }
//     };

//     fetchPdf();
//   }, [courseCode]);

//   return (
//     <div>
//       <h3>PDF for Course: {courseCode}</h3>
//       {pdfUrl ? (
//         <div>
//           <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
//             <button>Download PDF</button>
//           </a>
//         </div>
//       ) : (
//         <p>{message}</p>
//       )}
//     </div>
//   );
// };

// export default ViewPdf;


// -------------------------------------------------------------------------------------------------

export const getcourseDetails= async(req,res)=>{
  try {
    const {courseCode}= req.params;

    const course= await Courses.findOne({courseCode})

    if(!course){
      return res.status(404).json({
        message:"Course Not Found",
        success:false
      })
    }

    const student= await Student.findById(req.id);
    
    
    let courseAttendance;

    student.courseAttendance.forEach(obj=>{
      if((course._id).equals(obj.course))courseAttendance=obj.attendance;
    })
    
    
    let professorlst=[];

    await Promise.all(
      course.professor.map(async(id)=>{
        const professor=await Professor.findById(id);
        if(professor?.fullname)professorlst.push(professor?.fullname)
      })
    )

    let courseDetails={
      courseCode:courseCode,
      courseAttendance:courseAttendance,
      professor:professorlst,
      courseName:course.name
    }

    return res.status(200).json({
      message:"course details fetched successfully",
      courseDetails:courseDetails,
      success:true
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
  }
}


export const getAttendance= async(req,res)=>{
  try {
    const studentId= req.params.id;

    const student= await Student.findById(studentId);

    if(!student){
      return res.status(404).json({
        message:"Student not Found",
        success:false
      })
    }
    let modifiedcoursesAttendance=[];

    await Promise.all(
      student.courseAttendance.map(async(obj)=>{
        const course= await Courses.findById(obj.course);
        modifiedcoursesAttendance.push({
          course:course.courseCode,
          courseName:course.name,
          attendance:obj.attendance,
          lastUpdated:obj.lastUpdated
        })
      })
    )

    return res.status(200).json({
      courseAttendance:modifiedcoursesAttendance,
      message:"Fetched Attendance Successfully",
      success:true
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
    
  }
}

export const changePassword= async(req,res)=>{
  try {
    const {password}=req.body;

    if(!password){
      return res.status(400).json({
        message:"Please enter the Password",
        success:false,
      })
    }

    const studentId= req.id;

    const student=await Student.findById(studentId);

    if(!student){
      return res.status(404).json({
        message:"Student not Found",
        success:false
      })
    }

    const hashedPassword= await bcrypt.hash(password,10);

    student.password=hashedPassword;

    await student.save();

    return res.status(200).json({
      success:true,
      message:"Password Updated Successfully"
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const getPattern= async(req,res)=>{
  try {
    const {courseCode}= req.params;

    const course= await Courses.findOne({courseCode});

    if(!course){
      return res.status(404).json({
        message:"Course Not Found",
        success:false
      })
    }

    return res.status(200).json({
      message:"Pattern Fetched Successfully",
      pattern:course.pattern,
      success:true
    })

  } catch (error) {
    console.log("Error While Getting Pattern");
    return res.status(500).json({
      message:"Internal Server Error",
      success:false
    })
    
  }
}

export const getProfessorDetails= async(req,res)=>{
  try {
    const {courseCode}= req.params;

    const course= await Courses.findOne({courseCode});

    if(!course){
      return res.status(404).json({
        message:"Course Not Found",
        success:false
      })
    }

    const professor= await Professor.find({courses : {$elemMatch:{$eq:course._id}}})

    if(!professor){
      return res.status(404).json({
        message:"professors not found",
        success:false
      })
    }

    let professorDetails=[]

    professor.forEach(prof=>{
      let details={
        fullname:prof.fullname,
        instituteMailId:prof.instituteMailId,
        number:prof.number
      }
      professorDetails.push(details);
    })

    return res.status(200).json({
      message:"Fetched professor details",
      professorDetails,
      success:true
    })
  } catch (error) {
   console.log("Error While fetching professor details");
    return res.status(500).json({
      message:"Internal server error",
      success:false
    })
  }
}

export const getmarks = async (req, res) => {
  try {
    const { courseCode } = req.params;
    
    // Use `findOne` instead of `find`
    const course = await Courses.findOne({ courseCode });
    
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false
      });
    }

    const courseid = course._id;
    const studentid = req.id;
    const student = await Student.findById(studentid);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        success: false
      });
    }
    
    const courseMarks = student.marks.find((item) => item.course.equals(courseid));

    if (!courseMarks) {
      return res.status(404).json({
        message: "No marks found for this course",
        success: false
      });
    }

    let finalmarks = [];

    courseMarks.mark.forEach((it) => {
      const patternMatch = course.pattern.find((ele) => ele._id.equals(it.patternid));

      if (patternMatch) {
        finalmarks.push({
          name: patternMatch.name,
          weightage: patternMatch.weightage,
          mark: it.marks,
          lastUpdated:it.lastUpdated
        });
      }
    });

    return res.status(200).json({
      message: "Marks Extracted Successfully",
      success: true,
      marks: finalmarks
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};


  