'use strict'

//libs
const express = require('express');
const api = express.Router();

//controllers
const memberCtrl = require('../controllers/member');
const photoCtrl = require('../controllers/photo');

/*----------------members-------------*/
//get members (all)
api.get('/member', memberCtrl.getMembers);
//get member/:id
api.get('/member/:memberID',memberCtrl.getMember);
//add member
api.post('/member', memberCtrl.saveMember);
//delete member
api.delete('/member/:memberId', memberCtrl.deleteMember);

/*--------------Photos----------*/
//get photo emailOwnerID
api.get('/photo/:emailOwnerID', photoCtrl.getPhoto);
//get photos
api.get('/photo', photoCtrl.getPhotos);
//add Photo
/*
api.post('/photo', photoCtrl.savePhoto);
 */

 module.exports = api