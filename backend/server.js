const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run('CREATE TABLE messages (id INTEGER PRIMARY KEY, content TEXT)');
});

// Fetch messages
app.get('/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY id DESC', [], (err, rows) => {  // Get the latest messages
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Post a message
app.post('/messages', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
    }
    db.run('INSERT INTO messages (content) VALUES (?)', [content], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, content });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
