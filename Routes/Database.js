import express from "express";
import StoreReadings from "../Utils/Database/StoreReadings.js";
import GetReadings from "../Utils/Database/GetReadings.js";
import GetLastReadings from "../Utils/Database/GetLastReadings.js";
import SignUp from "../Utils/Database/SignUp.js";
import SignIn from "../Utils/Database/SignIn.js";
import GetAllUsers from "../Utils/Database/GetAllUsers.js";

const router = express.Router();

router.post("/store_sensor_data", async (req, res) => {
  const { userId, sensor, reading} = req.body;
  await StoreReadings(userId, sensor, reading);
});

router.post("/get_sensor_data", async (req, res) => {
  const { userId, sensor } = req.body;
  await GetReadings(res,userId, sensor);
});

router.post("/get_last_readings", async (req, res) => {
  const { userId, sensor } = req.body;
  await GetLastReadings(res,userId, sensor);
});

router.post("/signup", async (req, res) => {
  const user = req.body;
  await SignUp(user,res);
});

router.post("/signin", async (req, res) => {
  const user = req.body;
  await SignIn(user,res);
});

router.get("/get_all_users", async (req, res) => {
  await GetAllUsers(res);
});

export default router;
