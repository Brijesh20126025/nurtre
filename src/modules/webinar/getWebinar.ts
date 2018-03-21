import * as express from 'express';
import * as connectionManager from '../connection-manager/connection';

export async function getWebinar(req: express.Request, res: express.Response, next) {
    try {
        if (!req) {
            console.log("Req missing");
            res.send({ err: true, result: { message: 'Req Not found', data: null } });
            return;
        }
        if (!req.headers || !req.headers.authorization) {
            res.send({ err: true, result: { message: 'Request authorization hearder not found', data: null } });
            return;
        }

        if (!req.body) {
            res.send({ err: true, result: { message: 'Req body Not found', data: null } });
            return;
        }
        let body: any = req.body;
        let userId: string = req.body.userId;
        let mentorId: string = req.body.mentorId;

        if (!userId || !mentorId) {
            res.send({ err: true, result: { message: 'UserId Or Mentor Id missing ', data: null } });
            return;
        }
        // get the all webnair of the menotr Id
        let mentorwebnair: { err: any, result: any } = await mentorWebnair(mentorId);
        if (mentorwebnair.err) {
            res.send({ err: true, result: { message: 'Err !!!', data: null } });
            return;
        }
        let mentorWebnairsData: any = mentorwebnair.result;
        let recommwebinar: { err: any, result: any } = await recommWebinarForUsers(userId);

        if (recommwebinar.err) {
            res.send({ err: true, result: { message: 'Err !!!', data: null } });
            return;
        }
        let recommWebinarForUsersData: any = recommwebinar.result;
        res.send({ err: true, result: { message: 'Sucess', data: { mentoreWebinar: mentorWebnairsData, recommUserWebinar: recommWebinarForUsersData } } });
        return;

    } catch (ex) {
        res.send({ err: true, result: { message: 'Exception Opps!!!', data: null } });
        return;
    }
}

export function mentorWebnair(mentorId: string) {
    let query: string = "select * from webinar where mentorId = " + mentorId;
    return new Promise<{ err: any, result: any }>(async (resolve, reject) => {
        // make the data base connection
        // if you want to connect with your local config connect with nativeConnectByConfig(your config)
        let connection: { err: any, result: any } = await connectionManager.nativeConnect();
        if (connection.err) {
            console.log("Error while connecting to the datanbase");
            resolve({ err: connection.err, result: null });
            return;
        }
        let connectionObj: any = connection.result;
        connectionObj.query(query, (err, data) => {
            if (err) {
                console.log("Error while getting the mentor webinar data");
                resolve({ err: err, result: null });
                return;
            }
            connectionObj.end();
            resolve({ err: null, result: data });
            return;
        })
    })
}

export function recommWebinarForUsers(userId: string) {
    let query: string = "select * from recomm-webinar where userId = " + userId;
    return new Promise<{ err: any, result: any }>(async (resolve, reject) => {
        // make the data base connection
        // if you want to connect with your local config connect with nativeConnectByConfig(your config)
        let connection: { err: any, result: any } = await connectionManager.nativeConnect();
        if (connection.err) {
            console.log("Error while connecting to the datanbase");
            resolve({ err: connection.err, result: null });
            return;
        }
        let connectionObj: any = connection.result;
        connectionObj.query(query, (err, data) => {
            if (err) {
                console.log("Error while getting the user Recomm. webinar data");
                resolve({ err: err, result: null });
                return;
            }
            connectionObj.end();
            resolve({ err: null, result: data });
            return;
        })
    })
}   