'use strict'
//libs
//const fs = require('fs');
var fs = require('fs.extra');

//models
const Member = require('../models/Members');
const Photo = require('../models/Images');


function getMember(req, res) {
    let memberID = req.params.memberID;

    Member.findById(memberID, (err, member) => {
        //error
        if (err) return res.status(500).send(
            { message: `Error al realizar la petición para id: ${memberID}` }
        );
        //no existe member
        if (!member) return res.status(404).send({
            message: `El miembro con id: ${memberID} No Existe`
        });
        //todo bien
        res.status(200).send({ member });
    })
}

function getMembers(req, res) {
    Member.find({}, (err, members) => {

        //error
        if (err) return res.status(500).send({
            message: `Error al realizar la consulta de los miembros: ${err}`
        });

        //no hy productos
        if (!members) return res.status(404).send({
            message: `No hay miembros registrados`
        });

        //todo oki
        res.status(200).send({ members });
    })
}

function saveMember(req, res) {
    console.log('POST /api/member');
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
    photo.save((err, photoStored) => {
        if (!err) {
            //cambia ubicación
            fs.copy(req.files.photo.path, pathImage, (err)=>{
                if(!err){
                    console.log("Se ha guardado la imagen exitosamente en el servidor")
                }else{
                    console.log(`Problemas al guardar la imagen. error: ${err}`)
                }
            });
            //retorna path
            console.log("Se guardó la foto");
            console.log(req.body);

            //----coment!
            res.send({
                message: "Se guardó la foto",
                photoStored
            });

            /* let newMember = {
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
             */
        } else {
            return res.status(500).send({
                message: `Error al salvar la imagen del nuevo miebro en la base de datos: ${err}`
            });
        };
    });

    let newMember = {
        name: req.body.name,
        profession: req.body.profession,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        wspNumber: req.body.wspNumber,
        contactFacebook: req.body.contactFacebook,
        photo: newPhoto.path
    }

    let member = new Member(newMember);

    member.save((err, memberStored) => {
        if (!err) {
            res.status(200).send({
                message: "Miembro agregado con exito",
                memberStored
            })
        } else {
            res.status(500).send({
                message: `Error al guardar nuevo miembro a la base de datos: ${err}`
            });
        }
    });

}

function deleteMember(req, res) {
    let memberID = req.params.memberId;

    //busca en base de datos
    Member.findByIdAndRemove(memberID, (err) => {
        if (!err) {
            //no error al elimnar
            res.status(200).send({
                message: 'El miembro ha sido elimnado'
            });
        } else {
            //en caso de error al aliminar
            res.status(500).send({
                message: `Error al eliminar miembro. Error: ${err}`
            })
        }
    })
}



function updateMember(id) {
    console.log("falta")
}

module.exports = {
    getMember,
    getMembers,
    deleteMember,
    saveMember,
    updateMember
}