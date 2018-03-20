import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { createJwtTokenForUser } from './modules/sign-up/signup';
import { validateUser } from './modules/validate-user/validate-user';
import { authenticate } from './modules/authenticate/authenticate';
import { getWebinar } from './modules/webinar/getWebinar';
const cookieParser = require('cookie-parser');

let app: express.Express = express();

app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '500mb'
}));
let data: any = {
    limit: '500mb',
    parameterLimit: 1000000,
    extended: true
};
app.use(bodyParser.urlencoded(data));
app.use(cookieParser());


app.use('/signUp', createJwtTokenForUser);

app.use('/getwebinar', validateUser, authenticate, getWebinar);

app.get('/', (req, res) => {
    res.send({ err: false, message: 'Welcome to Nurtr please sign up' });
    return;
})

app.post('/', (req, res) => {
    res.send({ err: false, message: 'Welcome to Nurtr please sign up' });
    return
})

// Handle 404 
app.use((req, res, next) => {
    let err = {
        message: 'Not Found',
        status: 404
    };
    res.send(err);
    next(err);
    return;
});

export { app };
