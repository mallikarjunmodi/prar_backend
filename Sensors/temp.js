import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline';


const ecgoff = ["0x55", "0xAA", "0x04", "0x01", "0x00", "0xFA"];
const spoff = ["0x55", "0xAA", "0x04", "0x03", "0x00", "0xF8"];
const tempoff = ["0x55", "0xAA", "0x04", "0x04", "0x00", "0xF7"];
const ecgwaveoff = ["0x55", "0xAA", "0x04", "0xFB", "0x00", "0x00"];
const spwaveoff = ["0x55", "0xAA", "0x04", "0xFE", "0x00", "0xFD"];
const respoff = ["0x55", "0xAA", "0x04", "0xFF", "0x00", "0xFC"];
const bpoff = ["0x55", "0xAA", " 0x04", "0x02", "0x00", "0xF9"];


class TempSensor {
  constructor() {
    this.port = null;
  }


  async onSensor(callback) {
    // const ports = await SerialPort.list();
    if (this.port && this.port.isOpen) {
      this.port.close();
  }
  this.port = null
 

    this.port = new SerialPort({ path:'/dev/ttyUSB2', baudRate: 9600 });
    console.log("Connected to Serial Port . Baud Rate : 9600");
    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (data) => {
      console.log('Received:', data);
    });
    

    this.port.on("data",  (data)  => {
      console.log("data", data);
      callback(data);
    });
  }


  offSensor() {
    if (this.port) {
      this.port.write(tempoff);
      console.log("Temperature sensor turned off.");
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

let tempSensor = new TempSensor();
export default tempSensor;
