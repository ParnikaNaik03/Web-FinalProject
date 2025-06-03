const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// GET /accounts route
app.get('/accounts', (req, res) => {
    const accountsFile = path.join(__dirname, 'data', 'accounts.json');

    fs.readFile(accountsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read accounts data.' });
        }
        try {
            const accounts = JSON.parse(data);
            res.json(accounts);
        } catch (parseErr) {
            res.status(500).json({ error: 'Failed to parse accounts data.' });
        }
    });
});

// POST /accounts route
app.post('/accounts', (req, res) => {
    const accountsFile = path.join(__dirname, 'data', 'accounts.json');

    const newAccount = req.body;

    fs.readFile(accountsFile, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read accounts data.' });
        }
        let accounts = [];
        try {
            accounts = JSON.parse(data);
        } catch (parseErr) {
            return res.status(500).json({ error: 'Failed to parse accounts data.' });
        }

        accounts.push(newAccount);

        fs.writeFile(accountsFile, JSON.stringify(accounts, null, 2), (writeErr) => {
            if (writeErr) {
                return res.status(500).json({ error: 'Failed to save account.' });
            }
            res.status(201).json(newAccount);
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});