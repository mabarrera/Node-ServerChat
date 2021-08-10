const dbValidators  = require('./db-validators')
const generarJwt    = require('./generar-jwt')
const googleVerify  = require('./google-verify')
const subirArchivo  = require('./subir-archivos')

module.exports = {
    ...dbValidators,
    ...generarJwt,
    ...googleVerify,
    ...subirArchivo
} 
