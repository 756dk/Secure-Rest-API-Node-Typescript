import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const AuthModel = new Schema({
    userid: {
        type: String,
        required: 'Provide userID'
    },
    devicetype: {
        type: String,
        required: 'Device Type Needed'
    },
    deviceid: {
        type: String,
        required: 'Device ID Needed'
    },
    jwttoken: {
        type: String,
        required: 'Provide Token'
    },
    refreshtoken:{
        type: String,
        required: 'Provide Refresh Token'
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});