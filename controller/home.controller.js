const PostController = require('./post.controller')

const index = async (req, res, next) => {
    try {
        const allPost = await PostController.getAll();
        return res.render('home', {
            posts: allPost
        })
    } catch (error) {

    }

}

module.exports = {
    index
}