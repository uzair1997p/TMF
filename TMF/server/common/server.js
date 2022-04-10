const https = require('http');
const routes = require('../routes');
const Express = require('express');
const os = require('os');
const fs = require('fs');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const cookieSession = require('cookie-session');

//const errorHandler = require('../middleware/errorhandler')

const app = new Express();

const httpsOptions = {
    cert : fs.readFileSync('/../ssl/server.crt'),
    key : fs.readFileSync('/../ssl/server.key')
}

class ExpressServer {

    constructor() {
        app.use(bodyParser.json());
        app.use(Express.urlencoded({ extended: true }));
        app.use(Express.static(__dirname + '/../../client_end/')); // Setting directory for css and js
        app.use(fileUpload());
        app.use(cookieSession({
            keys: ['secret']
        }));
        console.log("Constructor running");
    }

    router(routes) {
        routes(app);
        return this;
    }

    listen(port = process.env.PORT || 3000) {
        const welcome = (p) => () =>
            console.log(
                `up and running in ${
            process.env.NODE_ENV || 'development'
            } @: ${os.hostname()} on port: ${p}}`
            );
        https.createServer(httpsOptions,app).listen(port, welcome(port));
        return app;
    }
}

module.exports = ExpressServer;