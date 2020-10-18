//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose=require("mongoose");

const homeStartingContent = "Welcome to my Blog Website! The next version will enable you to create an avatar and follow other avatars. Stay Tuned!";
const aboutContent = "This Blog is the implemetation of whatever i've learnt about  Web Dev so far. I will soon be updating it with authentication and multiple schemas.";
const contactContent = "github : puneet601";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-Puneet:TZ1ESGMg6qwFqTCB@cluster0.yutuu.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema={
title:String,
content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  
    Post.find({},function(err,posts){
if(!err)
{
  res.render("home",{
    startingContent: homeStartingContent,

    posts: posts

    });
}
    });
    });


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
    
  });

  post.save(function(err){
    
 res.redirect("/");
   
 
  });

  

});
var requestedId=0;
app.get("/posts/:postId", function(req, res){
  requestedId=req.params.postId;
   
  Post.findOne({_id:requestedId},function(err,post){
if(!err)
{
      res.render("post", {
        title: post.title,
        content: post.content,
        id:post._id
      });
    }
  });
 
});
app.post("/delete",function(req,res){
  console.log("here");
  
  console.log(requestedId);
  Post.findByIdAndRemove(requestedId,function(err,post){
    if(err)
    console.log(err);
    else
    console.log("Deleted");
  });
  res.redirect("/");

});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);