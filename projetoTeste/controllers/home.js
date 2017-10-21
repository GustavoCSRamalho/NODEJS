module.exports = function(app) {
  var Usuario  = require('../models/usuario');

  var HomeController = {
    index: function(req, res) {
      res.render('home/index');
    }
    // login: function(req,res) {
    //   // var usuario = new Usuario();
    //
    //   //aqui setamos os campos do usuario (que virá do request)
    //   var login = req.body.login;
    //   var senha = req.body.senha;
    //   console.log('ok');
    //   res.render('home/index');
    //
    //   }
  };
  return HomeController;
};
