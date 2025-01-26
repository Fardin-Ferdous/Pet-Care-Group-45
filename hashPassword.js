const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'fardin12345678', // Update with your MySQL password
    database: 'pet_care',       // Update with your database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// Hash the password
const plainPassword = '123'; // The plaintext password you want to hash
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
    if (err) throw err;
    console.log('Hashed password:', hash);

    // Update the hashed password in the database
    const query = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(query, [hash, 'admin'], (err, result) => {
        if (err) throw err;
        console.log('Password updated successfully in the database:', result);
        db.end(); // Close the database connection
    });
});
