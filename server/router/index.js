const express = require('express');
const app = express();

app.use(require('./router-usuario'));
app.use(require('./router-login'));
app.use(require('./router-categoria'));
app.use(require('./router-producto'));


module.exports = app;