const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const postsRoutes = require("./routes/posts")

const app = express();

mongoose.connect("mongodb+srv://bekiaris:NA5QOwiZh3eZQAyf@cluster0.2wlci.mongodb.net/mean-stack-practice?retryWrites=true&w=majority")
    .then(() => {
        console.log("Connected to Database");
    })
    .catch(() => {
        console.log("Connection Failed")
    });

app.use(bodyParser.json());
app.use("/images", express.static(path.join("backend/images")));//give access to iamges to the frontend

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

app.use("/api/posts", postsRoutes);

module.exports = app;