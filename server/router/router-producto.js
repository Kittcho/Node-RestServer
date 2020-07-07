const express = require('express');
const app = new express();

let Producto = require('../models/model-producto');

const { ValidaUsuario } = require('../middleware/aunteticacion');


//===========================
// Obtener productos
//===========================
app.get('/productos', (req, res) => {
    // todos los productos
    // populate: usuario categoria
    // paginado

    let desde = Number(req.query.desde) || 0;
    let limite = Number(req.query.limite) || 5;

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec()
        .then((productos) => {
            Producto.count({}, (err, count) => {
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
                    productos
                });
            });
        })
        .catch((err) => {
            res.status(500)
                .json({
                    ok: false,
                    err
                });
        });
});


//===========================
// Obtener un producto por ID
//===========================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.find({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec()
        .then((productos) => {
            Producto.count({ _id: id }, (err, count) => {
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
                    productos
                });
            });
        })
        .catch((err) => {
            res.status(500)
                .json({
                    ok: false,
                    err
                });
        });

});


//===========================
// Crear un nuevo producto
//===========================
app.post('/productos', ValidaUsuario, (req, res) => {
    // grabar el producto
    // grabar una categoria del listado

    /*
        nombre: { type: String, required: [true, 'El nombre es necesario'] },
        precioUni: { type: Number, required: [true, 'El precio únitario es necesario'] },
        descripcion: { type: String, required: false },
        disponible: { type: Boolean, required: true, default: true },
        categoria: { type: Schema.Types.ObjectId, ref: 'Categoria', required: true },
        usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
    */

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
        usuario: req.usuario._id
    });

    producto.save()
        .then((productoDb) => {
            res.json({
                ok: true,
                producto: productoDb
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

//===========================
// Actualizar un producto
//===========================
app.put('/productos/:id', (req, res) => {

    let body = req.body;
    let id = req.params.id;

    let producto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoriaId,
    };

    Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true }, (err, productoDb) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productoDb) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'No se encontro registro que coincida con el id, favor de revisar'
                    }
                });
        }

        res.json({
            ok: true,
            producto: productoDb
        });


    });

});


//===========================
// Eliminar un producto
//===========================
app.delete('/productos/:id', (req, res) => {
    // cambiar disponible a false

    let disponible = false;
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible }, { new: true, runValidators: true }, (err, productoDb) => {
        if (err) {
            return res.status(500)
                .json({
                    ok: false,
                    err
                });
        }

        if (!productoDb) {
            return res.status(400)
                .json({
                    ok: false,
                    err: {
                        message: 'No se encontro registro que coincida con el id, favor de revisar'
                    }
                });
        }

        res.json({
            ok: true,
            producto: productoDb
        });


    });
});


module.exports = app;