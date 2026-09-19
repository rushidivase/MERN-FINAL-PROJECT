const express = require('express');
const app = express();
require('./db/config');
const cors = require('cors');
app.use(cors());
const Product = require('./db/Product');

const Jwt = require('jsonwebtoken');
const jwtKey = 'e-comm';
const revokedTokens = new Set();

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
                Jwt.sign({ user }, jwtKey, { expiresIn: '1h' }, (err, token) => {
                    if (err) {
                        console.error('Error generating token:', err);
                        res.status(500).json({ message: 'Internal server error' });
                    } else {
                        res.send({ user, auth: token });
                    }
                });
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

app.post('/add-product', async (req, res) => {
    try {
        const product = new Product(req.body);
        let result = await product.save();
        console.log('Product created:', result);
        res.send(result);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/products', verifyToken, async (req, res) => {
    try {
        let products = await Product.find();
        if (products.length > 0) {
            res.send(products);
        }
        else {
            res.send({ result: "No products found" });
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/product/:id', verifyToken, async (req, res) => {
    try {
        const result = await Product.deleteOne({ _id: req.params.id });
        if (result.deletedCount > 0) {
            res.send({ result: "Product deleted" });
        }
        else {
            res.status(404).send({ result: "Product not found" });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/product/:id', verifyToken, async (req, res) => {
    try {
        const result = await Product.findOne({ _id: req.params.id });
        if (result) {
            res.send(result);
        }
        else {
            res.status(404).send({ result: "Product not found" });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/product/:id', verifyToken, async (req, res) => {
    try {
        const result = await Product.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        if (result.modifiedCount > 0) {
            res.send({ result: "Product updated" });
        }
        else {
            res.status(404).send({ result: "Product not found or no changes made" });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/search/:key', verifyToken, async (req, res) => {
    try {
        let result = await Product.find({
            $or: [
                { name: { $regex: req.params.key, $options: 'i' } },
                { category: { $regex: req.params.key, $options: 'i' } },
                { company: { $regex: req.params.key, $options: 'i' } },
                { userId: { $regex: req.params.key, $options: 'i' } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $toString: "$price" },
                            regex: req.params.key,
                            options: "i"
                        }
                    }
                }
            ]
        });

        res.send(result);

    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/logout', (req, resp) => {
    let token = req.headers.authorization;

    if (!token) {
        return resp.status(401).json({ message: 'Token required' });
    }
    token = token.split(' ')[1]; // Remove 'Bearer ' prefix if present
    if (!token) {
        return resp.status(401).json({ message: 'Token Invalid' });
    }

    revokedTokens.add(token);
    console.log("Token Revoked")
    resp.status(200).json({
        message: 'Logout Success'
    });
});

function verifyToken(req, res, next) {
    let token = req.headers['authorization'];
    if (token) {
        token = token.split(' ')[1]; // Remove 'Bearer ' prefix if present
        Jwt.verify(token, jwtKey, (err, valid) => {
            if (err) {
                res.status(401).json({ message: 'Invalid token' });
            } else {
                req.user = valid.user;
                next();
            }
        });
    } else {
        res.status(401).json({ message: 'Token required' });
    }
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});