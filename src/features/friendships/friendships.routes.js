import express from 'express'

import jwtAuth from '../../middleware/jwt.middleware.js'
import friendshipController from './friendships.controller.js'

const friendshipRouter = express.Router()
const friendshipInstance = new friendshipController()

// Route: Get a user's friends
friendshipRouter.get('/get-friends/:userId', jwtAuth, (req, res, next) => {
    friendshipInstance.getFriends(req, res, next)
})

// Route: Get pending friend requests
friendshipRouter.get('/get-pending-requests', jwtAuth, (req, res, next) => {
    friendshipInstance.getPendingRequests(req, res, next)
})

// Route: Toggle friendship with another user
friendshipRouter.get('/toggle-friendship/:friendId', jwtAuth, (req, res, next) => {
    friendshipInstance.toogleFriendship(req, res, next)
})

// Route: Accept or reject a friend request
friendshipRouter.get('/response-to-request/:friendId', jwtAuth, (req, res, next) => {
    friendshipInstance.responseToRequest(req, res, next)
})

export default friendshipRouter