const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models')

//const chatMensajes = new ChatMensajes()
const chatMensajes = new ChatMensajes()

const socketController = async ( socket = new Socket(),io ) => {
    console.log('a socket connection', socket.id);
    

    const usuario = await comprobarJWT(socket.handshake.headers['access_token'])
    if( !usuario ){
        return socket.disconnect()
    }

    //Agegar usuarios conectados
    chatMensajes.conectarUsuario( usuario )
    io.emit('usuarios-activos', chatMensajes.usuariosArr )
    io.emit('recibir-mensajes', chatMensajes.ultimos10 )

    //Conectarlo a uan sala especial
    socket.join( usuario.id ) //global - socket id / usuario id

    //Limpiar desconeccion
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario( usuario.id )
        io.emit('usuarios-activos', chatMensajes.usuariosArr )
    })

    socket.on('enviar-mensaje', ({ uid,mensaje }) => {
        if( uid ){
            socket.to( uid ).emit('mensaje-privado', { de:usuario.nombre,mensaje })
        } else {
            chatMensajes.enviarMensajes( usuario.id,usuario.nombre,mensaje )
            io.emit('recibir-mensajes', chatMensajes.ultimos10 )
        }
        
    })

    console.log('Se conecto', usuario.nombre);
}

module.exports = {
    socketController
}