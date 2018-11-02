'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberSchema = Schema({
    name: String,
    profession: String,
    email: {type: String, unique: true},
    contactNumber: {type: String, default: "No"},
    wspNumber: {type: String, default: "No"},
    contactFacebook: {type: String, default: "No"},
    photo: String
})

module.exports = mongoose.model('Member', MemberSchema);


