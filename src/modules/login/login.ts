import * as express from 'express';
import * as connectionManager from '../connection-manager/connection';
import { resolve } from 'path';


export async function doLogin(req: express.Request, res: express.Response, next) {

    if (!req) {
        console.log("Req missing");
        res.send({ err: true, result: { message: 'Req Not found', data: null } });
        return;
    }

    if (!req.body) {
        res.send({ err: true, result: { message: 'Req body Not found', data: null } });
        return;
    }

    let userId: string = req.body.userId;
    let password: string = req.body.password;

    if (!userId || !password) {
        res.send({ err: true, result: { message: 'UserName & Passwd Invalid found', data: null } });
        return;
    }

    let validateUser: { err: any, result: any } = await validateUserFromDb(userId, password);

    if (validateUser.err || !validateUser.result) {
        res.send({ err: true, result: { message: 'UserName & Passwd Invalid found', data: null } });
        return;
    }
    let data: any = validateUser.result;

    if (data.userId === userId && data.password === data.password) {
        console.log("User Id and password match !!!");
        req.session.user_id = userId;
        res.redirect('/some-page');
        return;
    }
    else {
        res.send({ err: true, result: { message: 'UserName & Passwd Invalid found', data: null } });
        return;
    }
}


export async function validateUserFromDb(userId: string, password: string) {

    let connection: { err: any, result: any } = await connectionManager.nativeConnect();
    if (connection.err || !connection) {
        return { err: new Error('Error while making the connection from db'), result: null };
    }

    let connectionObj: any = connection.result;

    let query: string = "select * from userTable from userId = " + userId;
    return new Promise<{ err: any, result: any }>((resolve, reject) => {
        connection.result.query(query, (err, res) => {
            resolve({ err: err, result: res });
            return;
        })
    })
}