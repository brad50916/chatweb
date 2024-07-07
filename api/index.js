const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
const app = express()
const port = 5001
const routes = require('./routers')
const cors = require('cors')
const pool = require('./db');

const JWT_SECRET = 'cutecat';

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length == 0) {
          console.log("User not found")
          return res.status(404).json({ message: 'User not found' });
        }
        const user = result.rows[0];
        // const isMatch = await bcrypt.compare(password, user.password);
        const isMatch = password === user.password;
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

app.post('/signup', async (req, res) => {
    const { firstname, lastname, email, password } = request.body;
    console.log(firstname, lastname, email, password);
    try {
        const results = await pool.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id', 
        [firstname, lastname, email, password]);
        response.status(201).json({ message: 'User added', userId: results.rows[0].id });
      } catch (error) {
        response.status(500).json({ error: error.toString() });
      }
});

// app.use('/', routes)

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})