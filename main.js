const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Set up logging
const logFile = path.join(logsDir, `app-${new Date().toISOString().replace(/:/g, '-')}.log`);
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    logStream.write(logMessage + '\n');
}

// Log startup information
log(`Starting application in ${process.env.NODE_ENV || 'development'} mode`);
log(`Process ID: ${process.pid}`);

// Error handling for the main process
process.on('uncaughtException', (error) => {
    log(`FATAL: Uncaught exception: ${error.message}`);
    log(error.stack);
    // Attempt to shut down gracefully
    shutdown(1);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`FATAL: Unhandled rejection at: ${promise}, reason: ${reason}`);
    // Attempt to shut down gracefully
    shutdown(1);
});

// Start the server.js to handle health checks
log('Starting health check server...');
const serverProcess = spawn('node', ['server.js'], {
    stdio: 'pipe',
    shell: true
});

// Capture server output for logging
serverProcess.stdout.on('data', (data) => {
    log(`[HEALTH] ${data.toString().trim()}`);
});

serverProcess.stderr.on('data', (data) => {
    log(`[HEALTH ERROR] ${data.toString().trim()}`);
});

log('Health check server started');

// Handle server process exit
serverProcess.on('close', (code) => {
    log(`Health check server exited with code ${code}`);
    if (code !== 0 && !isShuttingDown) {
        log('Attempting to restart health check server...');
        // In production, we might want to restart the server
        if (process.env.NODE_ENV === 'production') {
            // Restart logic would go here
        }
    }
});

// Start the React application
// In production, we serve the built files
const isProduction = process.env.NODE_ENV === 'production';
log(`Starting React application in ${isProduction ? 'production' : 'development'} mode...`);

// Determine build directory - use BUILD_DIR env var or default to 'build'
const buildDir = process.env.BUILD_DIR || path.join(__dirname, 'build');
log(`Using build directory: ${buildDir}`);

// Set environment variables to address webpack deprecation warnings
const reactEnv = { 
    ...process.env, 
    BROWSER: 'none', // Prevent opening browser
    // Disable ESLint cache in production to avoid read-only filesystem errors
    DISABLE_ESLINT_PLUGIN: isProduction ? 'true' : process.env.DISABLE_ESLINT_PLUGIN,
    ESLINT_NO_DEV_ERRORS: isProduction ? 'true' : process.env.ESLINT_NO_DEV_ERRORS,
    // Use the new webpack dev server options to avoid deprecation warnings
    WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
    WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
    WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
    // Set build path for react-scripts
    BUILD_PATH: buildDir
};

const reactProcess = spawn(
    isProduction ? 'npx' : 'react-scripts',
    isProduction ? ['serve', '-s', buildDir, '-l', '3000'] : ['start'],
    {
        stdio: 'pipe',
        shell: true,
        env: reactEnv
    }
);

// Capture React app output for logging
reactProcess.stdout.on('data', (data) => {
    log(`[REACT] ${data.toString().trim()}`);
});

reactProcess.stderr.on('data', (data) => {
    log(`[REACT ERROR] ${data.toString().trim()}`);
});

log('React application started');

// Handle React process exit
reactProcess.on('close', (code) => {
    log(`React process exited with code ${code}`);
    if (!isShuttingDown) {
        // Kill the server process if React process exits unexpectedly
        log('React process exited unexpectedly, shutting down...');
        shutdown(code);
    }
});

// Flag to prevent multiple shutdown attempts
let isShuttingDown = false;

// Graceful shutdown function
function shutdown(exitCode = 0) {
    if (isShuttingDown) return;
    isShuttingDown = true;

    log('Shutting down gracefully...');

    // Set a timeout to force exit if graceful shutdown takes too long
    const forceExitTimeout = setTimeout(() => {
        log('Forced exit after timeout');
        process.exit(exitCode);
    }, 10000); // 10 seconds

    // Clear the timeout if we exit before it triggers
    forceExitTimeout.unref();

    // Kill child processes
    if (serverProcess) {
        log('Terminating health check server...');
        serverProcess.kill('SIGTERM');
    }

    if (reactProcess) {
        log('Terminating React application...');
        reactProcess.kill('SIGTERM');
    }

    // Close log stream
    log('Closing log stream...');
    logStream.end(() => {
        log('Log stream closed');
        process.exit(exitCode);
    });
}

// Handle process termination signals
process.on('SIGINT', () => {
    log('Received SIGINT');
    shutdown(0);
});

process.on('SIGTERM', () => {
    log('Received SIGTERM');
    shutdown(0);
});
