// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// url
let conexion = 'mongodb+srv://kittcho:LSqKeOmMhc3HEAYa@cluster0-hbpuf.mongodb.net/cafe';

if (process.env.NODE_ENV === 'dev') {
    conexion = 'mongodb://localhost:27017/cafe';
}

process.env.URL_DB = conexion;