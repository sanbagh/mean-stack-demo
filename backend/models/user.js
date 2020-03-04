const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator")
const userSchemma = mongoose.Schema({
    email: {type: String, require: true, unique:true},
    password: { type: String, require:true}
});

userSchemma.plugin(mongooseUniqueValidator);
module.exports =  mongoose.model('User', userSchemma);