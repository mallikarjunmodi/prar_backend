import { SerialPort } from "serialport";

const ecgoff = ["0x55", "0xAA", "0x04", "0x01", "0x00", "0xFA"];
const spoff = ["0x55", "0xAA", "0x04", "0x03", "0x00", "0xF8"];
const tempoff = ["0x55", "0xAA", "0x04", "0x04", "0x00", "0xF7"];
const nibpoff = ["0x55", "0xAA", " 0x04", "0x02", "0x00", "0xF9"];
const ecgwaveoff = ["0x55", "0xAA", "0x04", "0xFB", "0x00", "0x00"];
const spwaveoff = ["0x55", "0xAA", "0x04", "0xFE", "0x00", "0xFD"];
const respoff = ["0x55", "0xAA", "0x04", "0xFF", "0x00", "0xFC"];
const ecgwave = ["0x55", "0xAA", "0x04", "0xFB", "0x01", "0xFF"];
const bpOn = ["0X55", "0XAA", "0X04", "0X02", "0X01", "0XF8"];
const bpoff = ["0x55", "0xAA", " 0x04", "0x02", "0x00", "0xF9"];

class BpSensor {
  // constructor() {
  //   this.port = null;
  // }

  async onSensor(callback) {
    const ports = await SerialPort.list();
    const sensorPortInfo = ports.find( 
      (port) => port.vendorId === `10c4` && port.productId === `ea60`
    );

    if (!sensorPortInfo) {
      console.error("Bp Sensor not found.");
      return null;
    }
    

    if (this.port && this.port.isOpen) {
      this.port.close();
      this.port = null;
  }
    this.port = new SerialPort({ path: sensorPortInfo.path, baudRate: 115200 });
    console.log("Connected to Serial Port . Baud Rate : 115200");
    this.port.write(spoff);
    this.port.write(ecgwaveoff);
    this.port.write(tempoff);
    this.port.write(spwaveoff);
    this.port.write(respoff);
    this.port.write(ecgoff);
    this.port.write(bpoff);
    this.port.write(bpOn);
    let buffer = Buffer.alloc(0);
    let capturing = false;
    
    this.port.on("data", async function(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 0x55) {
          // Check if the buffer already has data and starts with 0x55 followed by 0xAA
          if (capturing && buffer.length > 1 && buffer[0] === 0x55 && buffer[1] === 0xAA) {
            console.log("Captured buffer:", buffer);
            callback(buffer);
            buffer = Buffer.alloc(0);
          }
          capturing = true;
        }
        if (capturing) {
          if (buffer.length < 10) {
            buffer = Buffer.concat([buffer, Buffer.from([data[i]])]);
          } else {
            console.log("Buffer exceeded max length of 10 bytes. Discarding data.");
            capturing = false;
            buffer = Buffer.alloc(0);
          }
        }
      }
    });
    
  }
  

  offSensor() {
    if (this.port) {
      this.port.write(bpoff);
      this.port.write(spoff);
      this.port.write(ecgwaveoff);
      this.port.write(tempoff);
      this.port.write(spwaveoff);
      this.port.write(respoff);
      this.port.write(ecgoff);
      this.port.write(bpoff);
      console.log("Bp sensor turned off.");
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

let bpSensor = new BpSensor();
export default bpSensor;