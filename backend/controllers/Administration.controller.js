import { Student } from "../models/student.model.js";
import { Professor } from "../models/Professor.model.js";
import { Administration } from "../models/Administration.model.js";
import { Courses } from "../models/Courses.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register=async(req,res)=>{
    try {
        const {email,secretCode,password}=req.body;
     
        
       
        if( !email || !password || !secretCode){
            return res.status(400).json({
                message:"All the fields are not Filled",
                success:false
            })
        }
        
        
        if(secretCode!=process.env.SECRET_CODE){
            return res.status(400).json({
                message:"Incorrect Secret Key",
                success:false
            })
        }

        const administrater=await Administration.findOne({email});

        if(administrater){
            return res.status(400).json({
                message:"user already Exist",
                success:false
            })
        }
        const hashedPassword= await bcrypt.hash(password,10);

        await Administration.create({
            email,
            password:hashedPassword,
        })

        return res.status(200).json({
            message:"Account created Successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}

export const login=async(req,res)=>{
    try {

        
        const {email,password}=req.body;
        if(!email || !password ){
            return res.status(400).json({
                message:"All the fields are not Filled",
                success:false
            })
        }

        const sanitizedEmail = String(email).trim().toLowerCase();
        
        const sanitizedPassword = String(password).trim();

        let administrater= await Administration.findOne({email:sanitizedEmail});

        if(!administrater){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false
            })
        }

        const isPasswordMatched= await bcrypt.compare(sanitizedPassword,administrater.password);

        if(!isPasswordMatched){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false
            })
        }


        const tokenData={
            userId:administrater._id
        }
        const token=await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

        administrater={
            _id:administrater._id,
            email:administrater.email,
        }

        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
            message:`Welcome back!! `,
            user:administrater,
            success:true
        })

    } catch (error) {
        console.log(error);
        
    }
}

export const microsoftLogin = async (req, res) => {
    try {
      // Extract the email from the Microsoft profile
      const microsoftEmail = req.user.emails[0]?.value;
  
      if (!microsoftEmail) {
        return res.status(400).json({
          message: "Email not found in Microsoft profile.",
          success: false,
        });
      }
  
      // Check if this email exists in the database
      let administrater = await Administration.findOne({ email: microsoftEmail });
  
      if (!administrater) {
        return res.status(404).json({
          message: "User not found. Please register first.",
          success: false,
        });
      }
  
      // Generate JWT token for the user
      const tokenData = {
        userId: administrater._id,
      };
      const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });
  
      // Prepare user data for response
      administrater = {
        _id: administrater._id,
        email: administrater.email,
      };
  
      // Send the token as a cookie and user details in the response
      return res
        .status(200)
        .cookie("token", token, {
          maxAge: 1 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          sameSite: "strict",
        })
        .json({
          message: `Welcome back, ${administrater.email}!`,
          user: administrater,
          success: true,
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Something went wrong during the authentication process.",
        success: false,
      });
    }
  };

export const logout= async (req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"Logged out Successfully",
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
}


