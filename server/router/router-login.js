const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let Usuario = require('../models/model-usuario');



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDb) => {

        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!usuarioDb) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        messaje: 'El [usuario] o la contraseña no son correctos'
                    },
                });
        }

        if (!bcrypt.compareSync(body.password, usuarioDb.password)) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        messaje: 'El usuario o la [contraseña] no son correctos'
                    }
                });
        }

        let token = jwt.sign({
                usuario: usuarioDb
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDb,
            token
        });
    });


});













module.exports = app;