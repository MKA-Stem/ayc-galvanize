import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import {resolve} from 'path';
import fs from 'fs';

dotenv.config();

const PORT = process.env.PORT || 8080;
const DEV = process.env.NODE_ENV === 'development';

const app = express();

// Compress all requests.
app.use(compression());

// Add latency in development..
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    setTimeout(next, 500);
  });
}

// Make sure it can find the SPA
const SPA_ROOT = resolve('../client/build');
const indexPath = resolve(SPA_ROOT, 'index.html');
if (!DEV && indexPath) {
  console.log(`SPA index at: ${indexPath}`);
  if (!fs.existsSync(indexPath)) {
    console.error("Can't find SPA static files. Exiting.");
    process.exit(1);
  }
}

// Serve SPA files
app.use(express.static(SPA_ROOT));

app.get('*', (req, res, next) => {
  res.sendFile(SPA_ROOT + '/index.html');
});

app.listen(PORT, () => {
  console.log("Now listening on " + PORT);
});