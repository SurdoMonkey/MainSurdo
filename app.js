const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


mongoose.connect(config.database);
let db = mongoose.connection;

//Check DB connection
db.once('open', function(){
  console.log('Connected to MongoDB')
});

//Check for DB errors
db.on('error', function(err){
  console.log(err);
});

//Bring in Models
let BlogPost = require('./models/blog');

//Init App
const app = express();

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  // cookie: { secure: true }
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//Passport config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


app.get('/', function(req, res){
  BlogPost.find({}, function(err, blogPosts){
    if(err){
      console.log(err);
    } else {
      res.render('index',{
        blogPosts: blogPosts
      });
    }
  });
});


//Route Files
let blog_posts = require('./routes/blog_posts');
let users = require('./routes/users');
app.use('/', blog_posts);
app.use('/users', users);

//Start Server
app.listen(4000, function(){
  console.log('Server started on port 4000');
});
