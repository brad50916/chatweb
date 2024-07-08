const express = require('express');
const pool = require('./db');
const router = express.Router();

const getUsers = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM users ORDER BY id ASC');
    response.status(200).json(results.rows);
  } catch (error) {
    response.status(500).json({ error: error.toString() });
  }
};

const getUserById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const results = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (results.rows.length > 0) {
      response.status(200).json(results.rows);
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    response.status(500).json({ error: error.toString() });
  }
};

const createUser = async (request, response) => { 
  const { firstname, lastname, email, password } = request.body;
  console.log(firstname, lastname, email, password)
  try {
    const results = await pool.query('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id', 
    [firstname, lastname, email, password]);
    response.status(201).json({ message: 'User added', userId: results.rows[0].id });
  } catch (error) {
    response.status(500).json({ error: error.toString() });
  }
};

const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const { name, email } = request.body;
  try {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    response.status(200).send(`User modified with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error: error.toString() });
  }
};

const deleteUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    response.status(200).send(`User deleted with ID: ${id}`);
  } catch (error) {
    response.status(500).json({ error: error.toString() });
  }
};

router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;