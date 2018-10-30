'use strict'
//libs
const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//modelos
const Member = require('./models/Members');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());


//endpoints
//get
app.get('/api/member', (req,res)=>{
    Member.find({}, (err, members)=>{

        //error
        if(err) return res.status(500).send({
            message: `Error al realizar la consulta de los miembros: ${err}`
        });

        //no hy productos
        if(!members) return res.status(404).send({
            message: `No hay miembros registrados`
        });

        //todo oki
        res.status(200).send({members});
    })
});

//get member/:id
app.get('/api/member/:memberID', (req,res)=>{
    let memberID = req.params.memberID;

    Member.findById(memberID, (err, member)=>{
        //error
        if(err) return res.status(500).send(
            {message: `Error al realizar la petición para id: ${memberID}`}
        );
        //no existe member
        if(!member) return res.status(404).send({
            message: `El miembro con id: ${memberID} No Existe`
        });
        //todo bien
        res.status(200).send({member});
    })
});

//add member
app.post('/api/member', (req, res)=>{
    console.log('POST  /api/member');
    console.log(req.body);

    let newMember = new Member();
    newMember.name = req.body.name;
    newMember.profession = req.body.profession;
    newMember.contactNumber = req.body.contactNumber;
    newMember.wspNumber = req.body.wspNumber;
    newMember.contactFacebook = req.body.contactFacebook;
    newMember.photo = req.body.photo;

    newMember.save((err, memberStored)=>{
        //error
        if(err) res.status(500).send({
            message: `Error al salvar nuevo miembro en la base de datos: ${err}`
        });
        //todo bello todo bonito
        res.status(200).send({
            member: memberStored
        });
    })
});

mongoose.connect('mongodb://localhost:27017/efrenApp',(err, res)=>{
    if(err) {
        return console.log("Error al conectar a la base de datos");
    }
    //si no hay error
    console.log("Conexión a la base de datos establecida");
    
    app.listen(port, ()=> {
        console.log(`Api Rest corriendo en http://localhost:${port}`)
    });
})

