import mongoose from "mongoose";

const professorSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    instituteMailId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profCode:{
        type:String,
        required:true,
        unique:true,
    },
    number:{
        type:String,
        required:true,
        unique:true,
    },
    courses:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses', // Reference the Courses schema
        required: true
    }]
})

export const Professor = mongoose.model('Professor', professorSchema);