import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as bcrypt  from 'bcryptjs';

import { apiResponse } from './responseController';
import { UserModel } from '../models/userModel';
//'Table Name', 'Table Model'
const User = mongoose.model('User', UserModel);

export class UserController{

    static addUser(req: Request, res: Response) { 

        let response:any;
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = bcrypt.hashSync(req.body.password, salt);

        let userbody={
            password:hashedPassword,
            username:req.body.username,
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            company:req.body.company,
            phone:req.body.phone
        };
           
        let newUser = new User(userbody);
        newUser.save((err, user) => {
            if(err){
                //res.send(err);
                response = apiResponse.getResponse(false, err, "Enable to add user", 403);
                res.send(response);
            }    
            //res.json(user);
            response = apiResponse.getResponse(true, user, "User Added Successfully", 200);
            res.send(response);
        });
    }

    static viewUser(req: Request, res: Response) { 

        let response:any;             
        User.find({}, (err, user) => {
            if(err){
                //res.send(err);
                response = apiResponse.getResponse(false, err, "Enable to find user", 403);
                res.send(response);
            }
            //res.json(user);
            response = apiResponse.getResponse(true, user, "User Details", 200);
            res.send(response);
        });
    }

}