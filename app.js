const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const config = require('./config/database');


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

// app.get('/blog', function(req, res){
//   res.send("Hello");
// });

//Route Files
let blog_posts = require('./routes/blog_posts');
app.use('/', blog_posts);

//Start Server
app.listen(3000, function(){
  console.log('Server started on port 3000');
});
