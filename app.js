// Boilerplate
var express = require("express");
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.use(express.static('public'));

//Set the view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
port = process.env.PORT || 53232;

// Set up for body parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

//This section is set up for MYSQL db 
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_dreikorh',
    password        : '0118',
    database        : 'cs340_dreikorh',
    multipleStatements: true
  });

// @route   GET request /
// @ desc   Render Landing Page
// @access  Public
app.get('/', (req,res) => {
    var context = {};
    context.title = "Gastro Gnomes Homepage";
    context.loggedOut = false;
    res.render('home', context);
});

// @route   GET request /
// @ desc   Render List of Current Users
// @access  Public
app.get('/users', (req,res) => {
  var context = {};
  context.title = "Current Users";
  pool.query('SELECT usr_id, usr_name FROM user_info', function(err, results, fields) {
    if(err){
      next(err);
      return;
    }
    // Sends the information for each of the rows
  context.users = results;
  res.render('users', context);
  });
});

// @route   GET request lists
// @desc    Shows the page when user is not selected
// @access  Public
app.get('/lists', function(req, res){
  var context = {};
  context.title = "List Display";
  res.render('lists', context);
});

// @route   GET request lists
// @desc    Shows the page when user is selected but not a list
// @access  User specific
app.get('/lists/:usr_id', function(req,res, next) {
  var context = {};
  context.title = "List Display";
  var sql = 'SELECT p.lst_id, name FROM priority_list p JOIN user_list u ON p.lst_id = u.lst_id WHERE usr_id = ?; SELECT usr_name FROM user_info WHERE usr_id = ?; SELECT r.rec_id, name FROM rr_recommendations r WHERE r.usr_id = ?;';
  var inserts = [req.params.usr_id, req.params.usr_id, req.params.usr_id];
  //Selects all the rows in the user's selected list and displays them.
  pool.query(sql, inserts, function(err, results, fields) {
    if(err){
      console.log(error);
      res.write(JSON.stringify(error));
      res.end();
    }
  // Sends the information for each of the rows
  context.usr_id = req.params.usr_id;
  context.lists = results[0];
  context.usr_name = results[1];
  context.rec_lists = results[2];
  context.name = [{name : "Select a List to Display."}];
  res.render('lists', context);
  });
});

// @route   GET request lists
// @desc    Shows the page when user and priority list are selected.
// @access  User and list specific
app.get('/lists/:usr_id/:lst_id', function(req, res){
  var context = {};
  context.title = "List Display";
  var sql = 'SELECT p.lst_id, name FROM priority_list p JOIN user_list u ON p.lst_id = u.lst_id WHERE usr_id = ?; SELECT * FROM restaurant_info r JOIN rr_pri_list rp ON r.rr_id = rp.rr_id WHERE lst_id = ?; SELECT usr_name FROM user_info WHERE usr_id = ?; SELECT name FROM priority_list WHERE lst_id = ?; SELECT r.rec_id, name FROM rr_recommendations r WHERE r.usr_id = ?;';
  var inserts = [req.params.usr_id, req.params.lst_id, req.params.usr_id, req.params.lst_id, req.params.usr_id];
  //Selects all the rows in the user's selected list and displays them.
  pool.query(sql, inserts, function(err, results, fields) {
    if(err){
      console.log(error);
      res.write(JSON.stringify(error));
      res.end();
    }
  // Sends the information for each of the rows
  context.usr_id = req.params.usr_id;
  context.lst_id = req.params.lst_id;
  context.lists = results[0];
  context.pri_list_rr = results[1];
  context.usr_name = results[2];
  context.name = results[3];
  context.rec_lists = results[4];
  context.is_pri = 1;
  res.render('lists', context);
  });
});

// @route   GET request rec lists
// @desc    Shows the page when user and rec list are selected.
// @access  User and list specific
app.get('/lists/:usr_id/rec/:lst_id', function(req, res){
  var context = {};
  context.title = "List Display";
  var sql = 'SELECT p.lst_id, name FROM priority_list p JOIN user_list u ON p.lst_id = u.lst_id WHERE usr_id = ?; SELECT * FROM restaurant_info r JOIN rr_rec_list rc ON r.rr_id = rc.rr_id WHERE rec_id = ?; SELECT usr_name FROM user_info WHERE usr_id = ?; SELECT name FROM rr_recommendations WHERE rec_id = ?; SELECT r.rec_id, name FROM rr_recommendations r WHERE r.usr_id = ?;';
  var inserts = [req.params.usr_id, req.params.lst_id, req.params.usr_id, req.params.lst_id, req.params.usr_id];
  //Selects all the rows in the user's selected list and displays them.
  pool.query(sql, inserts, function(err, results, fields) {
    if(err){
      console.log(error);
      res.write(JSON.stringify(error));
      res.end();
    }
  // Sends the information for each of the rows
  context.usr_id = req.params.usr_id;
  context.lst_id = req.params.lst_id;
  context.lists = results[0];
  context.rr_rec_list = results[1];
  context.usr_name = results[2];
  context.name = results[3];
  context.rec_lists = results[4];
  context.is_rec = 1;
  res.render('lists', context);
  });
});

