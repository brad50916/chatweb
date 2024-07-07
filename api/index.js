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
// app.post('/login', passport.authenticate('local', {
//     // successRedirect: '/profile',
//     failureRedirect: '/login',
//     failureFlash: true
//   }, (req, res) => {
//     console.log('Logged in', req);
//     // if (req.isAuthenticated) {
//     //     res.status(201).json({ message: 'Welcome to your profile', user: req.user });
//     // } else {
//     //     res.status(401).json({ message: 'Unauthorized' });
//     // }
// }));  

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log('Logged in', req.user);
        return res.status(201).json({ message: 'Welcome to your profile', user: req.user });
      });
    })(req, res, next);
  });

app.use('/', routes)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})