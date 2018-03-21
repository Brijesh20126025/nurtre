import * as express from 'express';
import { jwtToken as secertKey } from '../config/config'
const jwt = require('jsonwebtoken');

export function validateUser(req: express.Request, res: express.Response, next) {
    if (!req) {
        res.send({ err: true, result: { message: 'Request empty', data: null } });
        return;
    }
    if (!req.headers || !req.headers.authorization) {
        res.send({ err: true, result: { message: 'Request authorization hearder not found', data: null } });
        return;
    }

    // chacking from session.

    if (!req.session.user_id) {
        res.send({ err: true, result: { message: 'User is not valid', data: null } });
        return;
    }

    let jwtToken: string = req.headers.authorization;
    let user: any = null;
    try {
        user = jwt.verify(jwtToken, secertKey);
        // here change the req.user and set our custom user
        // it will be useful to validate the user in sebsequent request.
        req["user"] = user;
        console.log(JSON.stringify(user));
        next();
        return;
    } catch (err) {
        res.send({ err: true, result: { message: 'unable to validate Jwt token', data: null } });
        return;
    }
}