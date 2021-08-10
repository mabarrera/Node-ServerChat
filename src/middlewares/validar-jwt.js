const { response } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async (req = request,res = response ,next) => {
    const token = req.header('access_token')
    if( !token ){
        return res.status(401).json({
            msg: 'No existe un token de autorización'
        })
    }

    try {
        const { uid } = jwt.verify( token,process.env.SECRET_PRIVCAFE_KEY )

        //Leer usuario correspondiente
        const usuario =  await Usuario.findById( uid )

        //Verificar que el usuario existe en la BD
        if( !usuario ){
            return res.status(401).json({
                msg:'No existe el token de autorización - Usuario no existe en BD'
            })
        }

        //Verificar que el usuario sea activo
        if( !usuario.estado ){
            return res.status(401).json({
                msg:'No existe el token de autorización - estado falso'
            })
        }

        req.usuario = usuario

        next()

    } catch (err) {
        console.log(err);
        return res.status(401).json({
            msg: 'EL token no es valido'
        })
    }

    
}

module.exports = {
    validarJWT
}