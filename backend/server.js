const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "task"
});

// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        return;
    }
    console.log('Connected to database');
});

app.get("/", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json("Error");
        }
        return res.json(data);
    });
});

app.post('/create', (req, res) => {
    console.log('Request Body:', req.body);
    const sql = "INSERT INTO `users` (`fullname`, `emailid`, `phoneno`, `dob`) VALUES (?)";
    
    const values = [
        req.body.name,
        req.body.emailid,
        req.body.phoneno,
        req.body.dob
    ];
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json("ERROR");
        }
        console.log('Insert Result:', result);
        return res.json(result);
    });
});

// Handling GET request to /create
app.get('/create', (req, res) => {
    res.send('This endpoint is for creating new users. Use a POST request to submit data.');
});

app.put('/update/:id', (req, res) => {
    console.log('Request Body:', req.body);
    const sql = "UPDATE users SET fullname = ?, emailid = ?, phoneno = ?, dob = ? WHERE id = ?";
    
    const values = [
        req.body.name,
        req.body.emailid,
        req.body.phoneno,
        req.body.dob,
        req.params.id
    ];
    
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json("ERROR");
        }
        console.log('Update Result:', result);
        return res.json(result);
    });
});

app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    console.log('Request to delete user with ID:', id);
    const sql = "DELETE FROM users WHERE id = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json("ERROR");
        }
        console.log('Delete Result:', result);
        return res.json(result);
    });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
