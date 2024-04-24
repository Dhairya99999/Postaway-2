import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    caption:{type:String, required:true },
    imageUrl:{type:String},
    userId: {type: mongoose.Schema.Types.ObjectId, ref:'Users'}
});

const postModel = mongoose.model('Posts', postSchema);

export default postModel;