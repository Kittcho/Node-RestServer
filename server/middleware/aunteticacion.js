const jwt = require('jsonwebtoken');

let ValidaUsuario = (req, res, next) => {
    let token = req.get('token'); // obtiene el token del header

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401)
                .json({
                    ok: false,
                    err
                });
        }

        req.usuario = decode.usuario;
        next();
    });
};


let VerificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    console.log({ usuario });

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401)
            .json({
                ok: false,
                err: {
                    message: 'El usuario no esta permitido para realizar esta acción.'
                }
            });
    }

    next();
};


module.exports = {
    ValidaUsuario,
    VerificaAdminRole
};