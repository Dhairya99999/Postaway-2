import otpModel from './otp.schema.js'

export default class OtpRepository {

    async saveOtp(data) {
        try {
            const newOtp = new otpModel(data)
            await newOtp.save()
            return { success: true, res: newOtp }
        } catch (error) {
            console.log("Error: "+ error)
            return { success: false, error: { statusCode: 500, message: error } }
        }
    }

    async getOtp(email, otpCode) {
        try {
            const otpRecord = await otpModel.findOne({ email, otpCode, expiresAt: { $gt: new Date() } })
            
            if(otpRecord) 
                return { success: true, res: otpRecord }
            else 
                return { 
                    success: false, 
                    error: {
                        statusCode: 404, 
                        message: 'otp not found' 
                    }
                }
        } catch (error) {
            console.log("Error: "+ error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }

    async deleteOtp(id) {
        try {
            const delOtp = await otpModel.findByIdAndDelete(id)
            
            if(delOtp) 
                return { success: true, res: otpRecord }
            else 
                return { 
                    success: false, 
                    error: {
                        statusCode: 404, 
                        message: 'otp not found' 
                    }
                }
        } catch (error) {
            console.log("Error: "+ error)
            return { success: false, error: { statusCode: 400, message: error } }
        }
    }
}