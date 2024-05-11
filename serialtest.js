import { SerialPort } from "serialport";

// List all available serial ports and their details
SerialPort.list().then(ports => {
    ports.forEach(port => {
        console.log(`Port: ${port.path}`);
        console.log(`  Manufacturer: ${port.manufacturer}`);
        console.log(`  Serial Number: ${port.serialNumber}`);
        console.log(`  Vendor ID: ${port.vendorId}`);
        console.log(`  Product ID: ${port.productId}`);
    });
});
