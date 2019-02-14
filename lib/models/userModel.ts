import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserModel = new Schema({
    username: {
        type: String,
        required: 'Enter sername'
    },
    password: {
        type: String,
        required: 'Enter Password'
    },
    firstName: {
        type: String,
        required: 'Enter a first name'
    },
    lastName: {
        type: String,
        required: 'Enter a last name'
    },
    email: {
        type: String,
        unique: true            
    },
    company: {
        type: String            
    },
    phone: {
        type: Number            
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});