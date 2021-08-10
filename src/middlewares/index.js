const validaCampos      = require('./validar-campo')
const validarJWT        = require('./validar-jwt')
const validarRoles      = require('./validar-roles')
const validarArchivoSubir = require('./validar-archivo')

module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validarRoles,
    ...validarArchivoSubir
}