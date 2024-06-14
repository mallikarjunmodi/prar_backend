import { SerialPort } from "serialport";
import { ReadlineParser } from '@serialport/parser-readline';


class BgSensor {
  
  // constructor() {
  //   this.port = null;
  // }

  async onSensor(callback) {
    const ports = await SerialPort.list();
    const sensorPortInfo = ports.find( 
      (port) => port.vendorId === `067b` && port.productId === `2303`
    );

    if (!sensorPortInfo) {
      console.error("Bp Sensor not found.");
      return null;
    }
    

    if (this.port && this.port.isOpen) {
      this.port.close();
      this.port = null;
  }

    this.port = new SerialPort({ path:sensorPortInfo.path, baudRate: 9600});
    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    console.log("Connected to Serial Port . Baud Rate : 9600");
    let buffer = Buffer.alloc(0);
    let capturing = false;
    let targetLength = 0;
    
    this.port.on("data", function(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] === 0xF5) {
          // Check if the buffer already has data and starts with 0xF5 followed by 0xA0
          if (capturing && buffer.length >= 2 && buffer[0] === 0xF5 && buffer[1] === 0xA0) {
            console.log("Captured buffer:", buffer);
            callback(buffer);
            buffer = Buffer.alloc(0);
            targetLength = 0;
          }
          capturing = true;
        }
        if (capturing) {
          buffer = Buffer.concat([buffer, Buffer.from([data[i]])]);
          
          // Set the target length based on the third byte
          if (buffer.length === 3) {
            if (buffer[2] === 0x01 || buffer[2] === 0x02) {
              targetLength = 5;
            } else if (buffer[2] === 0x08) {
              targetLength = 12;
            } else {
              // If the third byte is not 0x01, 0x02, or 0x08, reset the buffer
              console.log("Unexpected third byte. Discarding data.");
              capturing = false;
              buffer = Buffer.alloc(0);
              targetLength = 0;
            }
          }
    
          // Check if buffer has reached the target length
          if (targetLength > 0 && buffer.length >= targetLength) {
            console.log("Captured buffer:", buffer);
            callback(buffer);
            capturing = false;
            buffer = Buffer.alloc(0);
            targetLength = 0;
          }
        }
      }
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
