const express = require('express');
const app = express();
const { ValidaUsuario, VerificaAdminRole } = require('../middleware/aunteticacion');

let Categoria = require('../models/model-categoria');


app.get('/categoria', ValidaUsuario, (req, res) => {
    Categoria.find({}, (err, categoria) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        Categoria.count({}, (err, count) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                count,
                categoria
            });
        });
    });
});

app.get('/categoria/:id', ValidaUsuario, (req, res) => {
    let id = req.params.id;
    Categoria.findById({ _id: id }, (err, categoria) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        Categoria.count({ _id: id }, (err, count) => {
            if (err) {
                return res.status(500)
                    .json({
                        ok: false,
                        err
                    });
            }

            res.json({
                ok: true,
                count,
                categoria
            });
        });
    });
});

app.post('/categoria', ValidaUsuario, (req, res) => {
    let descripcion = req.body.descripcion;
    let _id = req.usuario._id;

    let categoria = new Categoria({
        descripcion,
        usuario: _id
    });

    categoria.save()
        .then((categoriaDb) => {
            res.status(201).json({
                ok: true,
                categoria: categoriaDb
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


app.put('/categoria/:id', [ValidaUsuario, VerificaAdminRole], (req, res) => {
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let _id = req.usuario._id;

    Categoria.findByIdAndUpdate(id, { descripcion, usuario: _id }, { new: true }, (err, categoriaBd) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!categoriaBd) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'El id proporcionado no fue encontrado, favor de revisar.'
                    }
                });
        }

        res.json({
            ok: true,
            categoriaBd
        });
    });
});


app.delete('/categoria/:id', [ValidaUsuario, VerificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBd) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!categoriaBd) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'El id proporcionado no fue encontrado, favor de revisar.'
                    }
                });
        }

        res.json({
            ok: true,
            categoriaBd
        });
    });
});

module.exports = app;