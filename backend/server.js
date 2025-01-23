const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // Required for serving static files

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Allow CORS
const corsOptions = {
    origin: 'http://3.104.63.29:3000/', // Update this to restrict access to specific origins in production
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve the frontend on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Database setup
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run('CREATE TABLE messages (id INTEGER PRIMARY KEY, content TEXT)');
});

// Fetch messages
app.get('/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY id DESC', [], (err, rows) => {
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
