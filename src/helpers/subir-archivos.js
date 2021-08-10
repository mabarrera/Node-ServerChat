const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivo = ( files, extensiones = ['jpg','png','jpeg','gif'], carpeta = 'images' ) => {

    return new Promise((resolve,reject) => {
       const { archivo } = files;
        const nombreArchivo = archivo.name.split('.')
        const extension = nombreArchivo[ nombreArchivo.length - 1 ]

        //Validar extenciones permitidas
        //const extensiones = ['jpg','png','jpeg','gif']
        if( !extensiones.includes( extension ) ){
            return reject(`La extencio ${extension} no esta permitida, ${extensiones}`)
        }

        const nombreFile = uuidv4() + '.' + extension
        const uploadPath = path.join( __dirname, '../public/', carpeta, nombreFile )
        archivo.mv(uploadPath, function(err) {
            if (err) {
                reject(err)
            }

            resolve(nombreFile)
        }); 
    })
}

module.exports = {
    subirArchivo
}