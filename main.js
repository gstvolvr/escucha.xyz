const express = require('express');
const path = require('path');
const fs = require('fs');

// Create logs directory
const isProduction = process.env.NODE_ENV === 'production';
const logsDir = isProduction ? path.join('/tmp', 'logs') : path.join(__dirname, 'logs');

// Set up logging (keeping your existing logging setup)
let logStream = null;
try {
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
    }
    const logFile = path.join(logsDir, `app-${new Date().toISOString().replace(/:/g, '-')}.log`);
    logStream = fs.createWriteStream(logFile, { flags: 'a' });
} catch (error) {
    console.error(`Failed to set up logging: ${error.message}`);
}

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    if (logStream) {
        logStream.write(logMessage + '\n');
    }
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

// Track server start time for uptime calculation
const startTime = new Date();

// Health metrics
const healthMetrics = {
    status: 'healthy',
    uptime: 0,
    memoryUsage: {},
    lastChecked: null
};

// Update health metrics function
function updateHealthMetrics() {
    const now = new Date();
    healthMetrics.uptime = Math.floor((now - startTime) / 1000);
    healthMetrics.memoryUsage = process.memoryUsage();
    healthMetrics.lastChecked = now.toISOString();

    const buildDir = process.env.BUILD_DIR || path.join(__dirname, 'build');
    healthMetrics.buildExists = fs.existsSync(buildDir);
    healthMetrics.buildDir = buildDir;
}

// Initial metrics update
updateHealthMetrics();

// Update metrics every 30 seconds
setInterval(updateHealthMetrics, 30000);

// Request logging middleware
app.use((req, res, next) => {
    log(`${req.method} ${req.url}`);
    next();
});

// Serve static files from build directory
const buildDir = process.env.BUILD_DIR || path.join(__dirname, 'build');
app.use(express.static(buildDir));

// Health check endpoints
app.get('/readiness_check', (req, res) => {
    updateHealthMetrics();
    if (healthMetrics.buildExists) {
        res.status(200).send('OK (Ready)');
    } else {
        res.status(503).send('Not Ready: Build directory not found');
    }
});

app.get('/liveness_check', (req, res) => {
    updateHealthMetrics();
    res.status(200).send('OK (Alive)');
});

app.get('/health', (req, res) => {
    updateHealthMetrics();
    res.json(healthMetrics);
});

// App Engine handlers
app.get('/_ah/start', (req, res) => {
    log('Received App Engine start request');
    res.status(200).send('Application started');
});

app.get('/_ah/stop', (req, res) => {
    log('Received App Engine stop request');
    res.status(200).send('Application stopping');
    setTimeout(() => process.exit(0), 1000);
});

// Serve index.html for all other routes (React router support)
app.get('*', (req, res) => {
    res.sendFile(path.join(buildDir, 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
});

// Error handling
process.on('uncaughtException', (error) => {
    log(`FATAL: Uncaught exception: ${error.message}`);
    shutdown(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`FATAL: Unhandled rejection at: ${promise}, reason: ${reason}`);
    shutdown(1);
});

// Graceful shutdown
let isShuttingDown = false;
function shutdown(exitCode = 0) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    log('Shutting down gracefully...');

    const forceExitTimeout = setTimeout(() => {
        log('Forced exit after timeout');
        process.exit(exitCode);
    }, 10000);
    forceExitTimeout.unref();

    server.close(() => {
        log('Server closed');
        if (logStream) {
            logStream.end(() => {
                log('Log stream closed');
                process.exit(exitCode);
            });
        } else {
            process.exit(exitCode);
        }
    });
}

// Handle termination signals
process.on('SIGINT', () => {
    log('Received SIGINT');
    shutdown(0);
});

process.on('SIGTERM', () => {
    log('Received SIGTERM');
    shutdown(0);
});