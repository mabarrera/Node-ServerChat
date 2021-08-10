const { Usuario, Categoria, Producto } = require('../models')
const Role = require('../models/rol')
//const Usuario = require('../models/usuario')

const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({rol})
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const emailExiste = async (correo = '') => {
    const existeCorreo = await Usuario.findOne({correo})
    if(existeCorreo){
        throw new Error(`El correo ${correo} ya existe`)
    }
}

const usuarioExiste = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`)
    }
}

const categoriaExiste = async (id) => {
    const existeCategoria = await Categoria.findById(id)
    if( !existeCategoria ){
        throw new Error(`El id ${id} no existe`)
    }
}

const productoExiste = async (id) => {
    const existeProducto =  await Producto.findById(id)
    if( !existeProducto ){
        throw new Error(`El id ${id} no existe`)
    }
}

//Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion='',colecciones =[] ) => {
    const incluida = colecciones.includes( coleccion )
    if( !incluida ){
        throw new Error(`La coleccion ${coleccion} no esta permitida, ${colecciones}` )
    }
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    usuarioExiste,
    categoriaExiste,
    productoExiste,
    coleccionesPermitidas
}