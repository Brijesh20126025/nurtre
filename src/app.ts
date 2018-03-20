import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { createJwtTokenForUser } from './modules/sign-up/signup';
import { validateUser } from './modules/validate-user/validate-user';
import {} from './modules/authenticate/authenticate';
const cookieParser = require('cookie-parser');

let app: express.Express = express();
// new wolframAlpha(appId).query('how far is sun from earth', (err, res) => {
//     console.log(err);
//     console.log(res);
// });

app.use(logger('dev'));
app.use(bodyParser.json({
    limit: '500mb'
    // parameterLimit: 1000000
}));
// app.use(express.session());
let data: any = {
    limit: '500mb',
    parameterLimit: 1000000,
    // making this consistent with app server
    extended: true
};
app.use(bodyParser.urlencoded(data));
app.use(cookieParser());


app.use('/signUp', createJwtTokenForUser);

app.use('/getwebinar/', validateUser,authenticateUser,  );

app.get('/', (req, res) => {
    res.send({ err: false, message: 'Welcome to Nurtre please sign up' });
    return;
})

app.post('/', (req, res) => {
    res.send({ err: false, message: 'Welcome to Nurtre please sign up' });
    return
})

// Handle 404 
app.use((req, res, next) => {
    //This is our custom error message.
    // If raising error from within the app, we will have to set up error.status
    let err = {
        message: 'Not Found',
        status: 404
    };
    res.send(err);
    next(err);
    return;
});

export { app };
