import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId:{type: mongoose.Schema.Types.ObjectId, ref:'Posts', required:true},
    userId:{type: mongoose.Schema.Types.ObjectId, ref:'Users', required:true},
    content:{type: String, required:true}
})

const commentModel = mongoose.model('Comments', commentSchema);

export default commentModel;