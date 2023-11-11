const express = require('express');
const app = express();
const cors = require('cors')

const path = require('path');

app.use(cors());
app.use(express.json());

const apiRouter = require('./routes/api_v1');

app.use('/', apiRouter);

console.log(path.join(__dirname , '/uploads'));
app.use(express.static(path.join(__dirname , '/uploads')));
//app.use(express.static('./uploads'));

app.listen(3005, () => console.log('server on port 3005'));