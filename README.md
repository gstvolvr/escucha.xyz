# escucha.xyz
Front-end artist recommender built using `React.js` and `Firestore`.

Implementation details can be found [here](https://www.oliver.dev/posts/2019/08/building-an-artist-recommender-part-ii.html).

## Development Requirements

### Node.js Version
This project requires Node.js 22.x.

#### Installing Node.js 22.x
If you're using nvm, you can install and use Node.js 22.x with:

```bash
nvm install 22
nvm use 22
```

### Installation
```bash
npm install
```

### Running the Application
```bash
npm start
```

### Building for Production
```bash
npm run build
```

## Production Deployment

### Architecture
The application consists of two main components:
1. **React Frontend**: Serves the user interface and handles client-side logic
2. **Health Check Server**: Handles liveness and readiness checks for Google Cloud

The `main.js` file orchestrates both components, starting them as separate processes and managing their lifecycle.

### Environment Variables
Environment variables are managed through `.env.yaml` for Google Cloud deployment.

### Deploying to Google Cloud App Engine
1. Make sure you have the Google Cloud SDK installed and configured
2. Ensure your `.env.yaml` file is properly set up with your environment variables
3. Deploy the application with:

```bash
gcloud app deploy
```

After deployment you can view the app using:
```bash
gcloud app browse
```

### Monitoring and Logging
The application includes comprehensive logging that writes to both the console and log files in the `logs` directory. 

```bash
gcloud app logs tail -s default
```

### Scaling
The application is configured to automatically scale between 1 and 5 instances based on CPU utilization (target: 65%). You can adjust these settings in the `app.yaml` file.

### Security Considerations
- All traffic is forced to use HTTPS
- Health checks are configured for both liveness and readiness
- Error handling is implemented for graceful recovery

### Troubleshooting Production Issues

#### Read-Only Filesystem Errors
When deploying to Google Cloud App Engine, the filesystem is read-only except for the `/tmp` directory. The application is configured to handle this by:

1. Using writable temporary directories:
   - The `BUILD_DIR` environment variable in app.yaml is set to `/tmp/build`
   - The build script in package.json uses `BUILD_PATH=${BUILD_DIR:-build}` to set the output directory
   - Both main.js and server.js check for this environment variable and use it appropriately
   - The logs directory is automatically moved to `/tmp/logs` in production environments
   - The application gracefully handles cases where file logging is not available

2. Disabling ESLint cache and other features that require filesystem writes:
   - The build script uses `DISABLE_ESLINT_PLUGIN=true` and `ESLINT_NO_DEV_ERRORS=true`
   - These environment variables are passed to child processes in main.js

If you encounter filesystem-related errors:
- Check that the `BUILD_DIR` environment variable is set correctly in app.yaml
- Verify that the build script in package.json is using the `BUILD_PATH` variable
- Ensure that main.js and server.js are using the correct build directory path

#### App Engine Lifecycle Endpoints
The server handles the following App Engine lifecycle endpoints:
- `/_ah/start`: Called when an instance starts
- `/_ah/stop`: Called when an instance is about to be stopped
- `/liveness_check`: Health check to verify the instance is alive
- `/readiness_check`: Health check to verify the instance is ready to serve traffic

The readiness check now includes additional logic to create the build directory if it doesn't exist and is in a writable location.

These variables configure webpack-dev-server to use the new middleware options instead of the deprecated ones.
