const express = require("express");
const bodyParser = require("body-parser");

const mongoose =require("mongoose");

const Post = require("./models/post");


const app = express();

mongoose.connect("mongodb://ramu:Ramu1234@cluster0-shard-00-00-8pvfz.mongodb.net:27017,cluster0-shard-00-01-8pvfz.mongodb.net:27017,cluster0-shard-00-02-8pvfz.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
  , {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
  .then(() => {
    console.log('Connected to database..!');
  })
  .catch((error) => {
    console.log(error);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts',(req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message:'Post added successfully',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts',(req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({message: "Post deleted" });
  })
});

module.exports = app;
