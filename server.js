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

    // Determine build directory - use BUILD_DIR env var or default to 'build'
    const buildDir = process.env.BUILD_DIR || path.join(__dirname, 'build');

    // Check if build directory exists (for readiness)
    healthMetrics.buildExists = fs.existsSync(buildDir);
    healthMetrics.buildDir = buildDir;
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
        console.log(`Readiness check passed: Build directory found at ${healthMetrics.buildDir}`);
        res.status(200).send('OK (Ready)');
    } else {
        console.error(`Readiness check failed: Build directory not found at ${healthMetrics.buildDir}`);

        // Try to create the directory if it doesn't exist and we're in a writable location
        if (healthMetrics.buildDir.startsWith('/tmp/')) {
            try {
                fs.mkdirSync(healthMetrics.buildDir, { recursive: true });
                console.log(`Created build directory at ${healthMetrics.buildDir}`);
                // Update metrics after creating directory
                updateHealthMetrics();
                if (healthMetrics.buildExists) {
                    res.status(200).send('OK (Ready after creating build directory)');
                    return;
                }
            } catch (error) {
                console.error(`Failed to create build directory: ${error.message}`);
            }
        }

        res.status(503).send(`Not Ready: Build directory not found at ${healthMetrics.buildDir}`);
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

// Handler for App Engine start request
app.get('/_ah/start', (req, res) => {
    console.log('Received App Engine start request');
    updateHealthMetrics();
    res.status(200).send('Application started');
});

// Handler for App Engine stop request
app.get('/_ah/stop', (req, res) => {
    console.log('Received App Engine stop request');
    // Send response before shutting down
    res.status(200).send('Application stopping');

    // Give some time for the response to be sent before shutting down
    setTimeout(() => {
        process.exit(0);
    }, 1000);
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
