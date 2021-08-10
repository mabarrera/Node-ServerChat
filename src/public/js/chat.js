var url = (window.location.hostname.includes('localhost')) ? 'http://localhost:3000/api/auth/' : 'url de la web en produccion'

// 
let usuario = null
let socket = null

const txtUid = document.querySelector('#txtUid')
const txtMsg = document.querySelector('#txtMsg')
const ulUsuarios = document.querySelector('#ulUsuarios')
const ulMensajes = document.querySelector('#ulMensajes')
const btnSalir = document.querySelector('#btnSalir')

//Validar token localstorage
const validatJWT = async () => {
    const token =  localStorage.getItem('token') || ''

    if( token.length <= 10 ){
        window.location = './'
        throw new Error('No existe un token')
    }

    const resp = await fetch( url, {
        headers: { 'access_token': token }
    })

    const { usuario:usuarioDB,token:tokenDB } = await resp.json()
    localStorage.setItem( 'token',tokenDB )
    usuario = usuarioDB
    document.title = usuario.nombre

    await conectarSocket()
}

const conectarSocket = async () => {
    socket = io({
        'extraHeaders' : {
            'access_token': localStorage.getItem('token')
        }
    })

    socket.on('connect', () => {
        console.log('online');
    })

    socket.on('disconnect', () => {
        console.log('offline');
    })

    socket.on('recibir-mensajes', dibujarMensajes)

    socket.on('usuarios-activos', dibujarUsuarios )

    socket.on('mensaje-privado', ( payload ) => {
        console.log( payload );
    })
}

const dibujarUsuarios = ( usuarios = [] ) => {
    let usersHtml = ''
    usuarios.forEach(({ uid,nombre }) => {
        usersHtml += `<li><h5 class="text-success">${nombre}</h5><span class="">${uid}</span></li>`
    })
    ulUsuarios.innerHTML = usersHtml
}

const dibujarMensajes = ( mensajes = [] ) => {
    let MensajeHtml = ''

    mensajes.forEach(({ nombre,mensaje }) => {
        MensajeHtml += `<div><p><span class="text-primary">${nombre}:</span> ${mensaje}</p></div>`
    })
    ulMensajes.innerHTML = MensajeHtml
}

txtMsg.addEventListener('keyup', ({ keyCode }) => {
    const mensaje = txtMsg.value.trim()
    const uid = txtUid.value.trim()

    if( keyCode !== 13 ){ return }
    if( mensaje.length === 0 ){ return }
    //if( uid.length === 0 ){ return }

    socket.emit('enviar-mensaje', { mensaje,uid })
    txtMsg.value = ''

})

const main = async () => {
    validatJWT()
}

main ()

