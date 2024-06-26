import express from 'express';
import http from 'http';
import SensorRoutes from './Routes/SensorRoutes.js';
import bodyParser from 'body-parser';
import cors from "cors";
import DatabaseRoutes from './Routes/Database.js';
import network from 'network';


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

app.use('/api/database', DatabaseRoutes);
const httpServer = http.createServer(app);
SensorRoutes(httpServer);


function onInternetAvailable() {
  console.log('Internet connection is available.');
}

function checkInternetConnection() {
  network.get_active_interface((err, obj) => {
    if (err) {
      console.error('Error checking network interface:', err);
      return;
    }
    if (obj && obj.ip_address) {
      onInternetAvailable();
    } else {
      console.log('No internet connection.');
    }
  });
}

network.on('change', () => {
  console.log('Network change detected, checking connection...');
  checkInternetConnection();
});


httpServer.listen(5000,()=>{console.log("Server started on port 5000")});