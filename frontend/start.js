const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

try {
  // Read config file
  const configPath = path.join(__dirname, '..', 'config.json');
  if (!fs.existsSync(configPath)) {
    console.error('Error: config.json not found in root directory');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

  // Validate config
  if (!config.ports?.frontend || !config.ports?.backend) {
    console.error('Error: Invalid config.json format. Must include ports.frontend and ports.backend');
    process.exit(1);
  }

  // Set environment variables
  process.env.PORT = config.ports.frontend;
  process.env.REACT_APP_BACKEND_URL = `http://localhost:${config.ports.backend}`;

  console.log('Starting frontend with configuration:');
  console.log(`Frontend Port: ${process.env.PORT}`);
  console.log(`Backend URL: ${process.env.REACT_APP_BACKEND_URL}`);

  // Start React app
  const cmd = process.platform === 'win32' ? 'react-scripts.cmd' : 'react-scripts';
  spawn(cmd, ['start'], {
    stdio: 'inherit',
    env: process.env
  });
} catch (error) {
  console.error('Error starting frontend:', error);
  process.exit(1);
}