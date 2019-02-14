import { Request, Response } from 'express';

import { request } from 'http';

class responseResult {
    isSuccess: boolean;
    data: any;
    message: string;
    code: number;

    //constructor 
    constructor(isSuccess: boolean, data: any, message: string, code: number) {
        this.isSuccess = isSuccess;
        this.data = data;
        this.message = message;
        this.code = code;
    }
}

export class apiResponse {
    static getResponse(isSuccess: boolean, data: any, message: string, code: number): any {
        const Response = new responseResult(isSuccess, data, message ? message : "",code);
        return Response;
    }

}



