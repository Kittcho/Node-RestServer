const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');



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

let Verify = async function(token, CLIENT_ID) {
    const client = new OAuth2Client(CLIENT_ID);
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    console.log({ payload });

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    }

};


app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let CLIENT_ID = req.body.CLIENT_ID;

    let usuarioGoogle = await Verify(token, CLIENT_ID)
        .catch((err) => {
            return res.status(403)
                .json({
                    ok: false,
                    err
                });
        });

    Usuario.findOne({ email: usuarioGoogle.email }, (err, usuarioDb) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (usuarioDb) {
            if (!usuarioDb.google) {
                return res.status(400)
                    .json({
                        ok: false,
                        err: {
                            message: 'El correo ' + usuarioDb.email + ' ya esta registrado por el registro propio del sistema, afavor iniciar sesión con su usuario y contraseña.'
                        }
                    });
            } else {
                let token = jwt.sign({
                        usuario: usuarioDb
                    },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioDb,
                    token
                });
            }
        } else {
            let usuario = new Usuario({
                nombre: usuarioGoogle.nombre,
                email: usuarioGoogle.email,
                password: ':D',
                img: usuarioGoogle.img,
                google: true
            });

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(500)
                        .json({
                            ok: false,
                            err
                        });
                }

                let token = jwt.sign({
                        usuario: usuarioDb
                    },
                    process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                res.json({
                    ok: true,
                    usuario: usuarioGuardado,
                    token
                });
            });
        }
    });
});




module.exports = app;