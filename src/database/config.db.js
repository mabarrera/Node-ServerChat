const mongoose = require('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log('Database connect');
    } catch (err) {
        console.log(err);
        throw new Error('La conexion a la BD ha fallado')
    }
}

module.exports = dbConnection