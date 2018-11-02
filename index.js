'use strict'
//libs
const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const formidable = require('express-form-data');
const fs = require('fs');

//modelos
const Member = require('./models/Members');
const Photo = require('./models/Images');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());
app.use(formidable.parse({keepExtensions: true}));


/* -------------------endpoints--------------------------- */
//get members
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

//add member 2
app.post('/api/member', (req, res)=>{
    console.log('POST /api/member2');
    console.log(req.body);
    console.log(req.files.photo);

    //extensión
    let extension = req.files.photo.name.split(".").pop();
    //indicador para crear el nombre del archivo
    let indexEmailOwner = req.body.email.split("@")[0];
    //crea el path del archivo
    let pathImage = `public/images/profiles/${indexEmailOwner}-profile.${extension}`;

    let newPhoto = {
        emailOwner: req.body.email,
        extension: extension,
        path: pathImage
    }

    let photo = new Photo(newPhoto);
    photo.save((err, photoStored)=>{
        if(!err){
            //cambia ubicación
            fs.rename(req.files.photo.path, pathImage);
            //retorna path
            console.log("Se guardó la foto");
            console.log(req.body);

            /* res.status(200).send({
                message: "Se guardó la foto",
                photoStored
            }); */

            let newMember = {
                name: req.body.name,
                profession: req.body.profession,
                email: req.body.profession,
                contactNumber: req.body.contactNumber,
                wspNumber: req.body.wspNumber,
                contactFacebook: req.body.contactFacebook,
                photo: photoStored.path
            }

            let member = new Member(newMember);

            member.save((err, memberStored)=>{
                if(!err){
                    res.status(200).send({
                        message: "Miembro agregado con exito",
                        memberStored
                    })
                }else{
                    res.status(500).send({
                        message: `Error al guardar nuevo miembro a la base de datos: ${err}`
                    });
                }
            });
            
        }else{
            return res.status(500).send({
                message: `Error al salvar la imagen del nuevo miebro en la base de datos: ${err}`
            });
        };
    });

});

//add member
/* app.post('/api/member', (req, res)=>{
    console.log('POST  /api/member');
    console.log(req.body);

    let newMember = new Member();
    newMember.name = req.body.name;
    newMember.profession = req.body.profession;
    newMember.email = req.body.email;
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
}); */

//get photo emailOwnerID
app.get('/api/image/:emailOwnerID', (req, res)=>{
    let emailOwnerID = req.params.emailOwnerID;
    Photo.find({emailOwner: emailOwnerID}, (err, photo)=>{
        if(!err){
            res.status(200).send({photo});
        }else if(!photo){
            return res.status(404).send({
                message: `No se encuentra la foto asociada al correo: ${emailOwnerID}`
            });
        }else{
            res.status(500).send({
                message: `Error en servidor: ${err}`
            });
        }
    })
});

//get photos
app.get('/api/image', (req, res)=>{
    Photo.find({}, (err, photos)=>{
        if(!err){
            res.status(200).send({photos});
        }else if(!photos){
            return res.status(404).send({
                message: `No se encuentran fotos guardadas`
            });
        }else{
            res.status(500).send({
                message: `Error en servidor: ${err}`
            });
        }
    })
});



//add Photo
/* app.post('/api/image', (req, res)=>{
    console.log("POST api/image");
    //extensión
    let extension = req.files.photo.name.split(".").pop();
    //indicador para crear el nombre del archivo
    let indexEmailOwner = req.body.emailOwner.split("@")[0];
    //crea el path del archivo
    let pathImage = `public/images/profiles/${indexEmailOwner}-profile.${extension}`;

    let newImage = {
        emailOwner: req.body.emailOwner,
        extension: extension,
        path: pathImage
    }
    let image = new Photo(newImage);
    image.save((err, photoStored)=>{
        if(!err){
            //cambia ubicación
            fs.rename(req.files.photo.path, pathImage);
            //retorna path
            return res.status(200).send(photoStored
        .path);
        }else{
            return res.status(500).send({
                message: `Error al salvar la imagen del nuevo miebro en la base de datos: ${err}`
            });
        };
    });
});
 */


/* -------------------------- conect database Mongo -------------------------------- */
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


