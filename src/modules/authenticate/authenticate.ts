import * as express from 'express';

export function authenticate(req: express.Request, res: express.Response, next) {
    try {
        if (!req) {
            console.log("Req missing");
            res.send({ err: true, result: { message: 'Req Not found', data: null } });
            return;
        }
        if (!req.body) {
            res.send({ err: true, result: { message: 'Req body Not found', data: null } });
            return;
        }
        let body: any = req.body;
        let userId: string = req.body.userId;
        let mentorId: string = req.body.mentorId;

        let authMessage: any = auth(userId);
        if (!authMessage) {
            res.send({ err: true, result: { message: 'User Does not exists', data: null } })
        }
        next();
    } catch (ex) {
        res.send({ err: true, result: { message: 'Exception Opps!!!', data: null } });
        return;
    }
}


export async function auth(userId: string) {

    try {
        if (!userId) {
            return false;
        }
        let query: string = "select * from userTable where userId = " + userId;

        let data: { err: any, result: any } = await CheckUserExists(query, userId);

        if (data.err || !data) {
            return false;
        }
        if (!data.result.length) {
            console.log("User Does not exists");
            return false;
        }
        return true;

    } catch (ex) {
        return false;
    }
}


export function CheckUserExists(query: string, userId: string) {
    return new Promise<{ err: any, result: any }>((resolve, reject) => {

        dbModule.find(query, (err, res) => {
            if (err) {
                console.log("Error while finding the user");
                resolve({ err: err, result: null });
                return;
            }
            resolve({ err: null, result: res });
        })
    })
}