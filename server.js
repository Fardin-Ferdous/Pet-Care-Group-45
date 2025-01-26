const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

// Set up express app
const app = express();
const port = 3000;

// Middleware
app.use(express.static('public')); // Serve static files like images
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
}));

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fardin12345678', // MySQL root user password
    database: 'pet_care',       // Database name
});
db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

// Route to display login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
});

// Route to handle login verification
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (err, isMatch) => {
                if (isMatch) {
                    req.session.user = result[0];
                    res.redirect('/');
                } else {
                    res.send('Invalid credentials');
                }
            });
        } else {
            res.send('Invalid credentials');
        }
    });
});

// Middleware to protect routes
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Protect the home page route
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
