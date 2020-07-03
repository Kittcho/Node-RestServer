const express = require('express');
const app = express();

app.use(require('./router-usuario'));
app.use(require('./router-login'));


module.exports = app;