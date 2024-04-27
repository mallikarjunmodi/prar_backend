import { SerialPort } from "serialport";

const ecgoff = ["0x55", "0xAA", "0x04", "0x01", "0x00", "0xFA"];
const spoff = ["0x55", "0xAA", "0x04", "0x03", "0x00", "0xF8"];
const tempoff = ["0x55", "0xAA", "0x04", "0x04", "0x00", "0xF7"];
const nibpoff = ["0x55", "0xAA", " 0x04", "0x02", "0x00", "0xF9"];
const ecgwaveoff = ["0x55", "0xAA", "0x04", "0xFB", "0x00", "0x00"];
const spwaveoff = ["0x55", "0xAA", "0x04", "0xFE", "0x00", "0xFD"];
const respoff = ["0x55", "0xAA", "0x04", "0xFF", "0x00", "0xFC"];
const ecgwave = ["0x55", "0xAA", "0x04", "0xFB", "0x01", "0xFF"];

class EcgSensor {
  constructor() {
    this.port = null;
  }

  async onSensor(callback) {
    // const ports = await SerialPort.list();
    if (this.port && this.port.isOpen) {
      this.port.close();
  }
  this.port = null


    this.port = new SerialPort({ path: '/dev/ttyUSB0' , baudRate: 115200 });
    console.log("Connected to Serial Port . Baud Rate : 115200");
    this.port.write(spoff);
    this.port.write(nibpoff);
    this.port.write(tempoff);
    this.port.write(spwaveoff);
    this.port.write(respoff);
    this.port.write(ecgoff);
    this.port.write(ecgwave);
    this.port.on("data", async function (data) {
      console.log("data", data);
      const readings = data[4];
      callback(readings);
    });
  }

  offSensor() {
    if (this.port) {
      this.port.write(ecgwaveoff);
      this.port.close();
      console.log("Sensor turned off.");
    } else {
      console.error("Serial port not initialized or already closed.");
    }
  }
}

let ecgSensor = new EcgSensor();
export default ecgSensor;
