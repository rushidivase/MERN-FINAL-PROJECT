const express = require('express');
const app = express();
require('./db/config');
const cors = require('cors');
app.use(cors());

//for initial testing
app.get('/', (req, res) => {
    res.send('App is running!');
});

app.use(express.json());

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const User = require('./db/User');
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }});



app.listen(3000, () => {
    console.log('Server is running on port 3000');
});