import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true },
    password:{type:String, required:true},
    gender:{type:String, enum:['Male','Female','Other'], required:true},
    tokens:[{
        type:String
    }]
});

export const userModel = mongoose.model('Users',userSchema);