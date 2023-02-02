
const mongoose = require('mongoose')

const dbConnection = async ()=>{
    try {
         mongoose.set('strictQuery', true);
         mongoose.connect(process.env.DB_CNN, {
                useNewUrlParser: true, 
                useUnifiedTopology: true
                
            }) 
         console.log('Db Online...')
    } catch (error) {
        console.log(error)
        throw new Error('Error al conectar a la base de datos')
    }
}

module.exports = {
   dbConnection,
}