const { response } = require("express");
const { Categoria } = require("../models");

//Listar todas las categorias
const obtenerCategorias = async(req,res = response) => {

    const { desde = 0, limite = 10 } = req.query
    const activo = { estado: true }

    const [ total,categorias ] = await Promise.all([
        Categoria.countDocuments( activo ),
        Categoria.find( activo )
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    })
}

//Crear una nueva categoria
const crearCategoria = async (req,res = response) => {

    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({ nombre })

    //Verificiar si el nombre de la categoria existe 
    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        })
    }

    //data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data )
    await categoria.save()

    res.json(categoria)
}

//Obtener categoria por id
const obtenerCategoria = async (req,res = response) => {
    const { id } = req.params

    //verificar estado de la categoria
    const categoria = await Categoria.findById( id ).populate('usuario','nombre')
    // if( !categoria.estado ){
    //     return res.status(400).json({
    //         msg: 'La categoria no esta activa - estado false'
    //     })
    // }

    res.json(categoria)
}

//actualizar categoria
const actualizarCategoria = async (req,res = response) => {
    const { id } = req.params
    //Si no desea actualizar el estado agregar el estado en la desectruturación
    //const { estado, usuario, ...data } = req.body
    const { usuario, ...data } = req.body

    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate( id, data, { new:true } )
    
    res.json(categoria)
}

//Cambiar estado de la categoria
const borrarCategoria = async (req,res = response) => {
    const { id }= req.params

    //Verificamos el estado de la categoria
    const categoriaDB =  await Categoria.findById( id )
    if ( !categoriaDB.estado ){
        return res.status(400).json({
            msg: 'La categoria no esta activa - estado en falso'
        })
    }

    const categoria = await Categoria.findByIdAndUpdate( id, {estado:false}, {new:true})

    res.json(categoria)
}

module.exports = {
    obtenerCategorias,
    crearCategoria,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}