import postModel from "./posts.schema.js";

export default class postRepository{

    async create(imageDetails){
        const post = new postModel(imageDetails);
       await post.save();
        return post;
    }

    async get(id){
        const post =await postModel.findById(id);
        return post;
    }

    async getAll(){
        const post = await postModel.find({});
        return post;
    }

    async getByUser(id){

        const post = await postModel.find({userId: id});
        return post;

    }

    async delete(userId , postId){
        const post = await postModel.findOne({_id: postId, userId:userId});
if(post){
        await postModel.findOneAndDelete({_id: postId, userId:userId});
}
else{
    return -1;
}

        
    }


    async update(postData, userId, postId){
        const post = await postModel.findOne({_id:postId, userId: userId});

        if(post){
            await postModel.findOneAndUpdate({_id:postId, userId: userId},
            {
                $set:{
                    caption : postData.caption,
                    imageUrl : postData.imageUrl
                }
            },
        {new:true});
        await post.save();
        return post
        }
        else{
            return -1;
        }
    }


}