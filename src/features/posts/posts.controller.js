import postRepository from "./posts.repository.js";
import ApplicationError from "../../middleware/error.middleware.js"
import { loggedInId, loggedInUser } from "../../middleware/jwt.middleware.js";
import multer from 'multer'
import { application } from "express";


export default class postController{
    constructor(){
        this.repository = new postRepository()
    }


    async create(req,res){
       try{
        const userId = loggedInId;
        const caption = req.body.caption;
        const imageUrl = req.file.filename;
        const postData = {caption, imageUrl, userId};
        const newPost = await this.repository.create(postData);
        newPost.save();
    
        res.status(201).send(`New post created`);
    }catch(err){
        res.status(500).send(err.message);
    }
    }
    async get(req,res){
        try{
            const {id} = req.params;
            const post = await this.repository.get(id);
            
            
            if(post !== 0){
            res.status(200).send(post);
        } else
    {res.status(404).send("Post not found")}
    
    }
        catch(err){
            res.status(500).send(err.message);
        }
    }

    async getAll(req,res){
        try{
            const post = await this.repository.getAll();
            res.status(200).send(post);

        } catch(err){
            res.status(500).send(err.message);
        }
    }

    async getByUser(req,res){
        try{
            const id = loggedInId
            const post = await this.repository.getByUser(id);
            res.status(200).send(post)

        }catch(err){
            res.status(500).send(err.message);
        }
    }

    async delete(req,res){
        try{
            const userId = loggedInId;
            const {id} = req.params;


            const post = await this.repository.delete(userId, id);
            if(post != -1){
            res.status(200).send("Post Deleted");
            }
            else{
                throw new ApplicationError("Post doesnt exists",404)
            }
            


        }catch(err){
            res.status(err.status || 500).send(err.message);
        }
    }


    async update(req,res){
        try{
            const userId = loggedInId;
            const {id} = req.params;
            const caption = req.body.caption;
            const imageUrl = req.file.filename;
            const postData = {caption, imageUrl}
            const post = await this.repository.update(postData, userId, id);
            if(post != -1){
                res.status(200).send("Post Updated");
                }
                else{
                    throw new ApplicationError("Post doesnt exists",404)
                }


        }catch(err){
            res.status(err.status || 500).send(err.message);
        }
    }
}