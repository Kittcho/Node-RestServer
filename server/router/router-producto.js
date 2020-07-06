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
})


//===========================
// Obtener un producto por ID
//===========================
app.get('/productos/:id', (req, res)=> {
    // populate: usuario categoria
    
});


//===========================
// Crear un nuevo producto
//===========================
app.post('/productos', (req, res)=> {
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
});

//===========================
// Actualizar un producto
//===========================
app.put('/productos/:id', (req, res)=> {

});


//===========================
// Eliminar un producto
//===========================
app.delete('/productos/:id', (req, res)=> {
    // cambiar disponible a false
});


module.exports = app;