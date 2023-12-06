import express from 'express';
import { registerUser, findUser } from '../Database/database.js';

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await findUser(username);
        if (existingUser) {
            return res.status(409).send('User already exists');
        }
        const newUser = await registerUser(username, password);
        res.status(201).send({ message: `User created with ID: ${newUser._id}`, user: newUser });
    } catch (error) {
        return res.status(500).send('Error creating user');
    }
});

export default router;
