const { Driver } = require("zwave-js");
const { SerialPort } = require("@serialport/stream");
const fs = require("fs");

// Get serial port path from environment
const serialPort = process.env.USB_PATH || "/dev/ttyACM0";
const logLevel = process.env.LOGLEVEL || "info";

// Logging config (basic)
const driver = new Driver(serialPort, {
  serialPort: {
    baudRate: 115200,
  },
  logConfig: {
    level: logLevel,
  },
});

// When the driver is ready
driver.on("ready", () => {
  console.log("Z-Wave driver is ready.");
  const nodes = driver.controller.nodes;
  console.log(`Found ${nodes.size} node(s):`);
  nodes.forEach((node) => {
    console.log(`- Node ${node.id}: ${node.deviceConfig?.label || "Unknown"}`);
  });
});

// When a new node is added
driver.on("node added", (node) => {
  console.log(`Node ${node.id} added`);
});

// Handle errors
driver.on("error", (err) => {
  console.error("Driver error:", err);
});

// Start the driver
(async () => {
    console.log("TEST: Starting Z-Wave driver...");
  try {
    await driver.start();
    console.log("Driver started successfully.");
  } catch (err) {
    console.error("Failed to start Z-Wave driver:", err);
  }
})();