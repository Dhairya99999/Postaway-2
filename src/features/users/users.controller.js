import userRepository from "./users.repository.js";
import ApplicationError from "../../middleware/error.middleware.js";
import JWT from 'jsonwebtoken';
import mongoose from "mongoose";
import { loggedInUser } from "../../middleware/jwt.middleware.js";

export default class userController{

    constructor(){ this.userRepository = new userRepository();
    }

    async signUp(req,res){

        const{name, email, password, gender} = req.body;
        const newUser = {name, email, password, gender};

        if(!newUser){
            throw new ApplicationError("Incorrect Credentials",400);
        }

        await this.userRepository.signUp(newUser);
        res.status(201).send("User Created");

    }

    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.signIn(email, password);
            if (!user) {
                throw new ApplicationError('Invalid Credentials', 400);
            }
    
            const token = JWT.sign({
                userID: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            });
    
            user.tokens.push(token);
            await user.save();
            res.status(200).send(`User logged in, the token is ${token}`);
        } catch (error) {
            res.status(error.status || 500).send({ message: error.message || 'Internal Server Error' });
        }
    }
    
    async logOut(req,res){


        
        if(!loggedInUser){
            throw new ApplicationError("You need to be logged in",400);
        }
        else{
          this.userRepository.logOut(loggedInUser,req.headers.authorization);
          req.headers.authorization = null;
            res.status(200).send("successfully logged out");
        }

    }


    async logOutOfAllDevices(req,res){
        if(!loggedInUser){
            throw new ApplicationError("You need to be logged in",400);
        }
        else{
          this.userRepository.logOutofAll(loggedInUser);
          res.status(200).send("successfully logged out of all devices");
        }
    }


    async getDetails(req,res){
        const {email} = req.body;

        try{
        const user = await this.userRepository.getDetails(email);
        if(user == 0){
            throw new ApplicationError("No matching details found",404);
        }
        else{
            res.status(200).send(user);
        }}
        catch(err){
            res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' });
        }
    }


    async getAllDetails(req,res){
        try{
            const user = await this.userRepository.getAllDetails();
            if(user == 0){
                res.status(404).send("No users exists");
            }
            res.status(200).send(user);
        }
        catch(err){
            res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' });
        }
    }

    async updateUser(req,res){
        try{
            const id = req.params;
            const{name, email, gender} = req.body;
            const updatedDetails = {name,email,gender};
            await this.userRepository.updateUser(id, updatedDetails);
            res.status(200).send(`The details have been updated`)


        }
        catch(err){
            res.status(err.status || 500).send({ message: err.message || 'Internal Server Error' });
        }
        
    }

}