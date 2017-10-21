const mysql = require('mysql');
const connection = mysql.createConnection({
  host  :'127.0.0.1',
  port  :'3306',
  user  :'root',
  password  :'',
  database  :'panelinha'
});


function createTable(conn){
  const sql = "CREATE TABLE 'cadastro' ('id' int NOT NULL AUTO_INCREMENT,'nome' VARCHAR(100) NULL, 'email' VARCHAR(100) NULL, 'senha' VARCHAR(100) NULL, PRIMARY KEY ('id')) ENGINE=InnoDB;";
  conn.query(sql, function(error, results, fields){
    if(error) return console.log(error);
    console.log('Criou a tabela');
  });
}

function addRows(conn){
  // const sql = "INSERT INTO teste (nome,cpf) VALUES ('Gustavo', '123456789')";
  const sql = "INSERT INTO teste (nome, cpf) VALUES ?";
  var values = [
   ['John', '71234523'],
   ['Peter', '14512564']];
  conn.query(sql,[values],function(error, results,fields){
    if(error) return console.log(error);
    console.log('adicionou ao registros!');
    conn.end();
  });
};

connection.connect(function(err){
  if(err) return console.log(err);
  console.log('Conectou!');
  // addRows(connection);
});
