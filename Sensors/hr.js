import { SerialPort } from "serialport";

const ecgoff = ["0x55", "0xAA", "0x04", "0x01", "0x00", "0xFA"];
const spoff = ["0x55", "0xAA", "0x04", "0x03", "0x00", "0xF8"];
const tempoff = ["0x55", "0xAA", "0x04", "0x04", "0x00", "0xF7"];
const nibpoff = ["0x55", "0xAA", " 0x04", "0x02", "0x00", "0xF9"];
const ecgwaveoff = ["0x55", "0xAA", "0x04", "0xFB", "0x00", "0x00"];
const spwaveoff = ["0x55", "0xAA", "0x04", "0xFE", "0x00", "0xFD"];
const respoff = ["0x55", "0xAA", "0x04", "0xFF", "0x00", "0xFC"];
const bpoff = ["0x55", "0xAA", " 0x04", "0x02", "0x00", "0xF9"];
const spOn  = ["0x55", "0xAA" ,"0x04","0x03" ,"0x01", "0xF7"];


class HrSensor {
  // constructor() {
  //   this.port = null;
  // }

  async onSensor(callback) {
    const ports = await SerialPort.list();
    // const sensorPortInfo = ports.find(
    //   (port) => port.vendorId === `1A86` && port.productId === `7523`
    // );

    // if (!sensorPortInfo) {
    //   console.error("Hr Sensor not found.");
    //   return null;
    // }
 this.port = null
    this.port = new SerialPort({ path:'/dev/ttyUSB0' , baudRate: 115200 });
    console.log("Connected to Serial Port . Baud Rate : 115200");
    this.port.write(spoff);
    this.port.write(ecgwaveoff);
    this.port.write(tempoff);
    this.port.write(spwaveoff);
    this.port.write(respoff);
    this.port.write(ecgoff);
    this.port.write(bpoff);
    this.port.write(spOn);
    this.port.on("data",  (data)=>  {
      console.log("data", data);
      callback(data);
    });
  }

  offSensor() {
    if (this.port) {
      this.port.write(spoff);
      console.log("Hr and sp02 sensor turned off.");
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

let hrSensor = new HrSensor();
export default hrSensor;
