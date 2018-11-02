'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    emailOwner:{type: String, required: true, unique: true},
    extension:{type: String, required: true},
    path: {type: String, required: true}
})

module.exports = mongoose.model("photo", photoSchema);