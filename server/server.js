require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// utilizo las rutas creadas en router-usuario.js
app.use(require('./router/router-usuario'));



app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", process.env.PORT);
});

mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Base de datos ONLINE');
}).catch((err) => {
    console.log('Error al intentar conectarse: \n', err);
});