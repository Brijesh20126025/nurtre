import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { createJwtTokenForUser } from './modules/sign-up/signup';
import { validateUser } from './modules/validate-user/validate-user';
import { authenticate } from './modules/authenticate/authenticate';
import { getWebinar } from './modules/webinar/getWebinar';
import { doLogin } from './modules/login/login';
import { requiredLogin } from './modules/authenticate/requiredAuthentication';
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


app.use('/signUp', createJwtTokenForUser); // similar to creating the account

app.use('/login', doLogin);  // login to the website

// 'validateUser'  middleware will change the req.user property on req object.
app.use('/getwebinar', requiredLogin, validateUser, authenticate, getWebinar);


// handle logout..
app.get('/logout', (req, res) => {
    delete req.session.user_id;
    res.redirect('/login');
    return;
})

app.get('/', (req, res) => {
    res.send({ err: false, message: 'Welcome to Nurtr please sign up' });
    return;
});

app.post('/', (req, res) => {
    res.send({ err: false, message: 'Welcome to Nurtr please sign up' });
    return
});

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
