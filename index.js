require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");
const isProduction = process.env.NODE_ENV === 'production';
const authMiddleware = require('./middleware/auth.middleware');

const init = false;

//Database
const db = require('./models/database');
const initDatabase = require('./models/Init');

if(init)
{
  db.sync({force: init}).then(() => {
    initDatabase();
  });
}
else{
  db.sync({force: false})
}
//app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.set('views', 'view');
app.set('view engine', 'ejs');

app.use(morgan('combined'));
app.use(express.urlencoded({
  limit: '50mb'
}));
app.use(express.static('public'))

//Route:
const UserRoute = require('./routes/user.route');
const RoleRoute = require('./routes/role.route')
const AuthRoute = require('./routes/auth.route')
const PostRoute = require('./routes/post.route')

app.use('/auth', AuthRoute);
app.use('/role', RoleRoute);
app.use('/user', authMiddleware.authenicate, UserRoute);
app.use('/post', PostRoute);


app.get('/login', authMiddleware.authenicateLogin,(req, res) => {
  res.render('login');
});

app.get('/logout', (req, res) => {
  res.clearCookie("token");
  return res.redirect('/login');
})


app.get('/manager', authMiddleware.authenicate, async (req, res) => {
  const user = await authMiddleware.getUsernameByToken(req);
  console.log("Username: ", user)
  return res.render('index', {
    username: user
  });
});

app.get('/home', (req, res) => {
  return res.render('home');
})
app.get('/post-test', (req, res) => {
  return res.render('post-test')
})


app.listen(port, () => {
  console.log(`Running on port: ${port}...`)
})