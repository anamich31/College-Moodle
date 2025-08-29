import mongoose from "mongoose";

const studentSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    rollNo:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    instituteMailId:{
        type:String,
        required:true,
        unique:true,
    },
    number:{
        type:String,
        required:true
    },
    coursesOpted:[{
       type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses', // Reference the Courses schema
        required: true
        
    }],
    courseAttendance:[{
        course:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Courses', // Reference the Courses schema
        },
        attendance:{
            type:Number
        },
        lastUpdated: {  //YYYY-MM-DDTHH:mm:ss.sss   T is separator And Z is endpoint
            type: Date,
            default: Date.now // Automatically set the current time when created
        }
    }],
    marks:[{
        course:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Courses',
        },
        mark:[{
            patternid:{
                type:mongoose.Schema.Types.ObjectId,
            },
            marks:{
                type:Number,
                default:0
            },
            lastUpdated: {  //YYYY-MM-DDTHH:mm:ss.sss   T is separator And Z is endpoint
                type: Date,
                default: Date.now // Automatically set the current time when created
            }
        }]
    }]
})

export const Student = mongoose.model('Student', studentSchema);