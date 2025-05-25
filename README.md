# escucha.xyz
Front-end artist recommender built using `React.js` and `Firestore`.

Implementation details can be found [here](https://www.oliver.dev/posts/2019/08/building-an-artist-recommender-part-ii.html).

## Development Requirements

### Node.js Version
This project requires Node.js 22.x.

#### Installing Node.js 22.x
If you're using nvm (Node Version Manager), you can install and use Node.js 22.x with:

```bash
nvm install 22
nvm use 22
```

Alternatively, you can download Node.js 22.x directly from the [Node.js website](https://nodejs.org/download/release/latest-v22.x/).

### Installation
After ensuring you have the correct Node.js version:

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
Environment variables are managed through `.env.yaml` for Google Cloud deployment. Make sure this file is properly configured with your Firebase credentials.

### Deploying to Google Cloud App Engine
1. Make sure you have the Google Cloud SDK installed and configured
2. Ensure your `.env.yaml` file is properly set up with your environment variables
3. Deploy the application with:

```bash
gcloud app deploy
```

### Monitoring and Logging
The application includes comprehensive logging that writes to both the console and log files in the `logs` directory. In Google Cloud, you can view logs in the Cloud Logging console.

### Scaling
The application is configured to automatically scale between 1 and 5 instances based on CPU utilization (target: 65%). You can adjust these settings in the `app.yaml` file.

### Security Considerations
- All traffic is forced to use HTTPS
- Health checks are configured for both liveness and readiness
- Error handling is implemented for graceful recovery

### Maintenance
Regular maintenance tasks:
1. Keep dependencies updated with `npm audit` and `npm update`
2. Monitor application logs for errors
3. Set up alerts for critical errors or performance issues
4. Periodically review and update scaling configuration based on actual usage patterns
