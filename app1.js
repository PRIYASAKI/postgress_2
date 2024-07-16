const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3090;

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ekb',
    password: 'root',
    port: 5432,
});

// Middleware to parse JSON body
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index1.html'));
});

// Insert data
app.post('/submit', (req, res) => {
    const { name, email } = req.body;
    pool.query('INSERT INTO form_data (name, email) VALUES ($1, $2)', [name, email], (err, result) => {
        if (err) {
            res.status(500).send('Error inserting data');
            return console.error('Error executing query', err.stack);
        }
        res.send('Data inserted successfully');
    });
});

// View data
app.get('/data', (req, res) => {
    pool.query('SELECT * FROM form_data', (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving data');
            return console.error('Error executing query', err.stack);
        }
        res.json(result.rows);
    });
});

// Update data
app.post('/update', (req, res) => {
    const { id, name, email } = req.body;
    pool.query(
        'UPDATE form_data SET name = $1, email = $2 WHERE id = $3',
        [name, email, id],
        (err, result) => {
            if (err) {
                res.status(500).send('Error updating data');
                return console.error('Error executing query', err.stack);
            }
            res.send('Data updated successfully');
        }
    );
});

// Delete data
app.post('/delete', (req, res) => {
    const { id } = req.body;
    pool.query('DELETE FROM form_data WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting data');
            return console.error('Error executing query', err.stack);
        }
        res.send('Data deleted successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
