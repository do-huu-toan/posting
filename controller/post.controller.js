const AuthMiddleware = require('../middleware/auth.middleware');
const Post = require('../models/Post');
const User = require('../models/User');
const checkRole = require('../middleware/checkRole.middleware');

const create = async (req, res, next) => {

}

const getAll = async (req, res, next) => {
    const result = await Post.findAll();
    return result;
}

const getAllView = async (req, res, next) => {
    const result = await Post.findAll();
    return res.status(200).json(result);
}

const posting = async (req, res, next) => {
    const userIdOfPost = await AuthMiddleware.getIdByToken(req);
    var newPost = new Post({
        tittle: req.body.tittle,
        summary: req.body.summary,
        content: req.body.content,
        userId: userIdOfPost
    })
    const result = await newPost.save();
    if (result) {
        return res.redirect('/post/manager');
    }
    else {
        return res.status(501).json('Create Failed !');
    }

}

const removeById = async (req, res, next) => {

}

const getPostByUserId = async (req, res, next) => {
    const role = await checkRole.getRoleByToken(req);
    if (role == 'member') {
        const username = await AuthMiddleware.getUsernameByToken(req);
        const userId = await AuthMiddleware.getIdByToken(req);
        const userFound = await User.findByPk(userId, { include: Post });
        return userFound.Posts;
    }
}
const getPostById = async (req, res, next) => {
    const postId = req.params.id;
    const postFound = await Post.findByPk(postId)

    if (postFound) {
        return res.render('page', {
            post: postFound
        })
    }
    else {
        return res.status(200).json({ message: '404 Not Found' });
    }
}

const index = async (req, res, next) => {
    const role = await checkRole.getRoleByToken(req);

    console.log('Role: ', role);

    var data = [];
    if (role == 'admin') {
        data = await getAll(req, res, next)
        //return res.status(200).json(data);
    }
    else if (role == 'member') {
        data = await getPostByUserId(req, res, next);
        //console.log("Data: ", data);
        //return res.status(200).json(data);
    }
    username = await AuthMiddleware.getUsernameByToken(req);
    return res.render('post', {
        username: username,
        posts: data
    })

}
const createView = async (req, res, next) => {
    const username = await AuthMiddleware.getUsernameByToken(req);
    return res.render('post-create', {
        username: username,
    })
}

const getPostApi = async (req, res, next) => {
    const postId = req.params.id;
    const postFound = await Post.findByPk(postId)

    if (postFound) {
        return res.status(200).json(postFound);
    }
    else {
        return res.status(200).json({ message: '404 Not Found' });
    }
}

const editPostById = (req, res, next) => {

}

const updateView = async (req, res, next) => {

    const userId = await AuthMiddleware.getIdByToken(req);
    const postId = req.params.id;
    const postFound = await Post.findByPk(postId);




    if (await checkRole.getRoleByToken(req) == "admin" || userId == postFound.userId) //Nếu role admin hoặc là người tạo ra bài viết thì có quyền update
    {
        const result = await postFound.update({
            tittle: req.body.tittle,
            summary: req.body.summary,
            content: req.body.content
        })
        await index(req, res, next);
    }
    else {
        return res.json({
            userId: userId,
            userIdOfPost: postFound.userId
        });
    }
}

const removePostView = async (req, res, next) => {
    const userId = await AuthMiddleware.getIdByToken(req);
    const postId = req.params.id;
    const postFound = await Post.findByPk(postId);

    if (await checkRole.getRoleByToken(req) == "admin" || userId == postFound.userId) //Nếu role admin hoặc là người tạo ra bài viết thì có quyền update
    {
        try {
            const result = await postFound.destroy();
            await index(req, res, next);
        } catch (error) {
            return res.status(501).json(error)
        }        
    }
}

module.exports = {
    create,
    getAll,
    removeById,
    getPostByUserId,
    index,
    createView,
    posting,
    getPostById,
    getAllView,
    getPostApi,
    editPostById,
    updateView,
    removePostView
}



