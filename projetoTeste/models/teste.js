module.exports = function(app) {

var Schema = require('mongoose').Schema;

var UsuarioTeste = new Schema({
    id:{type: Number, required: false},
    email: {type: String, required: false, index:{unique: true}},
    senha: {type: String, required: false}

});

return UsuarioTeste;
};
