const User = require('../models/User')
const jwt = require('jsonwebtoken');

function createToken(ObjectID) {
    var token = jwt.sign({ id: ObjectID }, process.env.SECRET_TOKEN);
    return token;
}

const auth = async (req, res) => {
    try {
        const UserFound = await User.findOne({
            where: {
                usename: req.body.usename,
                password: req.body.password
            }
        });

        if(UserFound)
        {
            var token = createToken(UserFound.id);
            console.log(token);
            res.cookie('token', token);
            return res.redirect('/manager');
        }
        else{
            return res.redirect("/login");
        }
    } catch (error) {
        return res.redirect("/login");
    }
    /*
    
        User.findOne({
            usename: req.body.usename,
            password: req.body.password
        }).then(data => {
            console.log("Data: ", data);
            var token = createToken(data.id);
            //console.log(token);
            res.cookie('token', token);
            return res.redirect('/');
        }).catch(err => {
            //console.log(err);
            return res.redirect("/login");
        })
        */
}

module.exports = {
    auth
}