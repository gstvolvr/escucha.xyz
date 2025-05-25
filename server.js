const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.HEALTH_CHECK_PORT || 8081;

// Track server start time for uptime calculation
const startTime = new Date();

// Basic application health metrics
const healthMetrics = {
    status: 'healthy',
    uptime: 0,
    memoryUsage: {},
    lastChecked: null
};

// Update health metrics periodically
function updateHealthMetrics() {
    const now = new Date();
    healthMetrics.uptime = Math.floor((now - startTime) / 1000); // in seconds
    healthMetrics.memoryUsage = process.memoryUsage();
    healthMetrics.lastChecked = now.toISOString();

    // Check if build directory exists (for readiness)
    healthMetrics.buildExists = fs.existsSync(path.join(__dirname, 'build'));
}

// Update metrics every 30 seconds
setInterval(updateHealthMetrics, 30000);
// Initial update
updateHealthMetrics();

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Handler for Readiness Check
app.get('/readiness_check', (req, res) => {
    // Update metrics on each check
    updateHealthMetrics();

    // Check if the application is ready to serve traffic
    // For a React app, we mainly need to ensure the build exists
    if (healthMetrics.buildExists) {
        res.status(200).send('OK (Ready)');
    } else {
        console.error('Readiness check failed: Build directory not found');
        res.status(503).send('Not Ready: Build directory not found');
    }
});

// Handler for Liveness Check
app.get('/liveness_check', (req, res) => {
    // Update metrics on each check
    updateHealthMetrics();

    // For liveness, we just need to ensure the server is responding
    res.status(200).send('OK (Alive)');
});

// Health metrics endpoint (for internal monitoring)
app.get('/health', (req, res) => {
    updateHealthMetrics();
    res.json(healthMetrics);
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Health check server is running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
    console.error(`Server error: ${error.message}`);
});

// Export the app for testing
module.exports = app;