app.get('/addRR/:usr_id/:lst_id', function(req,res){
  var context = {};
  context.title = "Add Restaurant";
  res.render('addRR', context);
});

app.post('/addRR/:usr_id/:lst_id/addRR', function(req, res, next){
  var sql = "INSERT INTO restaurant_info (rr_name, rr_address, rr_city, rr_state, rr_zip, rr_foodType) VALUES (?, ?, ?, ?, ?, ?)";
  var inserts = [req.body.rr_name, req.body.rr_address, req.body.rr_city, req.body.rr_state, req.body.rr_zip, req.body.rr_foodType];
  pool.query(sql, inserts, function(error, results, fields) {
    if(error){
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
      }  else {
          sql = "INSERT INTO rr_pri_list (lst_id, rr_id) VALUES (?, ?)";
          insert = [req.params.lst_id, results.insertId];
          pool.query(sql, insert, function(error, results) {
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                return;
            } else {
                console.log('Success! Restaurant added to pri list.');
                var redir_path = req.params.usr_id + "/" + req.params.lst_id;
                res.redirect('/lists/' + redir_path);
            }
          });
      }
  });
});

// @route   GET add user form
// @desc    Shows the form to add a new user
// @access  Public
app.get('/addUsr', function(req,res){
  var context = {};
  context.title = "Add New User";
  res.render('addUsr', context);
});

// @route   POST new user
// @desc    Adds a new user to the database
// @access  Internal
app.post('/addUsr', function(req, res) {
  console.log(req.body.usr_name + req.body.passcode);
  var sql = "INSERT INTO user_info (usr_name, passcode) VALUES(?,?)";
  var inserts = [req.body.usr_name, req.body.passcode];
  pool.query(sql, inserts, function(error, results, fields) 
  {
    if(error){
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
      } else {
        console.log('Success!');
        res.redirect('/users');
      }
  });
});

// @route   GET new list
// @desc    Adds a new list to the user in DB
// @access  Public
app.get('/addList/:usr_id', function(req,res){
  var context = {};
  context.title = "Add New List";
  res.render('addList', context);
});

// @route   POST new list
// @desc    Adds a new list for the user in the DB
// @access  Internal
app.post('/addList/:usr_id/addList', function(req,res){
  var sql = "";
  var redir_path = req.originalUrl.split('addList')[0] + "lists/" + req.params.usr_id;
  // Check to see if it is a recommendation list or not, then add accordingly.
  if (req.body.check_rec === 'on') {
    sql = "INSERT INTO rr_recommendations (name, usr_id) VALUES (?, ?)";
    var insert = [req.body.lst_name, req.params.usr_id];
    pool.query(sql, insert, function(error, results) {
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
          return;
        } else {
          console.log('Success! Inserted new recommendation list.');
          res.redirect(redir_path);
        }
    });
  } else {
    sql = "INSERT INTO priority_list (name) VALUES (?)";
    var inserts = [req.body.lst_name];
    pool.query(sql, inserts, function(error, results) {
      if(error){
          console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
          return;
        } else {
          sql = "INSERT INTO user_list (lst_id, usr_id) VALUES(?, ?)";
          inserts = [results.insertId, req.params.usr_id];
          pool.query(sql, inserts, function(error, results) {
            if(error){
                console.log(JSON.stringify(error));
                res.write(JSON.stringify(error));
                res.end();
                return;
              } else {
                console.log('Success! Inserted new list.');
                res.redirect(redir_path);
              }
          });
        }
    });
  }
});

// @route   DELETE a list
// @desc    Deletes a list from user list M to M relationship
// @access  Internal
app.delete('/lists/:usr_id/:lst_id', function(req, res) {
  var sql = "DELETE FROM user_list WHERE lst_id = ? AND usr_id = ?";
  var inserts = [req.params.lst_id, req.params.usr_id];
  pool.query(sql, inserts, function(error, results) {
    if(error){
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
      } else {
        console.log('Success! List deleted');
        res.status(202).end();
      }
  });
});

// @route   DELETE rec list
// @desc    Deletes a recommendation list from user
// @access  Internal
app.delete('/lists/:usr_id/rec/:lst_id', function(req, res) {
  console.log("In the delete rec restaurant route.");
  var sql = "DELETE FROM rr_recommendations WHERE rec_id = ? AND usr_id = ?";
  var inserts = [req.params.lst_id, req.params.usr_id];
  pool.query(sql, inserts, function(error, results){
    if (error) {
      console.log(JSON.stringify(error));
      res.write(JSON.stringify(error));
      res.end();
      return;
    } else {
      console.log('Success! Rec list deleted.');
      res.status(202).end();
    }
  });
});

