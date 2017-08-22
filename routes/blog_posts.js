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

//Add Blog Post GET Route
router.get('/blog/add', ensureAuthenticated, function(req, res){
  res.render('add_blog_post');
});

//Add Blog Post POST Route
router.post('/blog/add', function(req, res){
req.checkBody('title', 'Title is required').notEmpty();
req.checkBody('body', 'Body is required').notEmpty();

  //Get errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_blog_post', {
      errors:errors
    });
  } else {
    let blogPost = new blogPosts();
    blogPost.title = req.body.title;
    blogPost.author = req.user.first_name;
    blogPost.body = req.body.body;

    blogPost.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article Added');
        res.redirect('/blog');
      }
    });
  }
});

// Load Edit form
router.get('/blog/edit/:id', function(req, res){
  blogPosts.findById(req.params.id, function(err, blogPost){
    res.render('edit_blog_post',{
      blogPost: blogPost
    });
  });
});

// Update Submit POST Route
router.post('/blog/edit/:id', function(req, res){
  let blogPost = {};
  blogPost.title = req.body.title;
  blogPost.author = req.body.author;
  blogPost.body = req.body.body;

  let query = {_id:req.params.id}

  blogPosts.update(query, blogPost, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      res.redirect('/blog');
    }
  });
});

//Delete article Route
router.delete('/blog/:id', function(req, res){
  let query = {_id:req.params.id}

  blogPosts.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//View Single Blog posts
router.get('/blog/:id', function(req, res){
  blogPosts.findById(req.params.id, function(err, blogPost){
    res.render('blog_post', {
      blogPost: blogPost
    });
  });
});

//Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
