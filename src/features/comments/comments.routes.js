import express from 'express';
import commentController from "./comments.controller.js";
import jwtAuth from '../../middleware/jwt.middleware.js';

const commentInstance = new commentController();

const commentRouter = express.Router();

commentRouter.post('/:postId',jwtAuth ,(req,res)=>{
    commentInstance.add(req,res);
});

commentRouter.get('/:postId',jwtAuth ,(req,res)=>{
    commentInstance.get(req,res);
});

commentRouter.delete('/:commentId',jwtAuth ,(req,res)=>{
    commentInstance.delete(req,res);
});

commentRouter.put('/:commentId',jwtAuth ,(req,res)=>{
    commentInstance.update(req,res);
});

export default commentRouter;