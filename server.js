const express = require('express');
const app = express();
const cors = require('cors')

const path = require('path');

const CLIENT_ID = "Adzh-j5un9wfBKE43Q5rlWNzHLZxOkQO5KvJUNUwGnUtXr9CPebBfDFR-Cx3_-oeNSsXJSBFk-AWaTM5";
const APP_SECRET = "EH-bJHX1YlC563iUxOrR1puaPNSMS2iCOuCoh86IwQ_KCflCZ9NHqejI43zAdaAN4sYXeMOq0ajmDl7i";
const baseURL = {
    sandbox: "https://api-m.sandbox.paypal.com",
    production: "https://api-m.paypal.com"
};
    
    // allow json body

app.use(cors());
app.use(express.json());

const apiRouter = require('./routes/api_v1');

app.use('/', apiRouter);

console.log(path.join(__dirname , '/uploads'));
app.use(express.static(path.join(__dirname , '/uploads')));
//app.use(express.static('./uploads'));

app.listen(3005, () => console.log('server on port 3005'));