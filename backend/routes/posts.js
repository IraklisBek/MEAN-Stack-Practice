const express = require("express");

const PostsController = require("../controllers/posts")

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file-upload");

const router = express.Router();


router.get("",
    PostsController.getPosts
);

router.get("/:id",
    PostsController.getPost
);

// I am putting the middleware before multer because i dont want images if not loggedin
router.post("",
    checkAuth,
    extractFile,
    PostsController.addPost
);

//router.put put a new resource and completely replace the old one
//router.patch to only update an existing resource with new values
router.put("/:id",
    checkAuth,
    extractFile,
    PostsController.updatePost
);

router.delete("/:id",
    checkAuth,
    PostsController.deletePost
);

module.exports = router;