const express = require('express');
const app = express();

// Configure middleware, routes, and other server settings here

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for cross-origin requests (if needed)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const timelogRoutes = require('./routes/timelogs');

// Use the timelog routes
app.use('/api/timelogs', timelogRoutes);
