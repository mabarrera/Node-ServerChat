const { response } = require('express')

const esAdminRole = (req,res = response,next) => {
    if( ! req.usuario ){
        return res.status(500).json({
            msg: 'Primero debe verificar el token'
        })
    }

    const { rol, nombre } = req.usuario
    
    if( rol!== 'ADMIN' ){
        return res.status(401).json({
            msg: `${nombre} no es administrador, no puede hacer esto`
        })
    }
    
    next()
}

const esModerador = (req,res = response, next) => {

    next()
}

const tieneRol = ( ...roles ) => {
    return (req,res = response, next) => {
        if( ! req.usuario ){
            return res.status(500).json({
                msg: 'Primero debe verificar el token'
            })
        }
        
        if( !roles.includes(req.usuario.rol) ){
            return res.status(401).json({
                msg: `Se requiere uno de estos roles ${roles}`
            })
        }
        next()
    }
}


module.exports = {
    esAdminRole,
    esModerador,
    tieneRol
}