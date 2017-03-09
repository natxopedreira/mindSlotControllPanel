'use_strict';

var fs = require('fs');
var express = require('express');
var app = express();
var mysql      = require('mysql');
var path = require('path');
var mustacheExpress = require('mustache-express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var mv = require('mv');

//  =============================================================
//  =============================================================
//  =============================================================
//  =============================================================
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json());

app.engine('html', mustacheExpress());          // register file extension mustache
app.set('view engine', 'html');                 // register file extension for partials
app.set('views', __dirname + '/public/views');
app.use(express.static(__dirname + '/public')); // set static folder
app.use(express.static(__dirname + '/public/uploads')); // set static folder

// configure upload middleware
app.use(fileUpload());

/*
CREATE TABLE `mindSlot`.`players` (
  `idplayer` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NULL,
  `foto` VARCHAR(45) NULL,
  `tiempo` VARCHAR(45) NULL,
  PRIMARY KEY (`idplayer`),
  UNIQUE INDEX `idplayers_UNIQUE` (`idplayer` ASC));
*/

//  =============================================================
//  =============================================================
// raiz, mostramos los participantes
app.get('/', function (req, res) {
   
   dbCon.query('SELECT * FROM players', function(err, rows){
    res.render('players', {data : rows});
  });

})

//  =============================================================
//  =============================================================
app.get('/newUser', function(req, res) {
	res.render('newUser');
})

//  =============================================================
//  =============================================================
app.post('/createUser', function(req, res) {
  //if (!req.files)
  //  return res.status(400).send('No files were uploaded.');
  
  console.log(req.body)

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.foto_usuario;
 
  // Use the mv() method to place the file somewhere on your server 
  sampleFile.mv('./public/uploads/'+req.files.foto_usuario.name, function(err) {
    if (err){
    	console.log(err)
    	return res.status(500).send(err);	
    }

    res.sendStatus(200);
  });

});



//  =============================================================
//  =============================================================
// iniciamos el webserver
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

