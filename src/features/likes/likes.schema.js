import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'Users'
    },

    likable: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'on_model'
    },

    on_model: {
        type: String,
        enum: ['Posts', 'Comments']
    }
})

const likeModel = mongoose.model("Likes",likeSchema);
export default likeModel;