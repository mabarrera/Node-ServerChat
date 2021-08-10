const { response } = require("express");
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL )

const { subirArchivo } = require("../helpers");
const { Usuario, Producto } = require("../models");


const cargarArchivo = async (req, res = response) => {
    try {
        const nombre = await subirArchivo( req.files )
        res.json({ nombre })
    } catch (error) {
        res.status(400).json({msg: error})
    }
}

const actualizarImagen = async (req,res = response) => {
    const { coleccion,id } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un usuario con este id'
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un producto con este id'
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }
    
    try {
        //Limpiar imagenes
        if( modelo.img ){
            //Imagen borrar del servidor
            const archivo = path.join( __dirname, '../public/images/', coleccion, modelo.img )
            if( fs.existsSync( archivo ) ){
                fs.unlinkSync( archivo )
            }
        }

        //Subir imagen
        const nombre = await subirArchivo( req.files, undefined, 'images/'+coleccion )
        modelo.img = nombre
        await modelo.save()
        res.json( modelo )
    } catch (error) {
        res.status(400).json({msg: error})
    }
}

const actualizarImagenCloudinary = async (req,res = response) => {
    const { coleccion,id } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un usuario con este id'
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un producto con este id'
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }
    
    if( modelo.img ){
        const imagen = modelo.img.split('/')
        const archivo = imagen[ imagen.length - 1 ]
        const [ public_id ] = archivo.split('.')
        //Borrar archivo en cloudinary
        cloudinary.uploader.destroy( `node-Cafe/${coleccion}/${public_id}` )
    }

    const { tempFilePath } = req.files.archivo
    //Implementando carga en cloudinary
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath,{ folder: `node-Cafe/${coleccion}` } )

    modelo.img = secure_url
    await modelo.save()

    res.json({ modelo })
}

const mostrarImagen = async (req,res = response) => {
    const { coleccion,id } = req.params

    let modelo

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un usuario con este id'
                })
            }
        break;
        case 'productos':
            modelo = await Producto.findById( id )
            if( !modelo ){
                return res.status(400).json({
                    msg:'No existe un producto con este id'
                })
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            })
    }
    
    try {
        //Limpiar imagenes
        
        if( modelo.img ){
            //Imagen borrar del servidor
            const archivo = path.join( __dirname, '../public/images/', coleccion, modelo.img )
            if( fs.existsSync( archivo ) ){
                return res.sendFile( archivo )
            }
        }
        //mostrar una imagen por default
        const imagen = path.join( __dirname, '../public/images/no-image.jpg' )
        res.sendFile( imagen )
    } catch (error) {
        res.status(400).json({msg: error})
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen
}