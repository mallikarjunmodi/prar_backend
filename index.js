import express from 'express';
import http from 'http';
import SensorRoutes from './Routes/SensorRoutes.js';
import bodyParser from 'body-parser';
import cors from "cors";


const app=express();
const corsOptions ={
  origin:'*',
  "access-control-allow-credentials":true,
}

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type","Accept");
  next();
};
app.use(allowCrossDomain);
app.use(cors(corsOptions)) 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());


const httpServer = http.createServer(app);
SensorRoutes(httpServer);



httpServer.listen(5000,()=>{console.log("Server started on port 5000")});