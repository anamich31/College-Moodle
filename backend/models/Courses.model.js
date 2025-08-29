import mongoose from "mongoose";

const coursesSchema= new mongoose.Schema({
    courseCode:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // Reference the Student schema
    }],
    professor:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor', // Reference the Professor schema
    }],
    pattern:[{
        name: {
          type: String,
          enum: ['Quiz','Presentation', 'Mid-Sem Exam', 'End-Sem Exam'],
          
        },
        weightage: {
          type: Number,
        },
        note:{   // this will tell schedule
            type:String
        }
    }],
    uploadedPdf:[{
        url:{
          type:String
        } , // include notes,marks sheet and all
        name:{
          type:String
        }
    }],
    classTiming: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        required: true
      },
      time: {
        type: String,
        required: true,
        match: /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/ 
      }
      
    }],

    extraClass: [{
      date: {
        type: String,
        match: /^\d{2}-\d{2}-\d{4}$/ // Validates date format like "DD-MM-YYYY"
      },
      time: {
        type: String,
        match: /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/ // Validates time format like "10:30 AM"
      }
    }],

    hasLab:{
      type:Boolean,
      required:true,
    },

    labTiming: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      startTime: {
        type: String,
        match: /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/ 
      },
      endTime:{
        type:String,
        match: /^([0-9]{1,2}):([0-9]{2})\s?(AM|PM)$/ 
      }
      
    }],

})

export const Courses= mongoose.model('Courses', coursesSchema);