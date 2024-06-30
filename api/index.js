const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 5001
const routes = require('./routers')
const cors = require('cors')
const passport = require('./passportConfig');
const session = require('express-session');
const flash = require('connect-flash');

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(session({
    secret: 'secret cat',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Login route
app.post('/login', passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }));  
  
app.get('/profile', (req, res) => {
    res.status(201).json({ message: 'Welcome to your profile', user: req.user });
});
// app.get('/profile', isAuthenticated, (req, res) => {
//     res.status(201).json({ message: 'Welcome to your profile', user: req.user });
// });
app.use('/', routes)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})