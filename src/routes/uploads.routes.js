const { Router } =  require('express')
const { check } = require('express-validator')
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controllers')
const { coleccionesPermitidas } = require('../helpers')
const { validarJWT, validarCampos, validarArchivoSubir } = require('../middlewares')

const router = Router()

router.post('/', validarArchivoSubir,cargarArchivo)

router.put('/:coleccion/:id', [
    //validarJWT,
    check('coleccion').custom( c => coleccionesPermitidas( c,['usuarios','productos'] )),
    check('id','No es un Id valido').isMongoId(),
    validarArchivoSubir,
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    //validarJWT,
    check('coleccion').custom( c => coleccionesPermitidas( c,['usuarios','productos'] )),
    check('id','No es un Id valido').isMongoId(),
    validarCampos
], mostrarImagen)

module.exports = router