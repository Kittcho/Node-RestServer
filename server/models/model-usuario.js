const mongoose = require('mongoose');
let Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

const uniqueValidator = require('mongoose-unique-validator');


// ENUMERADOR CON LOS ROLES PERMITIDOS
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};


let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: [true, 'El correo es necesario'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: String,
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: { type: Boolean, default: true },
    google: { type: Boolean, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El correo {VALUE} ya ha sido registrado, favor de validar.' });


usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};


module.exports = mongoose.model('Usuario', usuarioSchema);