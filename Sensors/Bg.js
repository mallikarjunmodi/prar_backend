import { SerialPort } from "serialport";
class BgSensor {
  constructor() {
    this.port = null;
  }

  async onSensor(callback) {
    const ports = await SerialPort.list();
    const sensorPortInfo = ports.find(
      (port) => port.vendorId === `1A86` && port.productId === `7523`
    );

    if (!sensorPortInfo) {
      console.error("Bg Sensor not found.");
      return null;
    }

    this.port = new SerialPort({ path: sensorPortInfo.path, baudRate: 9600});
    console.log("Connected to Serial Port . Baud Rate : 9600");
    this.port.on("data", async function (data) {
      console.log("data", data);
      callback(data);
    });
  }

  offSensor() {
    if (this.port) {
      this.port.close((err) => {
        if (err) {
          console.error("Failed to close the serial port", err);
        } else {
          console.log("Serial port closed.");
        }
      });
      this.port = null;
    } else {
      console.error("Serial port not initialized or already closed.");
    }
  }
}

let bgSensor = new BgSensor();
export default bgSensor;