export const registerStudent=async (req,res)=>{
    try {
        const {fullname,rollNo,password,instituteMailId,number,coursesOpted}=req.body;

        if(!fullname || !rollNo || !password || !instituteMailId || !number || !coursesOpted){
            return res.status(400).json({
                message:"All the fields are not Filled",
                success:false
            })
        }


        let student= await Student.findOne({rollNo});

        if(student){
            return res.status(400).json({
                message:"Student with same Roll No. Already exist",
                success:false
            })
        }
        student=await Student.findOne({instituteMailId});

        if(student){
            return res.status(400).json({
                message:"Student With same Institute Mail ID already Exist",
                success:true
            })
        }
        
        
        let courseObjectIds = [];
        let courselst=[]
        if (coursesOpted) {
        courseObjectIds = await Courses.find({ courseCode: { $in: coursesOpted } });
        if (courseObjectIds.length !== coursesOpted.length) {
            return res.status(400).json({
            message: 'One or more courses not found.',
            success: false
            });
        }
        }
        
        courseObjectIds.forEach(course=>{
            courselst.push(course._id);
        })

        

        
        const hashedPassword= await bcrypt.hash(password,10);

        let courseAttendance=[];
        let marks=[];
        courselst.map((id)=>{
            courseAttendance.push({course:id,attendance:100});
            marks.push({
                course:id,
                mark:[]
            })
        })
        
        
        await Student.create({
            fullname,
            number,
            instituteMailId,
            password:hashedPassword,
            rollNo,
            coursesOpted:courselst,
            courseAttendance,
            marks:marks
        })
        
        student= await Student.findOne({rollNo});

        await Promise.all(
            courselst.map(async (id)=>{
                 const course= await Courses.findById(id);
                 course.students.push(student._id);
                 await course.save();
            })
         );


        return res.status(200).json({
            message:"Student Account Created Successfully",
            success:true,
        })

    } catch (error) {
        console.log(error);
        
    }
}

