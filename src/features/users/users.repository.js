import { userModel } from "./users.schema.js";
import ApplicationError from "../../middleware/error.middleware.js"
import bcrypt from 'bcrypt';
import { ObjectId } from "bson";


export default class userRepository{
    
    async signUp(userDetails){
        try{
            const newUser = new userModel(userDetails);
            const hashedPass = await bcrypt.hash(newUser.password, 12);
            newUser.password = hashedPass;
            await newUser.save();
        }catch(err){
            console.log(err);
        }
    }


    async signIn(email, password) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new ApplicationError('User not found', 404);
            }
    
            const validatedUser = await bcrypt.compare(password, user.password);
            if (!validatedUser) {
                throw new ApplicationError('Incorrect password', 400);
            }
    
            return user;
        } catch (err) {
            throw new ApplicationError(`${err.message}`, err.status || 500);
        }
    }

    async logOut(email,token){
try{
    const user = await userModel.findOne({email});
    user.tokens = user.tokens.filter(t => t !== token); 
            await user.save();
    
}
catch (err) {
    throw new ApplicationError(`${err.message}`, err.status || 500);
}
    }


    async logOutofAll(email){
        try{
            const user = await userModel.findOne({email});
            user.tokens = [];
            await user.save();
        }
        catch(err){
            throw new ApplicationError(`${err.message}`, err.status || 500);
        }
    }


    async getDetails(email){
        try{
            const user = await userModel.find({email}, {tokens:0, password:0});
            return { success: true, res: user };
            
        } catch(err){
            throw new ApplicationError(`${err.message}`, err.status || 500);
        }
    }

    async getAllDetails(){
        try{
            const users = await userModel.find({}, {tokens:0, password:0});
            return users;
            
        } catch(err){
            throw new ApplicationError(`${err.message}`, err.status || 500);
        }
    }

    
    async updateUser(id, userDetails){
        try{ 
            const user = await userModel.findOneAndUpdate({_id : new ObjectId(id)},
            {
                $set:{
                    name: userDetails.name,
                    email: userDetails.email,
                    gender: userDetails.gender
                }
            }, {
                new: true
            });
            await user.save()
        }catch(err){
            throw new ApplicationError(`${err.message}`, err.status || 500);
        }
    }

    async updatePassword(emailId, newPassword) {
        try {
            const updatedUser = await userModel.findOneAndUpdate(
                { email: emailId },
                {
                    $set: {
                        password: newPassword
                    }
                },
                { new: true }
            )
            
            return { success: true, res: updatedUser } 
           
        } catch (error) {
            console.log("Error: "+ error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }


    

    }