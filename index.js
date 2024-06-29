import express from "express";
import http from "http";
import SensorRoutes from "./Routes/SensorRoutes.js";
import bodyParser from "body-parser";
import cors from "cors";
import DatabaseRoutes from "./Routes/Database.js";
import network from "network";
import dotenv from "dotenv";
import {SyncSensorData} from "./Utils/Database/SyncService.js";

dotenv.config();

const app = express();
const corsOptions = {
  origin: "*",
  "access-control-allow-credentials": true,
};
let intervalId = null;

var allowCrossDomain = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept"
  );
  next();
};
app.use(allowCrossDomain);
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/database", DatabaseRoutes);
const httpServer = http.createServer(app);
SensorRoutes(httpServer);

function onInternetAvailable() {
  console.log("Internet connection is available.");
  SyncSensorData();
}

function checkInternetConnection() {
  network.get_active_interface((err, obj) => {
    if (err) {
      console.log("No internet connection.");
      return;
    }
    if (obj && obj.ip_address) {
      onInternetAvailable();
    } else {
      console.log("No internet connection.");
    }
  });
}

export function startCheckingInternet() {
  const interval = process.env.CHECK_INTERVAL || 10000;
  intervalId = setInterval(checkInternetConnection, interval);
}

export function stopCheckingInternet() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

httpServer.listen(process.env.PORT || 5000, () => {
  console.log(`Server started on port ${process.env.PORT || 5000}`);
  startCheckingInternet();
});
