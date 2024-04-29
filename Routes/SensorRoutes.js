import ecgSensor from "../Sensors/Ecg.js";
import bpSensor from "../Sensors/Bp.js";
import hrSensor from "../Sensors/hr.js";
import tempSensor from "../Sensors/temp.js";
import bgSensor from "../Sensors/Bg.js"
import { Server } from "socket.io";

export default function (httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    //ecg
    socket.on("send_message_ecg", (data) => {
      console.log(data.message);

      if (data.message === "Start") {

        hrSensor.offSensor();
        bgSensor.offSensor();
        ecgSensor.offSensor();
        tempSensor.offSensor();
        bpSensor.offSensor();
  
        ecgSensor.onSensor((sensorData) => {
          socket.emit("ecg_data", { data: sensorData });
        });
      }
      if (data.message === "Stop") {
        ecgSensor.offSensor((sensorData) => {
          socket.emit("ecg_data", { data: "Sensor stopped" });
        });
      }
    });
    //ecg end

    //bp
    socket.on("start_bp", () => {

      hrSensor.offSensor();
      bgSensor.offSensor();
      ecgSensor.offSensor();
      tempSensor.offSensor();
      bpSensor.offSensor();


      bpSensor.onSensor((sensorData) => {
        socket.emit("bp_data", { data: sensorData });

      });
    });

    socket.on("stop_bp", () => {
      
      bpSensor.offSensor(() => {
        socket.emit("bp_data", { data: "Sensor stopped" });
      });
    });
    //bp end

    //hr
    socket.on("start_hr", () => {

      hrSensor.offSensor();
      bgSensor.offSensor();
      ecgSensor.offSensor();
      tempSensor.offSensor();
      bpSensor.offSensor();


      hrSensor.onSensor((sensorData) => {
        socket.emit("hr_data", { data: sensorData });
      });
    });

    socket.on("stop_hr", () => {
      hrSensor.offSensor(() => {
        socket.emit("hr_data", { data: "Sensor stopped" });
      });
    });
    //hr end

    //temp
    socket.on("start_temp", () => {


      hrSensor.offSensor();
      bgSensor.offSensor();
      ecgSensor.offSensor();
      tempSensor.offSensor();
      bpSensor.offSensor();

      tempSensor.onSensor((sensorData) => {
        socket.emit("temp_data", { data: sensorData });
      });
    });

    socket.on("stop_temp", () => {
      tempSensor.offSensor(() => {
        socket.emit("temp_data", { data: "Sensor stopped" });
      });
    });
    //temp end

    //bg
    socket.on("start_bg", () => {

      hrSensor.offSensor();
      bgSensor.offSensor();
      ecgSensor.offSensor();
      tempSensor.offSensor();
      bpSensor.offSensor();

      bgSensor.onSensor((sensorData) => {
        socket.emit("bg_data", { data: sensorData });
      });
    });

    socket.on("stop_bg", () => {
      bgSensor.offSensor(() => {
        socket.emit("bg_data", { data: "Sensor stopped" });
      });
    });
    //bg end


  });
}
