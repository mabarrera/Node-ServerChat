const { response } = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req,res = response) => {
    const { correo, password } = req.body

    try {
        const usuario = await Usuario.findOne({ correo })

        //Verificar si el email existe
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //Verificar si el usuario es activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg:'Usuario / Password no son correctos - estado: false'
            })
        }

        //Verificar la contraseña
        const validPassword = bcrypt.compareSync( password,usuario.password )
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id )

        res.json({
            usuario,
            token            
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            msg:'pongase en contacto con el administrador'
        })
    }
}

const googleSignin = async (req,res = response) => {
    const { id_token } = req.body

    try {
        const { nombre,correo,img } = await googleVerify( id_token )
        
        let usuario = await Usuario.findOne({ correo })
        if( !usuario ){
            //Si no existe se guardara
            const data = {
                nombre,
                correo,
                password: 'googlePass',
                img,
                google: true
            }
            usuario = new Usuario( data )
            await usuario.save()
        }

        //Si la condicion del usuario es inactivo
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'EL usuario esta bloqueado'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id )
        
        res.json({
            usuario,
            token
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
    }
}

const renovarToken = async (req, res = response) => {
    const usuario =  req.usuario

    const token = await generarJWT( usuario.id )

    res.json({
        usuario,
        token
    })
}

module.exports = {
    login,
    googleSignin,
    renovarToken
}