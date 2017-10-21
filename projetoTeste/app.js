var express = require('express')
, load = require('express-load')
, app = express();
var bodyParser  = require('body-parser');
var http = require('http'),
mongoose = require('mongoose');
// global.db = mongoose.connect('mongodb://gustavo:gustavo@ds135534.mlab.com:35534/nodebd');
var cookieParser = require('cookie-parser');
var session = require('express-session');
//Banco de dados configuração
const mysql = require('mysql');
const connection = mysql.createConnection({
  host  :'127.0.0.1',
  port  :'3306',
  user  :'root',
  password  :'',
  database  :'panelinha'
});

load('models')
.then('controllers')
.then('routes')
.into(app);

var Usuario = app.models.usuario;
// var UsuarioTeste = app.models.teste;
// app.get('/teste',function(req, res){
//   user = new UsuarioTeste();
//   user.email = "Foiii";
//   console.log("Usuario : "+user.email);
// });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({secret: 'keyboard cat'}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render('home/index');
});
app.get('/cadastrar', function(req, res){
  res.render('home/cadastro');
});

app.post('/login',function(req, res){
  // var usuario1 = app.models.usuario;
  var conn = connection;
  var usuario = req.body.usuario;
  var email = req.body.usuario.email;
  var senha = req.body.usuario.senha;
  console.log('Email : '+email+" Senha : "+senha);
  var str = "select * from cadastro where email="+"'"+email+"'";
  console.log(str);
  conn.query(str,function(err, user){
    if(err){
      console.log('Usuario não existe!');
      console.log('itens bd : '+user);
      res.redirect('/');
    }else{

      console.log("Agora foi = "+user[0].email+" outro : "+user[0].id);
      // console.log(user);
      // console.log(user.email);
      // console.log("Erro : "+err);
      if(email === user[0].email && senha === user[0].senha){
        usuario.id = user[0].id;
        req.session.usuario = usuario;
        console.log("id = "+req.session.usuario.id);
        // console.log(req.session.usuario.id);
        // console.log("Id = "+id);
        console.log('Achei o usuario e ele se logou!!');
        // res.render('painel/painel');
        res.redirect('/painel');
      }else{
        console.log("Não achei!");
          res.redirect("/");
      }
      }
    })
    // conn.end();
    });

  app.get('/entrar_grupo',function (req, res){
    if(!req.session.usuario){
        res.redirect('/');
    }
    res.render('painel/entrar_grupo');
  });

  app.post('/entrar_grupo',function(req, res){
    var nome_grupo = req.body.nome_grupo;
    var usuario = req.session.usuario;
    console.log("-------------------usuario = "+usuario.id);
    console.log(nome_grupo);
    var str = "select * from grupo where descricao = '"+nome_grupo+"';";
    connection.query(str, function(err, grupo){
      if(err){
        console.log(err);
      }else{
        console.log("Grupo a entrar  = "+grupo);
        if(grupo == 0){
          console.log("Não existe");
          res.render('avisos/entrar_grupo');
        }else{
          console.log("Id do grupo = "+grupo[0].id);
          var str = "insert into grupo_membros (grupo_id, cadastro_id)"+
          " values('"+grupo[0].id+"','"+usuario.id+"');";
          connection.query(str, function(err, grupo){
            if(err){
              console.log(err);
            }else{
              console.log("----------------Vocẽ entrou no grupo!!!!!");
              res.redirect('/painel');
            }
          });
        }
      }
    });
    // conn.end();
  });

  app.post('/novo_grupo', function(req, res){
    var conn = connection;
    console.log("Criando novo grupo!");
    var nome_grupo = req.body.nome_grupo;
    console.log(nome_grupo);
    var str = "select * from grupo where descricao = '"+nome_grupo+"';";
    conn.query(str, function(err, user){
      if(err){
        console.log("Não existe no bd, você pode criar!");
      }else{
        if(user == 0){
          console.log("Null");
          var str = "insert into grupo(descricao) values ('"+nome_grupo+"')";
          conn.query(str, function(err, user){
            if(err){
              console.log(err);
              res.render("avisos/novo_grupo");
            }else{
              console.log("Grupo criado com sucesso.");
              res.redirect("/painel");
            }
          });
        }
        else{
          console.log("Ok , not null");
          res.render("avisos/novo_grupo");

        }
        console.log(user);
        console.log("Vocễ não pode criar o grupo com o mesmo nome!");
      }
    });
    // conn.end();

  });
  app.get('/novo_grupo', function(req, res){
    if(!req.session.usuario){
      res.redirect("/");
    }
    res.render("painel/novo_grupo");
  });

  app.get('/sair',function(req, res){
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/painel',function(req, res){
    if(!req.session.usuario){
      res.redirect("/");
    }
    console.log("Estou pronto!");
    var usuario = req.session.usuario;
    console.log("Bem vindo : "+usuario.email + "id :"+usuario.id);
    var str = "select grupo.id, grupo.descricao from grupo join"+
    " grupo_membros on grupo_membros.grupo_id = grupo.id where "+
    "grupo_membros.cadastro_id = "+usuario.id+";";
    connection.query(str,function(err, users){
    if(err){
      console.log(err);
    }else{
      console.log("Peraaa!!!");
      var params = {grupo : users};
      console.log(users);
      console.log("funcionou!mandou!");
      res.render('painel/painel', params);
    }

  });
    // console.log("Não funciou painel!")
    // res.render('painel/painel');
  });

  // Usuario.findOne(query).select('email senha').exec(function(erro, usuario){
  //   if(usuario){
  //     res.render('painel/painel');
  //   }else{
  //     console.log('Não achou no bd!'+usuario.email);
  //     res.redirect('/');
  //   }
  // })

  // res.json({message : email});
app.post('/cadastrar', function(req, res){
  var conn = connection;
  var nome = req.body.usuario.nome;
  var email = req.body.usuario.email;
  var senha = req.body.usuario.senha;
  var senhaConf = req.body.usuario.senhaConf;
  if (senha == senhaConf) {
    var value = "'"+nome+"'"+","+"'"+email+"'"+","+"'"+senha+"'";
    addRows(conn, value);
    console.log('Adicionado no banco de dados+--');
    // res.json({Message : 'Cadastro feito com sucesso!'});
    // res.send('Dados validos com sucesso!',500);
    res.render('avisos/sucesso');
  }else{
    console.log("GSDGFGFGFErro");
    res.render('home/cadastro');
  }
  // conn.end();
  //res.json({Message : 'As senhas não conferem!'});
  // res.render('home/cadastro');

});
//Funções banco de dados
function addRows(conn, values){
  // const sql = "INSERT INTO teste (nome,cpf) VALUES ('Gustavo', '123456789')";
  const sql = "INSERT INTO cadastro (nome, email,senha) VALUES ("+values+")";
  conn.query(sql,function(error, results,fields){
    if(error) return console.log(error);
    console.log('adicionou ao registros!');
    // conn.end();
  });
};

app.listen(3100, function(){
console.log("Ntalk no ar.");
});
