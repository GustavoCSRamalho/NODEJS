module.exports = function(app) {

var Schema = require('mongoose').Schema;

var UsuarioSchema = new Schema({
    id:{type: Number, required: false},
    email: {type: String, required: false, index:{unique: true}},
    senha: {type: String, required: false}

});

// return db.model('Usuario', UsuarioSchema);
return UsuarioSchema;
};



//Original


// module.exports = function(app) {
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// var UsuarioSchema = new Schema({
//     email: String,
//     senha: String
// });
//
// module.exports = mongoose.model('Usuario', UsuarioSchema);
// };
