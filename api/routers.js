const express = require('express');
const pool = require('./db');
const router = express.Router();
const JWT_SECRET = 'cutecat';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/getMessage', async (req, res) => {
    const chatId = req.query.chatId;
    try {
        const results = await pool.query('SELECT * FROM messages WHERE chat_id = $1 ORDER BY sent_at ASC', [chatId]);
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.get('/getToUserId', async (req, res) => {
    const chatId = req.query.chatId;
    const userId = req.query.userId;
    try {
        const results = await pool.query('SELECT * FROM chats WHERE chat_id = $1', [chatId]);
        if (results.rows[0]['user1_id'] == userId) {
            res.status(200).json(results.rows[0]['user2_id']);
        } else {
            res.status(200).json(results.rows[0]['user1_id']);
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.get('/getAllChatRoomData', async (req, res) => {
    const userId = req.query.userId;
    try {
        // Check if the pair already exists
        const checkQuery = 'SELECT * FROM chats WHERE (user1_id = $1) OR (user2_id = $1)';
        const checkResults = await pool.query(checkQuery, [userId]);
        if (checkResults.rows.length > 0) {
            return res.status(200).json(checkResults.rows);
        } else {
            return res.status(404).json({ message: 'No chat room found' });
        }

    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


router.post('/getChatRoomId', async (req, res) => {
    const { user_id, friend_id } = req.body;
    try {
        // Check if the pair already exists
        const checkQuery = 'SELECT * FROM chats WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)';
        const checkResults = await pool.query(checkQuery, [user_id, friend_id]);
        if (checkResults.rows.length > 0) {
            return res.status(409).json({ message: 'Chat pair already exists', chatId: checkResults.rows[0].chat_id });
        }

        const results = await pool.query('INSERT INTO chats (user1_id, user2_id) VALUES ($1, $2) RETURNING chat_id',
            [user_id, friend_id]);
        res.status(201).json({ message: 'Chat added', chatId: results.rows[0].chat_id });
    }
    catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


router.get('/search', async (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const user = await pool.query('SELECT * FROM users WHERE username LIKE $1', [username + '%']);
        if (user.rows.length === 0) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user.rows);
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
        const decoded = jwt.verify(token, JWT_SECRET); 
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
        res.status(200).json({ token: token, message: 'Login successfully', user: user });
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