import express from 'express'

import likeController from './likes.controller.js'
import jwtAuth from '../../middleware/jwt.middleware.js'

const likeRouter = express.Router()
const likeInstance = new likeController()

likeRouter.get('/:id', (req, res, next) => {
    likeInstance.get(req, res, next)
})
likeRouter.get('/toggle/:id', jwtAuth, (req, res, next) => {
    likeInstance.toggle(req, res, next)
})

export default likeRouter;


