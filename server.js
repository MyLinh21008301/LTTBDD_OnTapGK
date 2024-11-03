const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

//connect MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sapassword',
    database: 'travelDB'
});

// route API

app.get('/api/categories', (req, res) => {
    connection.query('SELECT * FROM category', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.get('/api/locations', (req, res) => {
    connection.query('SELECT * FROM locations', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});


//Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    connection.query('SELECT * FROM account WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            res.json({ success: true, massege: 'Dang nhap thanh cong!' });
        } else {
            res.status(401).json({ success: true, massege: 'UserName hoac Password khong dung!' });
        }
    });
});

//Sigup
app.post('/api/register', (req, res) => {
    const { username, gmail, password } = req.body;

    const checkUserNameQuery = 'SELECT * FROM account WHERE username = ?';
    connection.query(checkUserNameQuery, [username], (err, results) => {
        if (err) {
            console.error("Loi kiem tra username:", err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
            return res.status(400).json({ success: true, massege: 'username already exists!' });
        }

        const insertQuery = "INSERT INTO account (username, gmail, password) VALUES (?, ?, ?)";
        connection.query(insertQuery, [username, gmail, password], (err, results) => {
            if (err) {
                console.error("Loi insert:", err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ massege: "Them thanh cong!" });
        });
    });
});

//Reset Password
app.post('/api/reset-password', express.json(), (req, res) => {
    const { username, newPassword } = req.body;
    const checkQuery = "SELECT * FROM account WHERE username = ?";
    connection.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error("Loi kiem tra username:", err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length == 0) {
            return res.status(401).json({ success: true, massege: 'Loi gmail' });
        }

        const updateQuery = 'UPDATE account SET password = ? WHERE username = ?';
        connection.query(updateQuery, [newPassword, username], (err, results) => {
            if (err) {
                console.error("Loi update password:", err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ massege: "Reset password thanh cong!" });
        });
    });
});

app.listen(3000, ()=>{
    console.log("Running on server port 3000");
})