import friendshipModel from "./friendships.schema.js"

export default class friendshipRepository {

    async getFriends(userId) {

        try {
            const friendships = await friendshipModel.find({ user: userId, status: 'accepted' }).populate('friend', 'User')

            if (friendships.length > 0) {
                return { success: true, res: friendships }
            } else {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        message: 'Friends not found'
                    }
                }
            }

        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

    async getPendingRequests(userId) {
        try {
            const requests = await friendshipModel.find({ user: userId, status: 'pending' }).populate('friend', 'User')

            if (requests.length > 0) {
                return { success: true, res: requests }
            } else {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        message: 'Pending requests not found'
                    }
                }
            }

        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }


    // get single friendship
    async getFriendship(userId, friendId) {
        try {
            const friendship = await friendshipModel.findOne({ user: userId, friend: friendId })

            if (friendship) {
                return { success: true, res: friendship }
            } else {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        message: 'Friendship not found'
                    }
                }
            }
        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

    // delete friendship
    async deleteFriendship(friendshipId) {
        try {
            const delFriendship = await friendshipModel.findByIdAndDelete(existingFriendship._id)

            if (delFriendship) {
                return { success: true, res: delFriendship }
            } else {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        message: 'Friendship not found'
                    }
                }
            }
        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

    // send friend request (create friendship with pending status)
    async sendFriendRequest(userId, friendId) {
        try {
            const newFriendship = new friendshipModel({
                user: userId,
                friend: friendId,
                status: 'pending'
            })
            await newFriendship.save()

            return { success: true, res: newFriendship }
        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

    // get single pending request
    async getOnePendingRequest(userId, friendId) {
        try {
            const pendingReq = await friendshipModel.findOne({ user: friendId, friend: userId, status: 'pending' })

            if (pendingReq) {
                return { success: true, res: pendingReq }
            } else {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        message: 'Friend request not found'
                    }
                }
            }
        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

    // update status of friend request
    async updateStatus(userId, friendId, status) {
        try {
            const result = await friendshipModel.findOneAndUpdate(
                { user: friendId, friend: userId  },
                { $set: { status: status } },
                { new: true }
            )
            if (result) {
                return { success: true, res: result }
            } else {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        message: 'Friend request not found'
                    }
                }
            }
        } catch (error) {
            console.log("Error: " + error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

}