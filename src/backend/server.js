const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

const droneData = [];
const rechargeRequestMap = new Set();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample GET endpoint
app.get('/test', (req, res) => {
    res.send('Test');
});

// POST route to receive drone data
app.post('/drone', (req, res) => {
  const droneData = req.body;
  // Optionally, update your drone data storage here
  droneDataList = droneData;
  res.status(200).json({ message: 'Drone data received successfully!' });
});

// GET route to access drone data (for webpage to retrieve)
app.get('/drone/data', (req, res) => {
  res.status(200).json({ drones: droneDataList });
});

// GET route to get recharge requests from browser through server
app.get('/drone/recharge', (req, res) => {
  // Convert Set to object like { "10": true, "11": true }
  const rechargeStatus = {};
  for (const uid of rechargeRequestMap) {
    rechargeStatus[uid] = true;
  }

  // Optionally clear the set after sending
  rechargeRequestMap.clear();

  const response = { rechargeStatus };
  res.status(200).json(response);
  console.log(`Recharge set sent`);
  console.log(response);
});


// POST route to send recharge command from browser
app.post('/drone/recharge', (req, res) => {
  const { uid } = req.body;
  rechargeRequestMap.add(uid);
  console.log(`Recharge command received for UID: ${uid}`);
  console.log(rechargeRequestMap);
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});