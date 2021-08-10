const { Router } = require('express')
const { check } = require('express-validator')

const { obtenerProductos, crearProducto, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/productos.controllers')

const { productoExiste, categoriaExiste } = require('../helpers/db-validators')
const { validarJWT, validarCampos, tieneRol } = require('../middlewares')

const router = Router()

router.get('/', obtenerProductos)

router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria','La categoria no es valida').isMongoId(),
    check('categoria').custom(categoriaExiste),
    validarCampos
],crearProducto)

router.get('/:id', [
    check('id','No es un id valido').isMongoId(),
    check('id').custom(productoExiste),
    validarCampos
], obtenerProducto)

router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN','MODERATOR'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(productoExiste),
    //check('categoria','La categoria no es valida').isMongoId(),
    //check('categoria').custom(categoriaExiste),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN','MODERATOR'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(productoExiste),
    validarCampos
],borrarProducto)

module.exports = router