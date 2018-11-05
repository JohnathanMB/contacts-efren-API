'use strict'
//libs
const fs = require('fs');

//models
const Photo = require('../models/Images');

function getPhoto(req, res){
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
};

function getPhotos(req, res){
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
}

function savePhoto(req, res){
    console.log("POST api/photo");
    //extensión
    let extension = req.files.photo.name.split(".").pop();
    //indicador para crear el nombre del archivo
    let indexEmailOwner = req.body.emailOwner.split("@")[0];
    //crea el path del archivo
    let pathphoto = `public/photos/profiles/${indexEmailOwner}-profile.${extension}`;

    let newphoto = {
        emailOwner: req.body.emailOwner,
        extension: extension,
        path: pathphoto
    }
    let photo = new Photo(newphoto);
    photo.save((err, photoStored)=>{
        if(!err){
            //cambia ubicación
            fs.rename(req.files.photo.path, pathphoto);
            //retorna path
            return res.status(200).send(photoStored
        .path);
        }else{
            return res.status(500).send({
                message: `Error al salvar la photon del nuevo miebro en la base de datos: ${err}`
            });
        };
    });
}

function deletePhoto(req, res){
    console.log("Falta")
}

function updatePhoto(req, res){
    console.log("falta")
}

function getPhotoPath(req, res){
    /* let emailOwnerID = req.params.emailOwnerID; */
    let path = req.params.pathPhoto;
    res.sendFile(__dirname + path);
};

module.exports = {
    getPhoto,
    getPhotos,
    savePhoto,
    deletePhoto,
    updatePhoto,
    getPhotoPath
}