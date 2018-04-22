import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import { resolve } from 'path';
import fs from 'fs';
import db from './data/db';

dotenv.config();

const PORT = process.env.PORT || 8080;
const DEV = process.env.NODE_ENV === 'development';

const app = express();

// Parse request bodies
app.use(bodyParser.json());

// Good Logging
app.use(require('morgan')('dev'));

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

// API Endpoints
app.post('/api/newMessage', async (req, res) => {
  /*
    {
      phone: "String",
      key: "String"
    }

    Hashes Key and puts all in keys table
  */

  if (req.body.phone && req.body.key) {

    const hash = req.body.key; // hashing to come later

    await db('keys').insert({
      hash: hash,
      phone: req.body.phone,
      key: req.body.key
    });

    res.status(200).send({ status: "ok" });

  } else {
    res.status(400).send({ error: "missing required parameters" });
  }
});

app.post('/api/getPhone', async (req, res) => {
  /*
    {
      hash: "String"
    }

    Returns phone based on keyHash from keys table
  */

  if (req.body.hash) {

    const phone = await db('keys').where({
      hash: req.body.hash
    }).select('phone');

    if(phone[0]) {
      res.status(200).send(phone[0]);
    } else {
      res.status(404).send({ error: "hash not found"})
    }

  } else {
    res.status(400).send(error: "missing required paramaters");
  }
});

app.post('/api/send2FA', (req, res) => {
  /*
    {
      hash: "String"
    }

    Sends 2FA to phone number based on keyHash in keys table
  */
});

app.post('/api/verify2FA', (req, res) => {
  /*
    {
      keyHash: "String",
      code: "String"
    }

    Verifies the code then sends unhashed key if good
  */
});

app.get('*', (req, res, next) => {
  res.sendFile(SPA_ROOT + '/index.html');
});

app.listen(PORT, () => {
  console.log("Now listening on " + PORT);
});