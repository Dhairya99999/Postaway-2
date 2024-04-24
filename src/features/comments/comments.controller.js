import ApplicationError from "../../middleware/error.middleware.js";
import commentRepository from "./comments.repository.js";
import { loggedInId } from "../../middleware/jwt.middleware.js";

export default class commentController {
    constructor() {
        this.repository = new commentRepository();
    }

    async add(req, res) {
        try {
            const { postId } = req.params;
            const userId = loggedInId;
            const { content } = req.body;

            const comment = await this.repository.add(postId, userId, content);
            
            if (comment) {
                return res.status(201).send(`Comment "${comment.content}" has been added to the post ${postId}`);
            } else {
                throw new ApplicationError("Post not found", 404);
            }
        } catch (err) {
            if (err instanceof ApplicationError) {
                return res.status(404).send(err.message);
            } else {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        }
    }

    async get(req,res){
     try{   const {postId} = req.params;
        const comments = await this.repository.get(postId);
        if(comments){
            return res.status(200).send(comments);
        }
        else{
            throw new ApplicationError("Post not found",404)
        }
}
        catch (err) {
            if (err instanceof ApplicationError) {
                return res.status(err.status).send(err.message);
            } else {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        }
    }


    async delete(req,res){
        try{
            const { commentId } = req.params;
            const userId = loggedInId;
            const comment = await this.repository.delete(commentId, userId);
            if(comment){
                return res.status(200).send("comment has been deleted");
            }
            else{
                throw new ApplicationError("comment not found",404)
            }

        }
        catch (err) {
            if (err instanceof ApplicationError) {
                return res.status(404).send(err.message);
            } else {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        }
    }


    async update(req,res){
        try{
            const { commentId } = req.params;
            const userId = loggedInId;
            const { content } = req.body;

            const comment = await this.repository.update(commentId, userId, content);
            
            if (comment) {
                return res.status(201).send(`Comment has been updated.`);
            } else {
                throw new ApplicationError("Comment not found", 404);
            }


        }
        catch (err) {
            if (err instanceof ApplicationError) {
                return res.status(404).send(err.message);
            } else {
                console.error(err);
                return res.status(500).send("Internal Server Error");
            }
        }
    }




}
