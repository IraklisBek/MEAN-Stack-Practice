const express = require("express");
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images"); //the path is relative with where server.js is
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post("",
    checkAuth, // I am putting the middleware before multer because i dont want images if not loggedin
    multer({ storage: storage }).single("image"), (req, res, next) => {
        const url = req.protocol + '://' + req.get("host");
        const post = new Post({
            title: req.body.title,
            content: req.body.content,
            imagePath: url + "/images/" + req.file.filename,
            creator: req.userData.userId
        }); //.body is vy body-parser
        post.save().then(createdPost => {
            res.status(201).json({
                message: "Post added successfully",
                post: {
                    ...createdPost,
                    id: createdPost._id,
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Creating a post failed"
            })
        });
    });
//router.put put a new resource and completely replace the old one
//router.patch to only update an existing resource with new values
router.put("/:id", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    }); //.body is vy body-parser
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.nModified > 0) {
            res.status(200).json({
                message: 'Update successful!'
            });
        } else {
            res.status(401).json({
                message: 'Not Authorized'
            });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Updating a post failed"
        })
    });
})

router.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery.find()
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        })
        .then(count => {
            res.status(200).json({
                message: "Posts fetched succesfully!",
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: "Fetching posts failed"
            })
        });
});

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found!' });
        }
    })
    .catch(error => {
        res.status(500).json({
            message: "Fetching post failed"
        })
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({
                    message: 'Post Deleted!'
                });
            } else {
                res.status(401).json({
                    message: 'Not Authorized'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: "Delete post failed"
            })
        });
});

module.exports = router;