import express from 'express';
import userController from './users.controller.js';
import jwtAuth from '../../middleware/jwt.middleware.js';
const userRouter = express.Router();

const userControllerInstance = new userController();

userRouter.post('/signup',(req,res)=>{
    userControllerInstance.signUp(req,res);
});

userRouter.post('/signin',(req,res)=>{
    userControllerInstance.signIn(req,res);
});

userRouter.get('/logout',jwtAuth,(req,res)=>{
    userControllerInstance.logOut(req,res)});

userRouter.get('/logout-all-devices',jwtAuth,(req,res)=>{
    userControllerInstance.logOutOfAllDevices(req,res)});


userRouter.get('/get-details',(req,res)=>{
    userControllerInstance.getDetails(req,res)
});

userRouter.get('/get-all-details',jwtAuth,(req,res)=>{
    userControllerInstance.getAllDetails(req,res)});

    userRouter.put('/update-details/:id',jwtAuth,(req,res)=>{
        userControllerInstance.updateUser(req,res)});

export default userRouter;