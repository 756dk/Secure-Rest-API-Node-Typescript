import * as mongoose from 'mongoose';
import { Request, Response } from 'express';
import * as bcrypt  from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as randtoken from 'rand-token';
import { Global } from '../util/Contants';

import { apiResponse } from './responseController';
import { UserModel } from '../models/userModel';
import { AuthModel } from '../models/authModel';
//'Table Name', 'Table Model'
const User = mongoose.model('User', UserModel);
const Auth = mongoose.model('auth', AuthModel);

export class AuthController{

    public static login(req: Request, res : Response){

        let response:any;

        User.findOne({ 'email' :  req.body.email }, function(err, user) {
            if(err){
                response = apiResponse.getResponse(false, err, "Login Unsuccessfull", 403);
                            res.send(response);
            }
            if(user){
                let confirmpassword = bcrypt.compareSync(req.body.password, user.password);

                if(confirmpassword){
                    // Create JWT TOKEN
                    AuthController.deviceToken(user, req)
                        .then(response=>{   
                            res.send(response);
                    });
                    
                }else{
                    //res.send('ERROR: Could not log in');
                    response = apiResponse.getResponse(false, '', "ERROR: Could not log in", 403);
                    res.send(response);
                }
            }else{
                response = apiResponse.getResponse(false, err, "Email not exist..!!", 403);
                res.send(response);
            }
            
        });

    }

  public static deviceToken(user, req){

        let response:any;
        let refreshtoken = randtoken.generate(16);

        return new Promise<string>((resolve, reject) => {
            Auth.find({  $and: [{"userid": user._id },{ "deviceid": req.body.deviceid } ] }, function(err, authdetails) {

                if(authdetails){
                    jwt.sign({id:user._id}, Global.SECRET, { expiresIn: '24h' },(err, token) => {
                        if(err) { 
                            response = apiResponse.getResponse(false, err, "Login Unsuccessfull", 403);
                            reject(response);
                        }   

                        let userCredential = { "_id": authdetails._id };        
                        let newvalues  = { $set: { jwttoken: token, refreshtoken: refreshtoken } };
                        Auth.findOneAndUpdate(userCredential, newvalues,{new : true} ); //Details get updated in the Database
                        let data = {"token": token, "refreshtoken": refreshtoken}
                        response = apiResponse.getResponse(true, data, "Login Sucessfull", 200);
                        resolve(response);
                    });
                }else{
                    jwt.sign({id:user._id}, Global.SECRET, { expiresIn: '24h' },(err, token) => {
                        if(err) { 
                            response = apiResponse.getResponse(false, err, "Login Unsuccessfull", 403);
                            reject(response);
                        }    
                        let authdetails = {
                            userid:user._id,
                            devicetype:req.body.devicetype,
                            deviceid:req.body.deviceid,
                            jwttoken:token,
                            refreshtoken:refreshtoken
                        }
            
                        let auth = new Auth(authdetails);
            
                        auth.save(); //Details get saved in the Database
                        
                        let data = {"token": token, "refreshtoken": refreshtoken}
                        response = apiResponse.getResponse(true, data, "Login Sucessfull", 200);
                        resolve(response);
                    });
                }
            });
          
              
          
        });   
    }

    static refreshtoken(req: Request, res: Response){
        let refreshtoken = req.body.refreshtoken;
        let response:any;

        Auth.findOne({'refreshtoken': refreshtoken}, function(err,authdetails){
            if(authdetails){
                User.findOne({'_id':authdetails.userid}, function(err,user){
                    jwt.sign({id:user._id}, Global.SECRET, { expiresIn: '24h' },(err, token) => {
                        if(err) { 
                            response = apiResponse.getResponse(false, err, "Login Unsuccessfull", 403);
                            res.send(response);
                        }   

                        let userCredential = { "refreshtoken": refreshtoken };        
                        let newvalues  = { $set: { jwttoken: token } };
                        Auth.findOneAndUpdate(userCredential, newvalues,{new : true} ); //Details get updated in the Database
            
                        response = apiResponse.getResponse(true, token, "New Access Token", 200);
                        res.send(response);
                    });
                });
            }
        });
    }

    static register(req: Request, res: Response) { 
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
                response = apiResponse.getResponse(false, err, "Something went wrong, Try to signup again", 403);
                res.send(response);
            }else{
                response = apiResponse.getResponse(true, user, "User Register Successfully", 200);
                res.send(response); 
            }
               
            //res.send('User Register Successfully');
            // res.json(user);
        });
    }

    static logout(req: Request, res: Response) {

        const header = req.headers['authorization'];
        let bearer = header.split(' ');
        let token = bearer[1];
        let response:any;

        if(req.body.all){ // Logout from all devices

                Auth.findOne({'jwttoken':token}, function(err,authdetails){
                    Auth.remove({'userid':authdetails.userid});
                    response = apiResponse.getResponse(true, '', "Logout from all devices Successfully", 200);
                    res.send(response); 
                });

        }else{
            Auth.findByIdAndRemove({"jwttoken": token});
            response = apiResponse.getResponse(true, '', "Logout Successfully", 200);
            res.send(response); 
        }
    }

}