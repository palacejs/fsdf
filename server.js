const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = './tokens.json';

app.use(express.json());

app.post('/savetoken', (req, res) => {
    const { jwt } = req.body;
    if (!jwt) return res.status(400).json({ error: 'JWT required' });

    let data = { count: 0, tokens: [] };
    if (fs.existsSync(DB_FILE)) {
        data = JSON.parse(fs.readFileSync(DB_FILE));
    }

    data.tokens.push({ jwt, created_at: new Date().toISOString() });
    data.count = data.tokens.length;

    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true });
});

app.get('/alltokens', (req, res) => {
    if (!fs.existsSync(DB_FILE)) return res.json({ count: 0, tokens: [] });
    const data = JSON.parse(fs.readFileSync(DB_FILE));
    res.json(data);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
