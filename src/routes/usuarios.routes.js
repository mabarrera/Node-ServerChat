const { Router} = require('express')
const { check } = require('express-validator')

const { validarCampos,validarJWT,esAdminRole,tieneRol } = require('../middlewares')

// const { validarCampos } = require('../middlewares/validar-campo')
// const { validarJWT } = require('../middlewares/validar-jwt')
// const { esAdminRole, tieneRol } = require('../middlewares/validar-roles')

const { esRoleValido, emailExiste, usuarioExiste } = require('../helpers/db-validators')
const { getUsuarios, postUsuarios, putUsuarios, deleteUsuarios } = require('../controllers/usuarios.controllers')

const router = Router()

router.get('/', getUsuarios)

router.post('/', [
    check('nombre','EL nombre es requerido').not().isEmpty(),
    check('password','EL password debe ser mas de 6 letras').isLength({min:6}),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    //check('rol','No es un rol valido').isIn(['ADMIN','MODERATOR']),
    check('rol').custom( esRoleValido ),
    validarCampos
], postUsuarios)

router.put('/:id', [
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(usuarioExiste),
    check('rol').custom( esRoleValido ),
    validarCampos
], putUsuarios)

router.delete('/:id', [
    validarJWT,
    //esAdminRole,
    tieneRol('ADMIN','MODERATOR'),
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(usuarioExiste),
    validarCampos
],deleteUsuarios)

module.exports = router