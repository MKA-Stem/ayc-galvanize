import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import {resolve} from 'path';
import fs from 'fs';
import db from './data/db';
import SHA256 from 'crypto-js/sha256';

import {generateCode, sendToken} from './lib/twofactor';

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
    const hash = SHA256(req.body.key).toString();

    await db('keys').insert({
      hash: hash,
      phone: req.body.phone,
      key: req.body.key
    });

    res.status(200).json({status: 'ok'});
  } else {
    res.status(400).json({error: 'missing required parameters', display: 'Internal error'});
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
    const phone = await db('keys')
      .where({
        hash: req.body.hash
      })
      .select('phone');

    if (phone[0] && phone[0].phone) {
      res.status(200).json(phone[0]);
    } else {
      res
        .status(404)
        .json({error: 'hash not found', display: 'Message has expired or does not exist'});
    }
  } else {
    res.status(400).json({error: 'missing required paramaters', display: 'Internal error'});
  }
});

app.post('/api/send2FA', async (req, res) => {
  /*
    {
      hash: "String"
    }

    Sends 2FA to phone number based on keyHash in keys table
  */

  if (req.body.hash) {
    const phone = await db('keys')
      .where({
        hash: req.body.hash
      })
      .select('phone');

    if (phone[0].phone) {
      const code = generateCode();
      await sendToken(phone[0].phone, code);

      await db('twofactor').insert({
        code: code.toLowerCase(),
        phone: phone[0].phone
      });

      res.status(200).json({status: 'ok'});
    } else {
      res
        .status(404)
        .json({error: 'hash not found', display: 'Message has expired or does not exist'});
    }
  } else {
    res.status(400).json({error: 'missing required paramaters', display: 'Internal error'});
  }
});

app.post('/api/verify2FA', async (req, res) => {
  /*
    {
      hash: "String",
      code: "String"
    }

    Verifies the code then sends unhashed key if good
    Get the phone based on hash and from phone get good codes, then check if any of those codes are correct, if they are deletos all entries for that phone
  */

  if (req.body.hash && req.body.code) {
    const response = await db('keys')
      .where({
        hash: req.body.hash
      })
      .select('phone', 'key');

    if (response[0] && response[0].phone && response[0].key) {
      const codes = await db('twofactor')
        .where({
          phone: response[0].phone
        })
        .select('code');

      let found = false;
      codes.forEach(async e => {
        found |= e.code === req.body.code.toLowerCase();
      });

      if (found) {
        await db('twofactor')
          .where({
            phone: response[0].phone
          })
          .del();

        await db('keys')
          .where({
            hash: req.body.hash
          })
          .del();

        res.status(200).json({key: response[0].key});
      } else {
        res.status(403).json({error: 'incorrect code', display: 'Auth code was incorrect'});
      }
    } else {
      res
        .status(404)
        .json({error: 'hash not found', display: 'Message has expired or does not exist'});
    }
  } else {
    res.status(400).json({error: 'missing required paramaters', display: 'Internal error'});
  }
});

app.get('*', (req, res, next) => {
  res.sendFile(SPA_ROOT + '/index.html');
});

app.listen(PORT, () => {
  console.log('Now listening on ' + PORT);
});
