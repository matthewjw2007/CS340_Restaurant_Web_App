// Boilerplate
var express = require("express");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require("path");
app.use(express.static('public'));

//Set the view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', '8001');

// Render Landing Page
app.get('/', function(req,res){
    //The below code is how to use my style .css sheets
    app.use(express.static(__dirname + '/views'));
    //Handlebars code if the user is logged out
    const loggedOut = {loggedOut: true};
    //Handlebars code if the user is logged in
    //The below code is the .hbs file that will be rendered
    res.render('home', loggedOut);
});

app.listen(app.get('port'), function(){
    console.log('Express has started on localhost!');
});