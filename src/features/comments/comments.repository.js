import commentModel from "./comments.schema.js";

export default class commentRepository{

    async add(postId, userId, content){
       try{ const comment = new commentModel({postId, userId, content});
        await comment.save();
        return comment;
    }
    catch(err){
        console.log(err);
        return false;
    }

}


    async get(postId){
try
       { const comment = await commentModel.find({postId : postId});
        return comment;}
catch(err){
    console.log(err);
    return false
}
    }


    async update(commentId, userId, content){
    try{    const comment = await commentModel.findOneAndUpdate({userId: userId, _id:commentId },
        {
            $set:{
                content : content
            },},
            { new:true }
        );

        await comment.save();
        return comment;
    }
    catch(err){
        console.log(err);
        return false
    }
}

    async delete(commentId, userId){
try
{
    const comment = await commentModel.findOneAndDelete({
    _id: commentId,
    userId: userId
}); if(comment){
    return true;}
else 
{return false;
}
}
    catch(err){
        console.log(err);
        return false
    }

}

async getCommentById(commentId) {
    try {
        const comment = await commentModel.findById(commentId)
        if(comment)
            return { success: true, res: comment }
        else 
            return { 
                success: false, 
                error: {
                    statusCode: 400, 
                    message: 'Comment not found' 
                }
            }
    } catch (error) {
        console.log("Error: "+ error)
        return { success: false, error: { statusCode: 400, message: error } }
    }
}

}

  