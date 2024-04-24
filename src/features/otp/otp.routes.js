import express from "express"

import OtpController from "./otp.controller.js"

const otpRouter = express.Router();
const otpController = new OtpController();

// Route to send OTP
otpRouter.post("/send", (req, res, next) => {
    otpController.send(req, res, next)
})

// Route to verify OTP
otpRouter.post("/verify", (req, res, next) => {
    otpController.verify(req, res, next)
})

// Route to reset password using OTP
otpRouter.post("/reset-password", (req, res, next) => {
    otpController.resetPassword(req, res, next)
})

export default otpRouter