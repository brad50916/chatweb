const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const pool = require('./db');

// This should be replaced with your user model
// const User = require('./models/User');

// Serialize user into the session
passport.serializeUser((user, done) => {
  console.log("serilizing user");
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  console.log("deserilizing user");
  try {
    const results = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = results.rows[0];
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Local strategy for authentication
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req,  email, password, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length == 0) {
      console.log("User not found")
      return done(null, false, { message: 'User not found' });
    }
    const user = result.rows[0];
    // const isMatch = await bcrypt.compare(password, user.password);
    const isMatch = password === user.password;
    if (!isMatch) {
      console.log("Incorrect password")
      return done(null, false, { message: 'Incorrect password' });
    }
    console.log("authenticate successfully");
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

module.exports = passport;