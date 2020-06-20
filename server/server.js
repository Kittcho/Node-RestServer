require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res) {
    let msj = 'Corriendo en ';

    if (process.env.PORT === '3000') {
        msj += 'Desarrollo.';
    } else {
        msj += 'Producción.';
    }

    res.json({ msj, port: process.env.PORT });
});

app.get('/usuario', (req, res) => {
    res.json('petición get');
});

app.post('/usuario', (req, res) => {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            persona: body
        });
    }

});

app.put('/usuario/:id', (req, res) => {

    let id = req.params.id;

    res.json({
        ok: true,
        id
    });
});

app.delete('/usuario', (req, res) => {
    res.json('petición delete');
});

app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto: ", process.env.PORT);
});