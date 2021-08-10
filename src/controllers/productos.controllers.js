const { response } = require("express")
const { Producto, Categoria } = require('../models')

//Obtener todos los productos
const obtenerProductos = async (req,res = response) => {
    const { desde = 0, limite = 10 } = req.query
    const activo = { estado: true }

    const [ total,productos ] = await Promise.all([
        Producto.countDocuments( activo ),
        Producto.find( activo )
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    res.json({
        total,
        productos
    })
}

//Crear nuevos productos
const crearProducto =  async (req,res = response) => {

    const { estado,usuario, ...body } = req.body

    const productoDB = await Producto.findOne({ nombre: body.nombre })
    if( productoDB ){
        return res.status(400).json({
            msg:'El producto ya existe'
        })
    }

    const data = {
        ...body,
        nombre: body.nombre.trim(),
        usuario: req.usuario._id
    }

    const producto = new Producto( data )
    await producto.save()
    
    res.status(201).json(producto)
}

//Obtener producto por id
const obtenerProducto =  async (req,res = response) => {
    const { id } = req.params

    //Verificar estado del producto
    const producto = await Producto.findById( id ).populate('usuario','nombre').populate('categoria','nombre')
    if( !producto.estado ){
        return res.status(400).json({
            msg:'El producto no existe - Estado Falso'
        })
    }

    res.json(producto)
}  

//Actualizar producto
const actualizarProducto =  async (req,res = response) => {
    const { id } = req.params
    //Si no desea actualizar el estado agregar el estado en la desectruturación
    //const { estado, usuario, ...data } = req.body
    const { estado, usuario, ...data } =  req.body

    if( data.nombre ){
        data.nombre = data.nombre.trim()
    }
    data.usuario = req.usuario._id

    const productoDB = await Producto.findById( id )
    //Validamos el estado del producto
    if( !productoDB.estado ){
        return res.status(400).json({
            msg: 'No existe el producto - estado en falso'
        })
    }
    
    //Verificar si se ha enviado la categoria
    if( data.categoria ){
        const categoriaDB = await Categoria.findById( data.categoria )        
        //Validamos si la categoria tiene esta activo
        if( !categoriaDB.estado ){
            return res.status(400).json({
                msg:'No existe la categoria - estado en falso'
            })
        }
    }
    

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true})
    res.json(producto)
}

//Borrar productos
const borrarProducto =  async (req,res = response) => {
    const { id } = req.params

    const productoDB = await Producto.findById( id )
    if( !productoDB.estado ){
        return res.status(400).json({
            msg:'No existe el producto - Estado falso'
        })
    }

    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true})
    res.json(producto)
}

module.exports = {
    obtenerProductos,
    crearProducto,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}