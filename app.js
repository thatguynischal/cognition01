const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

module.exports = app; // Export the app instance directly
