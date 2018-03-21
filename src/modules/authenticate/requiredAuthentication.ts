import * as express from 'express';


export function requiredLogin(req: express.Request, res: express.Response, next) {
    if (req.user) {
        next();
    } else {
        res.send({ error: true, message: "login required" });
        return;
    }
}