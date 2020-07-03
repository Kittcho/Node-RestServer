// Puerto

process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// url
let conexion = '';

if (process.env.NODE_ENV === 'dev') {
    conexion = 'mongodb://localhost:27017/cafe';
} else {
    conexion = process.env.MONGO_URI;
}

process.env.URL_DB = conexion;

// Vigencia token
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || "1h";

// Seed de validación de token
process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';