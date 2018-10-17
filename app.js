// Boilerplate
var express = require("express");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.use(express.static('public'));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', '8001');

// Render Landing Page
app.get('/', function(req,res){
  res.render('home');
});

app.get('/lists', function(req,res){
  res.render('lists');
});

app.get('/about', function(req,res){
  res.render('about');
});

app.listen(app.get('port'), function(){
  console.log('Express has started on localhost!');
});