import express from 'express';
import postController from './posts.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';
import { upload } from '../../middleware/file-upload.js'

const postInstance = new postController();

const postRouter = express.Router();

postRouter.post('/', jwtAuth ,upload.single('imageUrl'), (req,res)=>{
    postInstance.create(req,res);
});
postRouter.get('/all',jwtAuth, (req,res)=>{
    postInstance.getAll(req,res);
});
postRouter.get('/:id',jwtAuth, (req,res)=>{
    postInstance.get(req,res);
});

postRouter.get('/',jwtAuth, (req,res)=>{
    postInstance.getByUser(req,res);
});


postRouter.delete('/:id',jwtAuth, (req,res)=>{
    postInstance.delete(req,res);
})

postRouter.put('/:id', jwtAuth, upload.single('imageUrl'), (req,res)=>{
    postInstance.update(req,res);
})
export default postRouter;
