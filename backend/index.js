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
const User = require('./db/User');

app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        let result = await newUser.save();
        console.log('User created:', result);
        res.send(result);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        if (req.body.password && req.body.email) {
            let user = await User.findOne(req.body).select('-password');
            if (user) {
                res.send(user);
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'Email and password are required' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});