import * as mongoose from 'mongoose';
import { UserModel } from '../models/userModel';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import { Global } from '../util/Contants';

import { apiResponse } from '../controllers/responseController';


  //Check to make sure header is not undefined, if so, return Forbidden (403)
export function checkToken  (req, res, next) {
    const header = req.headers['authorization'];

    let response:any;

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];
        
        //verify the JWT token generated for the user
        jwt.verify(token, Global.SECRET, (err) => {
            if(err){
                //If error send Forbidden (403)
                response = apiResponse.getResponse(false, err, "Token Expired", 403);
                res.send(response);
            } else {
                //If token is successfully verified, we can send the autorized data 
                next();
            }
        });
  
    } else {
        //If header is undefined return Forbidden (403)
        response = apiResponse.getResponse(false, '', "Token Missing", 403);
        res.send(response);
    }
  }


