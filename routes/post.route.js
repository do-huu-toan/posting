const express = require('express');
const PostController = require('../controller/post.controller');
const authMiddleware = require('../middleware/auth.middleware');
const checkRole= require('../middleware/checkRole.middleware');

var router = express.Router();
router.route('/')
    .get(PostController.getAll);
router.route('/manager')
    .get(authMiddleware.authenicate, PostController.index)
router.route('/create')
    .get(authMiddleware.authenicate, PostController.createView)
    .post(authMiddleware.authenicate, PostController.posting)
router.route('/search/:id')
    .get(PostController.getPostById)
module.exports = router