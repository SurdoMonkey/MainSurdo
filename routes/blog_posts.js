const express = require('express');
const router = express.Router();

// Bring in Blog Model
let blogPosts = require('../models/blog');

//Show blog posts
router.get('/blog', function(req, res){
  blogPosts.find({}, function(err, blogposts){
    if(err){
      console.log(err);
    } else {
      res.render('blog', {
        blogposts: blogposts
      });
    }
  });
});

module.exports = router;
