const { response } = require('express')
const Usuario = require('../models/usuario')
const bcrypt = require('bcryptjs')

//Obtener todos los usuarios
const getUsuarios = async (req, res = response) => {

    const { desde = 0, limite = 10 } = req.query
    const activo = {estado : true}
    
    const [ total,usuarios ] = await Promise.all([
        Usuario.countDocuments(activo),
        Usuario.find(activo)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    })
}

//Agregar un nuevo usuario
const postUsuarios = async (req, res = response) => {
    const { nombre,correo,password,rol } = req.body
    const usuario = new Usuario({ nombre,correo,password,rol })

    //Verificar correo
    // const existeCorreo = await Usuario.findOne({correo})
    // if(existeCorreo){
    //     return res.status(400).json({
    //         msg: 'El correo ya existe'
    //     })
    // }


    //Encryptar password
    const salt = bcrypt.genSaltSync(12)
    usuario.password = bcrypt.hashSync(password,salt)
    
    await usuario.save();

    res.json(usuario)
}

//Actualizar un usuario
const putUsuarios = async (req,res = response) => {
    const { id } = req.params
    const { _id, password, google, correo, ... resto } = req.body

    //Validar contra BD solo si en caso desea actualizar la contraseña
    // if(password){
    //     //Encryptar password
    //     const salt = bcrypt.genSaltSync(12)
    //     resto.password = bcrypt.hashSync(password,salt)
    // }

    const usuario = await Usuario.findByIdAndUpdate(id,resto)
    console.log(usuario);

    res.json(usuario)
}

//Eliminar un usuario
const deleteUsuarios = async (req,res = response) => {
    const { id } = req.params
    
    //Eliminar datos del documento (tabla)
    //const usuario = await Usuario.findByIdAndDelete(id)

    //Cambar el estado del usuario
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false})
    
    res.json(usuario)
}

module.exports = {
    getUsuarios,
    postUsuarios,
    putUsuarios,
    deleteUsuarios
}