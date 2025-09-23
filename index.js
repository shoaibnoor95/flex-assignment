// api/index.js (ESM)
import serverless from 'serverless-http';
import app from './src/app'; // your Express app that mounts all routes
export default serverless(app);
