import * as express from 'express';
import { jwtToken } from '../config/config';
const jwt = require('jsonwebtoken');
import * as connectionManager from '../connection-manager/connection';
import { resolve } from 'url';

export async function createJwtTokenForUser(req: express.Request, res: express.Response, next: Function) {
    if (!req || !req.body) {
        res.send({ err: new Error('Please provide the user name & passwd'), result: { message: 'request body not found' } });
        return;
    }
    let userId: string = req.body.userId;
    let password: string = req.body.password;
    if (!userId || !password) {
        res.send({ err: true, result: { message: 'faliled to get the user name & pwd' } });
        return;
    }
    let data: string = userId + '_' + password;
    let token: any = jwt.sign({ data: data }, jwtToken, { expiresIn: '1h' });

    // save the record in database.

    let insertMsg: { err: any, result: any } = await insertIntoDB(userId, password);

    if (insertMsg.err) {
        res.send({ err: false, result: { message: 'Opps Error', token: null } });
        return;
    }
    res.send({ err: false, result: { message: 'Please use this token for subsequent request', token: token } });
    next();
    return;
}


export function insertIntoDB(userId: string, password: string) {
    let values: any[] = [
        {
            userId: userId,
            password: password
        }
    ]
    let query: string = "INSERT INTO userTbale (userId, password) VALUES" + values;
    return new Promise<{ err: any, result: any }>(async (resolve, reject) => {
        let connection: { err: any, result: any } = await connectionManager.nativeConnect();
        if (connection.err) {
            console.log("Error while connecting to the datanbase");
            resolve({ err: connection.err, result: null });
            return;
        }
        let connectionObj: any = connection.result;
        connectionObj.query(query, (err, data) => {
            if (err) {
                console.log("Error inserting the data");
                resolve({ err: err, result: null });
                return;
            }
            resolve({ err: null, result: data });
        })
    })
}