const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')
const socketIO = require('socket.io')

const dbConnection = require('../database/config.db');
const { socketController } = require('../sockets/sockets.controllers');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer( this.app )
        this.io = socketIO( this.server )

        this.base = '/api'
        this.paths = {
            auth:       this.base + '/auth',
            usuarios:   this.base + '/usuarios',
            categorias: this.base + '/categorias',
            productos:  this.base + '/productos',
            buscar:     this.base + '/buscar',
            uploads:    this.base + '/uploads'
        }

        //Database
        this.dbConnect()

        //Midlewares
        this.middleware();
        
        //Routes
        this.routes();

        //Socket events
        this.sockets()
    }

    async dbConnect(){
        await dbConnection()
    }

    middleware(){
        
        this.app.use(cors())
        this.app.use(express.json())

        //Cara de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            //createParentPath: true //Para crear un directorio si en caso no existe
        }));

        //Arcivos publicos
        this.app.use(express.static('src/public'))

    }

    routes(){
        this.app.use( this.paths.auth, require('../routes/auth.routes') )
        this.app.use( this.paths.usuarios, require('../routes/usuarios.routes') )
        this.app.use( this.paths.categorias, require('../routes/categorias.routes') )
        this.app.use( this.paths.productos, require('../routes/productos.routes'))
        this.app.use( this.paths.buscar, require('../routes/buscar.routes'))
        this.app.use( this.paths.uploads, require('../routes/uploads.routes') )
        this.app.get('*', (req,res) => {
            res.json({
                msg: 'no existe esta url'
            })
        })

    }

    sockets(){
        this.io.on('connection', ( socket ) => socketController( socket,this.io ) ) 
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('Server on port ', this.port);
        })
    }
}

module.exports = Server