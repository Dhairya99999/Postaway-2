import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({

    email: { 
        type: String, 
        required: true 
    },
    otpCode: { 
        type: String, 
        required: true 
    },
    expiresAt: { 
        type: Date, 
        required: true 
    }

});


const otpModel = mongoose.model('Otp',otpSchema);
export default otpModel;