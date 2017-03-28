#!/usr/bin/env nodejs --use_strict
/*
https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-16-04
*/


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
var easyimg = require('easyimage');


//  =============================================================
//  =============================================================
//  =============================================================
//  =============================================================

var  dbCon =  mysql.createPool({
      host            : 'localhost',
      user            : 'root',
      password        : '3mpathy',
      database        : 'mindSlot',
      connectionLimit : 10,               // this is the max number of connections before your pool starts waiting for a release
      multipleStatements : true           // I like this because it helps prevent nested sql statements, it can be buggy though, so be careful
  });


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
app.get('/userList', function (req, res) {
   
  dbCon.query('SELECT * FROM mindSlot.players ORDER BY tiempo', function(err, rows){
    res.render('userList', {data : rows});
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
  
  //console.log(req.body)
  //console.log(req.files)



  if(req.files.foto_usuario){

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  let sampleFile = req.files.foto_usuario;
 
  // Use the mv() method to place the file somewhere on your server 

  var mod = Date.now();
  var nombre = mod+"_"+req.files.foto_usuario.name;



            sampleFile.mv('./public/uploads/'+nombre, function(err) {
              if (err){
              	console.log(err)
              	return res.status(500).send(err);	
              }

              easyimg.thumbnail({
                      src:'./public/uploads/'+nombre, dst: './public/uploads/thumbs/'+nombre,
                      width:180,
                      height:135,
                      x:0, y:0
                  }).then(function (file) {


                      // insert
                      var data  = {
                        nombre: req.body.nombre, 
                        foto: nombre,
                        tiempo: req.body.tiempo,
                        firma: req.body.firma_usuario,
                        apellido: req.body.apellido,
                        dni: req.body.dni,
                        tlf: req.body.tlf 
                      };

                      dbCon.query('INSERT INTO mindSlot.players SET ?', data, function(err, result) {
                         // Neat!
                        console.log(err);

                        //res.send('/userList', {data : 'rows'});
                        res.redirect('/newUser');
                        //res.send(200);

                       });

                      
                  });


              
            });
  }else{
                      var data  = {
                        nombre: req.body.nombre, 
                        foto: "abanca_pantalla.png",
                        tiempo: req.body.tiempo,
                        firma: req.body.firma_usuario,
                        apellido: req.body.apellido,
                        dni: req.body.dni,
                        tlf: req.body.tlf 
                      };

                      dbCon.query('INSERT INTO mindSlot.players SET ?', data, function(err, result) {
                         // Neat!
                        console.log(err);

                        //res.send('/userList', {data : 'rows'});
                        res.redirect('/newUser');
                        //res.send(200);

                       });
  }


});

//// panel de administracion

// lista usuarios
app.get('/admin/list', function(req,res){

  dbCon.query('SELECT * FROM mindSlot.players ORDER BY tiempo', function(err, rows){
    //res.setHeader('Content-Type', 'application/json');
    res.render('userRecordsList', {data : rows});
    //console.log(JSON.stringify(rows));
  });

});
// update usuario
app.post('/admin/update', function(req,res){
  //console.log(req.body);
    var data  = {
      nombre: req.body.nombre, 
      tiempo: req.body.tiempo,
      apellido: req.body.apellido,
      dni: req.body.dni,
      tlf: req.body.telefono,
    };

  dbCon.query('UPDATE mindSlot.players SET ? WHERE idplayer = ?', [data, req.body.idplayer], function(err, rows){
    if (err) {
      console.log(err);
    }
    res.send(200);
  })

});
// delete usuario
app.post('/admin/delete', function(req,res){

  dbCon.query('DELETE FROM mindSlot.players WHERE idplayer='+req.body.idplayer, function(err, rows){
    if (err) {
      console.log(err);
    }
    res.send(200);
  })
  
  
});







app.get('/get/json', function(req,res){

  dbCon.query('SELECT * FROM mindSlot.players ORDER BY tiempo', function(err, rows){
    //res.setHeader('Content-Type', 'application/json');
    res.send(rows);
    //console.log(JSON.stringify(rows));
  });

});


app.get('/get/jsonOF', function(req,res){

  dbCon.query('SELECT * FROM mindSlot.players ORDER BY tiempo LIMIT 10', function(err, rows){
    //res.setHeader('Content-Type', 'application/json');
    res.send(rows);
    //console.log(JSON.stringify(rows));
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

