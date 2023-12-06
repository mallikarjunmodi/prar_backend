import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import signinRouter from './Routes/signin.js';
import signupRouter from './Routes/signup.js';
import { connectDB } from './Database/database.js';

const app = express();
app.use(express.json()); 
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});



app.use('/signin', signinRouter);
app.use('/signup', signupRouter);




io.on('connection', (socket) => {
    console.log('Device Connected');

    socket.on('bpsensor', () => {
        console.log('sensor');
        const sensorData = { value: "some data" };
        socket.emit('sensorData', sensorData);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(5000, () => {
    try {
        connectDB()
    } catch (error ){
        console.log(error)
    }
    console.log('Server is running on port 5000');
});
