// Boilerplate
var express = require("express");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require("path");
app.use(express.static('public'));

//Set the view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', '53232');

// Render Landing Page
app.get('/', function(req,res){
    var context = {};
    context.title = "Gastro Gnomes Homepage";
    context.loggedOut = true;
    res.render('home', context);
});

app.get('/lists', function(req,res){
  var context = {};
  context.title = "List Display";
  res.render('lists', context);
});

app.get('/addRR', function(req,res){
  var context = {};
  context.title = "Add Restaurant";
  res.render('addRR', context);
});

app.get('/addUsr', function(req,res){
  var context = {};
  context.title = "Add New User";
  res.render('addUsr', context);
});

app.get('/addList', function(req,res){
  var context = {};
  context.title = "Add New List";
  res.render('addList', context);
});

app.get('/findFriend', function(req,res){
  var context = {};
  context.title = "Find Friend";
  res.render('findFriend', context);
});

app.get('/edit', function(req,res){
  var context = {};
  context.title = "Edit Account";
  res.render('edit', context);
});

app.get('/about', function(req,res){
  var context = {};
  context.title = "About Gastro Gnomes";
  res.render('about', context);
});

app.listen(app.get('port'), function(){
    console.log('Express has started on localhost!');
});
