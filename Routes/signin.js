import express from 'express';
import bcrypt from 'bcrypt';
import { findUser } from '../Database/database.js'; 

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUser(username);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).send('Invalid password');
        }
        res.send({ message: `User logged in: ${user.username}`, user: user });
    } catch (error) {
        return res.status(500).send('Error logging in');
    }
});

export default router;
