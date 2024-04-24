import ApplicationError from '../../middleware/error.middleware.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import otpRepository from './otp.repository.js';
import usersRepository from '../users/users.repository.js';

export default class OtpController {
    constructor() {
        this.otpRepository = new otpRepository();
        this.userRepository = new usersRepository();
    }

    async send(req, res, next) {
        try {
            const user = await this.userRepository.getDetails(req.body.email);

            if (user && user.success) {
                const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

                const otpRecord = await this.otpRepository.saveOtp({
                    userId: user.res._id,
                    email: req.body.email,
                    otpCode: otpCode,
                    expiresAt: new Date(Date.now() + 600000) // Expires in 10 minutes
                });

                if (otpRecord.success) {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'Dhairya.jan9@gmail.com',
                            pass: 'rpypzrfcytpiuxqg'
                        }
                    });

                    await transporter.sendMail({
                        from: 'Dhairya.jan9@gmail.com',
                        to: req.body.email,
                        subject: 'Password Reset OTP',
                        text: `Your OTP code for password reset is: ${otpCode}`
                    });

                    return res.status(200).json({ success: true, message: 'OTP sent successfully' });
                } else {
                    throw new ApplicationError('Failed to save OTP record', 500);
                }
            } else {
                throw new ApplicationError('User not found. Please sign up', 404);
            }
        } catch (error) {
            next(error);
        }
    }

    async verify(req, res, next) {
        try {
            const { email, otpCode } = req.body;
            const otpRecord = await this.otpRepository.getOtp(email, otpCode);

            if (otpRecord.success) {
                return res.status(200).json({ success: true, message: 'OTP verified successfully' });
            } else {
                return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired' });
            }
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, newPassword, otpCode } = req.body;
            const otpRecord = await this.otpRepository.getOtp(email, otpCode);

            if (!otpRecord.success) {
                return res.status(400).json({ success: false, message: 'Invalid OTP or OTP expired' });
            }

            const user = await this.userRepository.getDetails(email);
            if (!user.success) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 12);
            
            const updatedPassword = await this.userRepository.updatePassword(email, hashedPassword);
            
            if (!updatedPassword.success) {
                return res.status(500).json({ success: false, message: 'Failed to update password' });
            }

            await this.otpRepository.deleteOtp(otpRecord.res._id);
            return res.status(201).json({ success: true, message: 'Password reset successfully' });
        } catch (error) {
            next(error);
        }
    }
}
