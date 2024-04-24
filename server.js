//importing all libraries
import express from 'express';
import cookieParser from 'cookie-parser';
import swagger from 'swagger-ui-express';


//importing all files
import { connectUsingMongoose } from './src/config/mongoose.js';
import userRouter from './src/features/users/users.routes.js';
import ApplicationError from './src/middleware/error.middleware.js';
import postRouter from './src/features/posts/posts.routes.js';
import commentRouter from './src/features/comments/comments.routes.js';
import likeRouter from './src/features/likes/likes.router.js';
import friendshipRouter from './src/features/friendships/friendships.routes.js';
import otpRouter from './src/features/otp/otp.routes.js';
import loggerMiddleware from './src/middleware/logger.middleware.js';
import apiDocs from './swagger.json' assert {type:'json'}

//creating server
const server = express();

//swagger documentation
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs))
//json format
server.use(express.json());
//cookie-parser
// server.use(cookieParser);


//logging
server.use(loggerMiddleware);


//user Routes
server.use('/api/users',userRouter);
//posts routes
server.use('/api/posts',postRouter);
//comment routes
server.use('/api/comments', commentRouter);
//like routes
server.use('/api/likes', likeRouter);
//friendship routes
server.use('/api/friends', friendshipRouter);
//otp routes
server.use('/api/otp', otpRouter);




//error handler
server.use((err,req,res,next)=>{
    if(err instanceof ApplicationError){
        res.status(err.code).send(err.message);
    }
    else{
        res.status(500).send("Something went wrong please check out documentation at http://localhost:8000/api-docs/");
    }
})


//starting server
server.listen(8000,()=>{
    console.log("Server is running");
    connectUsingMongoose();
})



