const { Router } = require('express')
const { check } = require('express-validator')

const { obtenerCategorias, crearCategoria, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categorias.controllers')

const { categoriaExiste } = require('../helpers/db-validators')
const { validarCampos, validarJWT, tieneRol } = require('../middlewares')

const router = Router()

router.get('/',obtenerCategorias)

router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

router.get('/:id', [
    check('id','No es un id valido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
],obtenerCategoria)

router.put('/:id', [
    validarJWT,
    tieneRol('ADMIN','MODERATOR'),
    check('id','No es un id valido').isMongoId(),
    check('id').custom(categoriaExiste),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
],actualizarCategoria)

router.delete('/:id', [
    validarJWT,
    tieneRol('ADMIN','MODERATOR'),
    check('id','NO es un id valido').isMongoId(),
    check('id').custom(categoriaExiste),
    validarCampos
],borrarCategoria)

module.exports = router