// @route   DELETE restaurant
// @desc    Deletes a restaurant from a priority list
// @access  Internal
app.delete('/lists/:usr_id/:lst_id/:rr_id', function(req, res) {
  console.log("In delete restaurant route.");
  var sql = "DELETE FROM rr_pri_list WHERE rr_id = ? AND lst_id = ?";
  var inserts = [req.params.rr_id, req.params.lst_id];
  pool.query(sql, inserts, function(error, results) {
    if(error){
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
      } else {
        console.log('Success! Restaurant deleted');
        res.status(202).end();
      }
  });
});

// @route   DELETE restaurant
// @desc    Deletes a restaurant from a rec list
// @access  Internal
app.delete('/lists/:usr_id/rec/:lst_id/:rr_id', function(req, res) {
  console.log("In delete recommendation restaurant route.");
  var sql = "DELETE FROM rr_rec_list WHERE rr_id = ? AND rec_id = ?";
  var inserts = [req.params.rr_id, req.params.lst_id];
  pool.query(sql, inserts, function(error, results) {
    if(error){
        console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
      } else {
        console.log('Success! Restaurant deleted from recommendation list.');
        res.status(202).end();
      }
  });
});

// @route   GET restaurants
// @desc    Show the list of all the restaurants in the DB
// @access  Public
app.get('/restaurants', function(req,res){
  var context = {};
  context.title = "Restaurants";
  var sql = "SELECT * FROM restaurant_info";
  pool.query(sql, function(error, results, fields) {
    if(error){
      console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
    }
    // Sends the information for each of the rows
    context.restaurants = results;
    res.render('restaurants', context);
  });
});

// @route   GET recommendation lists
// @desc    Show the form to submit a restaurant addition to a specific rec list.
// @access  Public
app.get('/recRR/:usr_id/:rr_id', function(req,res){
  var context = {};
  console.log("In recRR route.");
  var sql = "SELECT rec_id, name FROM rr_recommendations WHERE usr_id = ?";
  var inserts = [req.params.usr_id];
  pool.query(sql, inserts, function(error, results) {
    if(error) {
      console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
    } else {
      context.title = "Select List";
      context.recommendation_list = results;
      res.render('recommend', context);
    }
  });
});

// @route   POST recommendation lists/ rr add
// @desc    Add the chosen restaurant to the chosen rec list.
// @access  Internal
app.post('/recRR/:usr_id/:rr_id/recRR', function(req, res) {
    console.log('In recRR route.');
    var redir_path = req.originalUrl.split('recRR')[0] + "lists/" + req.params.usr_id + "/rec/" + req.body.reclist;
    var sql = "INSERT INTO rr_rec_list (rec_id, rr_id) VALUES (?, ?)";
    var inserts = [req.body.reclist, req.params.rr_id];
    pool.query(sql, inserts, function(error, results) {
      if(error) {
        console.log(JSON.stringify(error));
          res.write(JSON.stringify(error));
          res.end();
          return;
      } else {
        res.redirect(redir_path);
      }
    });
});

// @route   GET search form
// @desc    Allows user to submit form to search for friend they want to add.
// @access  Public
app.get('/findFriend/:lst_id', function(req,res){
  var context = {};
  context.title = "Find Friend";
  context.user_searched = 0;
  context.lst_id = req.params.lst_id;
  res.render('findFriend', context);
});

// @route   POST search form
// @desc    Searches user_info in DB to find match for user search.
// @access  Internal
app.post('/findFriend/:lst_id', function(req, res) {
  console.log("In find friend post route.");
  var context = {};
  var sql = "SELECT usr_id, usr_name FROM user_info WHERE usr_name LIKE '%" + req.body.searchItem + "%'";
  pool.query(sql, function(error, results) {
    if(error) {
      console.log(JSON.stringify(error));
        res.write(JSON.stringify(error));
        res.end();
        return;
    } else if (results === undefined || results.length == 0){
      console.log("NO results.");
      context.not_found = "1";
      context.lst_id = req.params.lst_id;
      res.render('findFriend', context);
    } else {
      console.log(results);
      context.found = "1";
      context.user = results;
      context.lst_id = req.params.lst_id;
      res.render('findFriend', context);
    }
  });
});

// @route   POST add user to list
// @desc    Adds the chosen user to the specific priority list.
// @access  Internal
app.post('/addFriend/:lst_id', function(req,res){
  var context = {};
  console.log("In add friend route.");
  var sql = "INSERT INTO user_list (lst_id, usr_id) VALUES (?, ?); SELECT usr_name FROM user_info WHERE usr_id = ?";
  var inserts = [req.params.lst_id, req.body.addUsr, req.body.addUsr];
  pool.query(sql, inserts, function(error, results) {
    if(error) {
      console.log(JSON.stringify(error));
      res.write(JSON.stringify(error));
      res.end();
      return;
    } else {
      context.lst_id = req.params.lst_id;
      context.added_success = 1;
      context.usr_name = results[1];
      res.render('findFriend', context);
    }
  });
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

app.listen(port, () => {
    console.log(`Express has started on port ${port}!`);
});
