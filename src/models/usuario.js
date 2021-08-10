const { Schema,model } = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        default: 'EDITOR',
        enum: ['ADMIN','MODERATOR','EDITOR']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
})  
//Mostrar datos seleccionado - Serialización
UsuarioSchema.methods.toJSON =  function(){
    const { __v, password, _id, ... usuario } = this.toObject()
    usuario.uid = _id
    
    return usuario
}

module.exports = model('Usuario', UsuarioSchema)