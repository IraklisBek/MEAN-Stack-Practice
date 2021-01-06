const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://bekiaris:NA5QOwiZh3eZQAyf@cluster0.2wlci.mongodb.net/mean-stack-practice?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(() => {
        console.log("Connection Failed")
    })
app.use(bodyParser.json());

app.use((req, res, next) => { //no filter, e.g. /api/posts cause i am doing it for all requests
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, PUT, OPTIONS"
    );
    next();//we use next if we are not returning a response
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    }); //.body is vy body-parser
    post.save().then(createdPost => {
        res.status(201).json({
            message: "Post added successfully",
            postId: createdPost._id
        });
    });
});

app.get("/api/posts", (req, res, next) => {
    Post.find()
        .then(documents => {
            res.status(200).json({
                message: "Posts fetched succesfully!",
                posts: documents
            });
        });
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log(result);
            res.status(200).json({ message: "Post Deleted" });
        });
});

module.exports = app;