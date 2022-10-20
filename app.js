//jshint esversion:6

const express = require("express"); // Require external Node Modules
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


//Connect to the MongoDB with Database named BlogDB
mongoose.connect("mongodb+srv://admin-jose:test1234@cluster0.gjh5mwg.mongodb.net/blogDB");

const homeStartingContent = "This Blog should be available 24/7. Anyone can make a post going to the navigation tab and selecting 'Compose'. Your post can also be deleted by anyone who choses to click on the delete post button";
const aboutContent = "Hey everyone! This website it just a web application for bloggin. It will only be used as an experimental project to test Client-Side, Server Application and Databse";
const contactContent = "No contact information will be available this moment since the website is for testing purposes only.";


// use the express module
const app = express();

//set the view engine for ejs
app.set('view engine', 'ejs');

//use bodyParser to aquire javascript objects via the server
app.use(bodyParser.urlencoded({
  extended: true
}));
// make the folder public static for access
app.use(express.static("public"));

// let posts = [];


// Create schema for the JSON like documents
const postSchema = new mongoose.Schema({
  // delare fields and their type of data
  title: String,
  content: String
});


// Create model for the Collect named Post using the post Schema
const Post = mongoose.model("Post", postSchema);

const defaultPost = new Post({
  title: "Lord of the Rings",
  content: "Her is the breif content of the Post"
});

// when client access the "/"
app.get("/", function(req, res) {
  Post.find({}, function(err, postArray) {
    // console.log(foundItems);
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: postArray
      });
    }

    // if (postArray.length === 0) {
    //
    //   const defaultPost = new Post({
    //     title: "Lord of the Rings",
    //     content: "Her is the breif content of the Post"
    //   });
    //   defaultPost.save();
    //   res.redirect("/");
    // } else {
    //   res.render("home", {
    //     startingContent: homeStartingContent,
    //     posts: postArray
    //   });
    // }



  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});


app.post("/compose", function(req, res) {

  const post = new Post({
    title: _.lowerCase(req.body.postTitle),
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.post("/deletePost", function (req, res) {
  const deleteTitle = req.body.deletePost;

  Post.deleteOne({title: deleteTitle}, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect("/");
    }
  });

});

app.get("/posts/:postName", function(req, res) {
  const requestedTitle = _.lowerCase(req.params.postName);

  Post.find({}, function(err, postArray) {

    postArray.forEach(function(post) {
      let storedTitle = _.lowerCase(post.title);
      if (storedTitle === requestedTitle) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    });

  });
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function() {
  console.log("Server started on port 3000");
});
