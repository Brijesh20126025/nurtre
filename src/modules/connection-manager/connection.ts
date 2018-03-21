const mysql = require('mysql');
import { connectionConfig } from './connection-interface';

let config: connectionConfig = {
    host: 'localhost',
    user: process.env.mySqlUser ? process.env.mySqlUser : 'mysql',
    password: process.env.mySqlPassword ? process.env.mySqlPassword : 'mysql',
    port: process.env.mySqlPort ? process.env.mySqlPort : 3444,
    database: 'mydb',
    connectTimeout: 15000,
    ssl: "your-ssl-Name"
}

export async function nativeConnect() {
    try {
        let connection = mysql.createConnection(config);
        return { err: null, result: connection };
    } catch (e) {
        console.log('Unable to connect to mysql server db: ' + config.database + ', Error: ' + e);
        return { err: e, result: null };
    }
}

export async function nativeConnectByConfig(localConfig: connectionConfig) {
    try {
        if (!localConfig) {
            return { err: new Error('Opps local config is missing'), result: null };
        }
        let connection = mysql.createConnection(localConfig);
        await connection.connect();
        connection.on('error', function () {
            console.log("error in connection");
            return { err: new Error("Unable to createConnection to mysql server db"), result: null };
        })
        return { err: null, result: connection };
    } catch (e) {
        console.log('Unable to connect to mysql server db: ' + config.database + ', Error: ' + e);
        return { err: e, result: null };
    }
}