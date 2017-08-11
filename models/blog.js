let mongoose = require('mongoose');

let blogSchema= mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required: true
  },
  body:{
    type:String,
    require: true
  }
})

let BlogPost = module.exports = mongoose.model('BlogPost', blogSchema);
