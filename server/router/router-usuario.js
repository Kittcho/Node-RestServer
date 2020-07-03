const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const { ValidaUsuario, VerificaAdminRole } = require('../middleware/aunteticacion');

// MODELO
let Usuario = require('../models/model-usuario');

// PETICIONES REST

app.get('/', function(req, res) {
    let msj = 'Corriendo en ';

    if (process.env.PORT === '3000') {
        msj += 'Desarrollo.';
    } else {
        msj += 'Producción.';
    }

    res.json({ msj, port: process.env.PORT });
});

app.get('/usuario', ValidaUsuario, (req, res) => {

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    let filtro = {
        estado: true
    };

    Usuario.find(filtro)
        .skip(desde)
        .limit(limite)
        .exec()
        .then((resultado) => {
            Usuario.countDocuments(filtro)
                .skip(desde)
                .limit(limite)
                .then((count) => {
                    res.json({
                        ok: true,
                        count,
                        resultado
                    });
                })
                .catch((err) => {
                    res.status(409)
                        .json({
                            ok: false,
                            err
                        });
                });
        })
        .catch((err) => {
            res.status(400)
                .json({
                    ok: false,
                    err
                });
        });
});

app.post('/usuario', [ValidaUsuario, VerificaAdminRole], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.correo,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save()
        .then((usuarioDB) => {
            res.json({
                ok: true,
                usuario: usuario,
            });
        })
        .catch((err) => {
            res.status(400).json({
                ok: false,
                mensaje: err
            });
        });
});

app.put('/usuario/:id', [ValidaUsuario, VerificaAdminRole], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'role', 'estado']);

    console.log({ id, body });

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.delete('/usuario/:id', [ValidaUsuario, VerificaAdminRole], (req, res) => {

    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioBaja) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            usuario: usuarioBaja
        });

    });

});


// EXPORTACIONES   
module.exports = app;