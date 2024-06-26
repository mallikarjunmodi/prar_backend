import express from "express";
import StoreReadings from "../Utils/Database/StoreReadings.js";
import GetReadings from "../Utils/Database/GetReadings.js";
import GetLastReadings from "../Utils/Database/GetLastReadings.js";
import StoreReadings from "../Utils/Database/StoreReadings.js";

const router = express.Router();

router.post("/store_sensor_data", async (req, res) => {
  const { userId, sensor, readings } = req.body;
  await StoreReadings(userId, sensor, readings);
  res.send("Data added to the local database");
});

router.post("/get_sensor_data", async (req, res) => {
    const { userId, sensor} = req.body;
    await GetReadings(userId, sensor);
  res.send("All readings retreived");
});

router.post("/get_last_readings", async (req, res) => {
  const { userId, sensor} = req.body;
  await GetLastReadings(userId, sensor);
res.send("Latest readings retreived");
});

export default router;
