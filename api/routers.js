const express = require('express');
const pool = require('./db');
const router = express.Router();
const JWT_SECRET = 'cutecat';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10

router.get('/search', async (req, res) => {
    const username = req.query.username;
    console.log(username);
    if (!username) {
      return res.status(400).send('Username is required');
    }
  
    try {
      const user = await pool.query('SELECT * FROM users WHERE username LIKE $1', [username + '%']);
      console.log(user.rows);
      if (user.rows.length === 0) {
        return res.status(404).send('User not found');
      }
      res.status(200).json(user.rows[0]);
    } catch (err) {
      console.error('Error executing query', err.stack);
      res.status(500).send('Internal Server Error');
    }
  });

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization; 
    if (!token) {
        return res.status(401).json({ message: 'Auth token is not provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Replace with your secret key
        req.userId = decoded.id; 
        next(); // Move to next middleware
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

router.get('/verify', verifyToken, (req, res) => {
    // Access userId from request object
    const userId = req.userId;
    res.status(200).json({ userId: userId, message: 'Protected route accessed' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length == 0) {
          console.log("User not found")
          return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        // const isMatch = password === user.password;
        if (!isMatch) {
          console.log("Incorrect password");
          return res.status(404).json({ message: 'Incorrrect password' });
        }
        console.log("authenticate successfully");
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token: token, message: 'Login successfully', user_id: user.id });
    } catch (error) {
        console.log(error);
    }
});

router.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password, username } = req.body;
    // console.log(firstname, lastname, email, password);
    const encrypted = await bcrypt.hash(password, saltRounds);
    try {

        const results = await pool.query('INSERT INTO users (firstname, lastname, email, password, username) VALUES ($1, $2, $3, $4, $5) RETURNING id', 
        [firstname, lastname, email, encrypted, username]);
        res.status(201).json({ message: 'User added', userId: results.rows[0].id });
      } catch (error) {
        res.status(500).json({ error: error.toString() });
      }
});

module.exports = router;