'use strict'
//libs
const mongoose = require('mongoose');

//app
const app = require('./app');

//config
const config = require('./config');

/* -------------------------- conect database Mongo -------------------------------- */
mongoose.connect('mongodb://johnathanmb95:johnathanmb95@ds161099.mlab.com:61099/econtacts-database',(err, res)=>{
    if(err) {
        return console.log("Error al conectar a la base de datos");
    }
    //si no hay error
    console.log("Conexión a la base de datos establecida");
    
    app.listen(config.port, ()=> {
        console.log(`Dirname: ${__dirname}`);
        console.log(`Api Rest corriendo en http://localhost:${config.port}`)
    });
})


