'use strict'
//libs
const mongoose = require('mongoose');

//app
const app = require('./app');

//config
const config = require('./config');

/* -------------------------- conect database Mongo -------------------------------- */
mongoose.connect(config.db,(err, res)=>{
    if(err) {
        return console.log("Error al conectar a la base de datos");
    }
    //si no hay error
    console.log("Conexión a la base de datos establecida");
    
    app.listen(config.port, ()=> {
        console.log(`Api Rest corriendo en http://localhost:${config.port}`)
    });
})