export const updateStudentDetails= async (req,res)=>{
    try {
        const {fullname,rollNo,instituteMailId,number,coursesOpted}=req.body;
        const studentid= req.params.id;

        let courselst=[];
        
        if(coursesOpted){
            let courseObjectIds = [];
            if (coursesOpted) {
            courseObjectIds = await Courses.find({ courseCode: { $in: coursesOpted } });
            if (courseObjectIds.length !== coursesOpted.length) {
                return res.status(400).json({
                message: 'One or more courses not found.',
                success: false
                });
            }
            }

            courseObjectIds.forEach(course=>{
                courselst.push(course._id)
            })
        }


        // adding student in new courses 
        await Promise.all(
            courselst.map(async(id)=>{
                const course= await Courses.findById(id);

                const isPresent = course.students.some((existingId) =>
                    existingId.equals(studentid)
                );
                if(!isPresent){
                course.students.push(studentid);
                }
                await course.save();
            })
        )

        //all courses which contains student
        const courses = await Courses.find({
            students: studentid // Matches courses where `studentId` exists in the `students` array
        });

        //will clear the student id from courses which are not opted
        await Promise.all(
            courses.map(async(course)=>{
                const courseid=course._id;
                let isPresent=courselst.some(id=>id.equals(courseid));
                if(!isPresent){
                    course.students=course.students.filter(id=> !id.equals(studentid));
                    await course.save();
                }
            })
        )

        let student = await Student.findById(studentid);

        if(!student){
            return res.status(400).json({
                message:`Student Not found`,
                success:false
            })
        }

        if(fullname)student.fullname=fullname;
        if(instituteMailId)student.instituteMailId=instituteMailId;
        if(number)student.number=number;
        if(rollNo)student.rollNo=rollNo;
        if(coursesOpted)student.coursesOpted=courselst;

        await student.save();

        return res.status(200).json({
            message:"profile updated successfully",
            success:true,
            student
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating student", error: error.message });
        
    }
}

export const deleteStudentProfile= async(req,res)=>{
    try {
        const studentid= req.params.id;
        
        const student= await Student.findById(studentid);

        if(!student){
            return res.status(404).json({
                message:"Student not found",
                success:false
            })
        }

       
        const coursesId=student.coursesOpted;

        await Promise.all(
            coursesId.map(async (id) => {
                const course = await Courses.findById(id);
                if (course) {
                    course.students = course.students.filter((stid) => !stid.equals(studentid));
                    await course.save();
                }
            })
        );

        await Student.findByIdAndDelete(studentid);

        return res.status(200).json({
            message:"Student Profile deleted Successfully",
            success:true,
        })

    } catch (error) {
        console.error("Error deleting student profile:", error);
        return res.status(500).json({
            message:"Internal server Error",
            success:false
        })
        
    }
}

export const registerProfessor= async (req,res)=>{
    try {
        const {fullname,instituteMailId,password,profCode,number,courses}= req.body;

        if(!fullname || !instituteMailId || !password || !profCode || !number || !courses){
            return res.status(400).json({
                message:"All the fields are not Filled",
                success:false
            })
        }

        let professor= await Professor.findOne({profCode});
        if(professor){
            return res.status(400).json({
                message:"Profcode used Earlier",
                success:false
            })
        }

        professor=await Professor.findOne({instituteMailId});
        if(professor){
            return res.status(400).json({
                message:"Institude Mail Id Used Earlier",
                success:false
            })
        }

        let courseObjectIds = [];
        
        courseObjectIds = await Courses.find({ courseCode: { $in: courses } });
        console.log(courses);
        
        if (courseObjectIds.length !==courses.length) {
            return res.status(400).json({
            message: 'One or more courses not found.',
            success: false
            });
        
        }

        let coursesId=[]

        courseObjectIds.forEach(course=>{
            coursesId.push(course._id)
        })


        const hashedPassword=await bcrypt.hash(password,10);

        

        await Professor.create({
            fullname,
            instituteMailId,
            password:hashedPassword,
            profCode,
            courses:coursesId,
            number
        })

       professor= await Professor.findOne({profCode});

        await Promise.all(
            courses.map(async (courseCode)=>{
                 const course= await Courses.findOne({courseCode});
                 course.professor.push(professor._id);
                 await course.save();
            })
         );
        

         return res.status(200).json({
            message:"Profile created Successfully",
            success:true,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server Error",
            success:false
        })
    }
}

export const updateProfessorDetails= async (req,res)=>{
    try {
        const {fullname,instituteMailId,profCode,number,courses}= req.body;
        const professorid= req.params.id;

        let courseObjectIds = [];

        if(courses){
            courseObjectIds = await Courses.find({ courseCode: { $in: courses } });
            if (courseObjectIds.length !==courses.length) {
                return res.status(400).json({
                message: 'One or more courses not found.',
                success: false
                });
            
            }
        }

        let coursesId=[]

        courseObjectIds.forEach(course=>{
            coursesId.push(course._id)
        })
        
        
        await Promise.all(
            coursesId.map(async(id)=>{
                const course= await Courses.findById(id);

                let isPresent =false;
                course.professor.map((existingId) =>
                    isPresent|=existingId.equals(professorid)
                );
                
                if(!isPresent){
                course.professor.push(professorid);
                }
                await course.save();
            })
        )

        //all courses which contains professor
        const oldcourses = await Courses.find({
            professor:professorid //
        });

        //will clear the student id from courses which are not opted
        await Promise.all(
            oldcourses.map(async(course)=>{
                const courseid=course._id;
                let isPresent=coursesId.some(id=>id.equals(courseid));
                if(!isPresent){
                    course.professor=course.professor.filter(id=> !id.equals(professorid));
                    await course.save();
                }
            })
        )
        

        let professor= await Professor.findById(professorid);

        if(!professor){
            return res.status(400).json({
                message:"Profile Not Found",
                success:false,
            })
        }

        if(fullname)professor.fullname=fullname;
        if(instituteMailId)professor.instituteMailId=instituteMailId;
        if(number)professor.number=number;
        if(profCode)professor.profCode=profCode;
        if(courses)professor.courses=coursesId

        await professor.save();

        return res.status(200).json({
            message:"profile updated successfully",
            success:true,
            professor
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server Error",
            success:false
        })
    }
}

export const deleteProfessorProfile= async(req,res)=>{
    try {
        const professorid=req.params.id;

        const professor=await Professor.findById(professorid);

        if(!professor){
            return res.status(404).json({
                message:"Professor profile not found",
                success:false
            })
        }
        const profcode=professor.profCode;
        const courses= professor.courses;

        let courselst= []

        await Promise.all(
            courses.map( async (id)=>{
                const tpco=await Courses.findById(id);
                courselst.push(tpco.courseCode);
            })
        )

        await Promise.all(
            courselst.map(async (courseCode)=>{
                const course= await Courses.findOne({courseCode});
                course.professor=(course.professor || []).filter((pfid)=>!pfid.equals(professorid));
                await course.save();
            })
        );

        await Professor.findByIdAndDelete(professorid);

        return res.status(200).json({
            message:"Professor Profile deleted Successfully",
            success:true
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server Error",
            success:false
        })
        
    }
}

export const registerCourse=async(req,res)=>{
    try {
        const { name, courseCode, classTiming,hasLab,labTiming } = req.body;
        
        
        if(!name || !courseCode || !classTiming){
            return res.status(400).json({
                message:"All Fields should be filled",
                success:false
            })
        }

        if(hasLab && !Array.isArray(labTiming) || !labTiming.every(ct => ct.day && ct.startTime && ct.endTime )){
            return res.status(400).json({ message: "Invalid labTiming format" });
        }

        if (!Array.isArray(classTiming) || !classTiming.every(ct => ct.day && ct.time)) {
            return res.status(400).json({ message: "Invalid classTiming format" });
        }

        let course = await Courses.findOne({courseCode});

        if(course){
            return res.status(400).json({
                message:"Code used Already",
                success:false
            })
        }
        let modifiedlabTiming=labTiming
        if(!hasLab){
            modifiedlabTiming=[]
        }
        
        
        let pattern=[];
        await Courses.create({
            name,
            courseCode,
            professor:[],
            students:[],
            hasLab,
            labTiming:modifiedlabTiming,
            classTiming,
            pattern
        });

        return res.status(200).json({
            message:"Course Added Successfully",
            success:true,
            course:{name:name,courseCode:courseCode,classTiming:classTiming,hasLab:hasLab,labTiming:modifiedlabTiming}
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal Server error",
            success:false
        })
    }
}

export const getStudents = async (req, res) => {
    try {
      
  
        const students = await Student.find();

        let modifiedStudents = [];
        
        for (const std of students) {
          let modifiedCourseOpted = [];
        
          // Use `Promise.all` to fetch all courses concurrently
          modifiedCourseOpted = await Promise.all(
            std.coursesOpted.map(async (id) => {
              const course = await Courses.findById(id);
              return course?.courseCode || null; // Return courseCode or null if not found
            })
          );
        
          // Filter out any null values
          modifiedCourseOpted = modifiedCourseOpted.filter((courseCode) => courseCode);
        
          // Add to modifiedStudents
          modifiedStudents.push({
            fullname: std?.fullname,
            rollNo: std?.rollNo,
            instituteMailId: std?.instituteMailId,
            _id: std._id,
            coursesOpted: modifiedCourseOpted,
            number:std?.number
          });
        }
     
  
      // Return the details of the students
      return res.status(200).json({
        success: true,
        students:modifiedStudents,
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  export const getCourses = async (req, res) => {
    try {
      
  
      // Find students who have opted for the given course
      const courses = await Courses.find();
      

      if(!courses){
        console.log("Printing");
        
        return res.status(200).json({
            success:true,
            courses:[]
        })
      }
  
      let modifiedCourses=[];
  
      courses.map(cr=>{
        modifiedCourses.push({
          name:cr?.name,
          courseCode:cr?.courseCode,
            _id:cr._id,
            classTiming:cr?.classTiming,
            hasLab:cr?.hasLab,
            labTiming:cr?.labTiming
        })
      })
  
  
      // Return the details of the students
      return res.status(200).json({
        success: true,
        courses:modifiedCourses,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  export const getProfessor = async (req, res) => {
    try {
    
      // Find students who have opted for the given course
      const prof = await Professor.find();
  
      let modifiedprof=[];

      for (const std of prof) {
        let modifiedCourse = [];
      
        // Use `Promise.all` to fetch all courses concurrently
        modifiedCourse = await Promise.all(
          std.courses.map(async (id) => {
            const course = await Courses.findById(id);
            return course?.courseCode || null; // Return courseCode or null if not found
          })
        );
      
        // Filter out any null values
        modifiedCourse = modifiedCourse.filter((courseCode) => courseCode);
      
        // Add to modifiedprof
        modifiedprof.push({
          fullname: std?.fullname,
        profCode: std?.profCode,
          instituteMailId: std?.instituteMailId,
          _id: std._id,
          courses: modifiedCourse,
          number:std?.number
        });
      }
  
     
  
      // Return the details of the students
      return res.status(200).json({
        success: true,
        professor:modifiedprof,
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  

export const updateCouseDetails= async (req,res)=>{  // may be adding student,professor
    try {
        const { name, courseCode, professor, students, classTiming,hasLab,labTiming } = req.body;
        let courseid= req.params.id;

        if(classTiming){
            if (!Array.isArray(classTiming) || !classTiming.every(ct => ct.day && ct.time)) {
                return res.status(400).json({ message: "Invalid classTiming format",success:false });
            }
        }
        if(labTiming){
            if (!Array.isArray(labTiming) || !labTiming.every(ct => ct.day && ct.startTime && ct.endTime)) {
                return res.status(400).json({ message: "Invalid labTiming format",success:false });
            }
        }

        let studentObjectIds = [];

        if(students){
            studentObjectIds = await Student.find({ rollNo: { $in: students } });
            if (studentObjectIds.length !==students.length) {
                return res.status(400).json({
                message: 'One or more students not found.',
                success: false
                });
            
            }
            
        }

        let studentId=[];

        studentObjectIds.forEach(students=>{
            studentId.push(students._id);
        })

        let professorObjectIds = [];

        if(professor){
            professorObjectIds = await Professor.find({ profCode: { $in: professor } });
            if (professorObjectIds.length !==professor.length) {
                return res.status(400).json({
                message: 'One or more professors not found.',
                success: false
                });
            
            }
        }

        let professorid=[]

        professorObjectIds.forEach(prof=>{
            professorid.push(prof._id);
        })
        
        let course= await Courses.findById(courseid);
        

        if(!course){
            return res.status(400).json({
                message:"Course Not Found",
                success:false
            })
        }

        let modifiedlabtiming=labTiming;
        if(!hasLab){
            modifiedlabtiming=[];
        }

        if(name)course.name=name;
        if(courseCode)course.courseCode=courseCode;
        if(professor)course.professor=[...course.professor,professorid];
        if(students)course.students=[...course.students,studentId];
        if(classTiming)course.classTiming=classTiming;
        if(labTiming)course.labTiming=modifiedlabtiming;
        if(hasLab)course.hasLab=hasLab;

        await course.save();

        return res.status(200).json({
            message:"Course Updated Successfully",
            success:true,
            course
        })

    } catch (error) {
        console.log(error);
        
    }
}

export const deleteCourse= async(req,res)=>{
    try {
        const courseId=req.params.id;

        const course=await Courses.findById(courseId);
        
        
        if(!course){
            return res.status(404).json({
                message:"Course Not found",
                success:false
            })
        }

        const students= course.students;
        
        await Promise.all(
            students.map(async(id)=>{
                const tpst=await Student.findById(id);
                tpst.coursesOpted=tpst.coursesOpted.filter(id=>!id.equals(courseId));
                tpst.courseAttendance= tpst.courseAttendance.filter(obj=> !obj.course.equals(courseId));
                await tpst.save();
            })
        )

        const professor=course.professor;
     
        await Promise.all(
            professor.map(async(id)=>{
                const professor=await Professor.findById(id);
                professor.courses=professor.courses.filter((crid)=>!crid.equals(courseId));
                await professor.save();
            })
        )

        await Courses.findByIdAndDelete(courseId);

        return res.status(200).json({
            message:"Course Deleted Successfully",
            success:true
        })

    } catch (error) {
        console.log("Error While deleting Course");
        return res.status(500).json({
            message:"Internal Server error",
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

    const adminId= req.id;

    const admin=await Administration.findById(adminId);

    const hashedPassword= await bcrypt.hash(password,10);

    admin.password=hashedPassword;

    await admin.save();

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

