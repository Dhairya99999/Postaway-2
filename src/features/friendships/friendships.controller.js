import friendshipRepository from "./friendships.repository.js";
import ApplicationError from '../../middleware/error.middleware.js'
import {loggedInId} from '../../middleware/jwt.middleware.js';

export default class friendshipController {

    constructor() {
        this.friendshipRepository = new friendshipRepository()
    }    

    // get friends of a specific user 
    async getFriends(req, res, next) {
        try {
            const userId = req.params.userId;
            const response = await this.friendshipRepository.getFriends(userId)

            if(response.success) {
                return res.status(200).send({ 
                    success: true,
                    message: 'friends fetched', 
                    friends: response.res,  
                })
            } else {
                return res.status(404).send({ 
                    success: false,
                    message: 'No friends found', 
                    friends: response.res,  
                })
            }

        } catch (error) {
            next(error)
        }
    }

    // get pending requests of a specific user
    async getPendingRequests(req, res, next) {
        try {
            const userId = loggedInId;
            const response = await this.friendshipRepository.getPendingRequests(userId)

            if(response.success) {
                return res.status(200).send({ 
                    success: true,
                    message: 'Pending requests fetched', 
                    pendingRequests: response.res,  
                })
            } else {
                return res.status(404).send({ 
                    success: false,
                    message: 'No pending requests found', 
                    pendingRequests: response.res,  
                })
            }

        } catch (error) {
            next(error)
        }
    }

    // toogle friendship status
    async toogleFriendship(req, res, next) {
        try {
            const friendId = req.params.friendId;
            const userId = loggedInId;
    
            const existingFriendship = await this.friendshipRepository.getFriendship(userId, friendId)

            if(existingFriendship.success) {

                // friendship exists, so delete friendship
                const delFrienship = await this.friendshipRepository.deleteFriendship(existingFriendship.res._id)

                if(delFrienship.success) {
                    return res.status(204).send({ 
                        success: true,
                        message: 'Friendship removed' ,
                        res: delFrienship.res
                    })
                } else {
                    throw new ApplicationError(delFrienship.error.message, delFrienship.error.statusCode)
                }
            } else {
                
                // friendship dosent exists, so send friend request (status pending)
                const sendRequest = await this.friendshipRepository.sendFriendRequest(userId, friendId)
                if(sendRequest.success) {
                    return res.status(201).send({ 
                        success: true,
                        message: 'Friend request sent' ,
                        res: sendRequest.res
                    })
                } else {
                    throw new ApplicationError(sendRequest.error.message, sendRequest.error.statusCode)
                }
            }           
        } catch (error) {
            next(error)
        }
    }

    // respond to a request
    async responseToRequest(req, res, next) {
        try {
            const friendId = req.params.friendId;
            const userId = loggedInId;
            const { response } = req.body; // 'accept' or 'reject'
    
            // swaped params fun call
            const pendingReq = await this.friendshipRepository.getOnePendingRequest(userId, friendId)

            if(pendingReq.success) {

                // update the status as per the response
                if (response === 'accept') {

                    const result = await this.friendshipRepository.updateStatus(userId, friendId, 'accepted')

                    if(result.success) {
                        return res.status(200).send({ 
                            success: true,
                            message: 'Friend request accepted' ,
                            res: result.res
                        })
                    } else {
                        throw new ApplicationError(result.error.message, result.error.statusCode)
                    }
                
                } else if (response === 'reject') {
                    
                    const result = await this.friendshipRepository.updateStatus(userId, friendId, 'rejected')

                    if(result.success) {
                        return res.status(200).send({ 
                            success: true,
                            message: 'Friend request rejected' ,
                            res: result.res
                        })
                    } else {
                        throw new ApplicationError(result.error.message, result.error.statusCode)
                    }

                } else {
                    throw new ApplicationError('Invalid response', 400)
                } 

            } else {
                throw new ApplicationError(pendingReq.error.message, pendingReq.error.statusCode)
            }
    
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

}