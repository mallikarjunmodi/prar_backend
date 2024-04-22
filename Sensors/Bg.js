import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline';


class BgSensor {
  // constructor() {
  //   this.port = null;
  // }

  async onSensor(callback) {
    const ports = await SerialPort.list();
    this.port = null;


    this.port = new SerialPort({ path:'/dev/ttyUSB0', baudRate: 9600});
    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    console.log("Connected to Serial Port . Baud Rate : 9600");
    this.port.on("data", (data) =>{
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
