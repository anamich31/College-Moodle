import mongoose from "mongoose";

const administrationSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

export const Administration= mongoose.model('Administration', administrationSchema);