Setup server connect to postgreSQL

1. Install postman-postgres
mkdir postman-postgres
cd postman-postgres
npm init -y
npm install express pg body-parser

2. Install dotenv
npm install dotenv

3. Create .env file & input data
DATABASE_URL1=postgres://user1:password1@host1:port1/database1
DATABASE_URL2=postgres://user2:password2@host2:port2/database2

4. Create JS file: server.js with info
const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');
const dotenv = require('dotenv');

// xử lý cho nhiều DB
// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Function to create a new database client
const createClient = (databaseUrl) => {
  return new Client({
    connectionString: databaseUrl,
  });
};

// Middleware to set the database connection based on a request header or query parameter
app.use((req, res, next) => {
  const dbIdentifier = req.query.db || req.headers['x-database'];
  let databaseUrl;

  switch (dbIdentifier) {
    case 'db1':
      databaseUrl = process.env.DATABASE_URL1;
      break;
    case 'db2':
      databaseUrl = process.env.DATABASE_URL2;
      break;
    default:
      return res.status(400).send('Invalid database identifier');
  }

  req.dbClient = createClient(databaseUrl);
  req.dbClient.connect()
    .then(() => next())
    .catch(err => {
      console.error('Database connection error', err.stack);
      res.status(500).send('Database connection error');
    });
});

app.use(bodyParser.json());

// Example endpoint to get current time from PostgreSQL
app.get('/time', async (req, res) => {
  try {
    const result = await req.dbClient.query('SELECT NOW()');
    res.json(result.rows);
  } catch (err) {
    console.error('Query error', err.stack);
    res.status(500).json({ error: 'Database query failed' });
  } finally {
    req.dbClient.end();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

3. Start server:
node server.js

4. Open postman & call:
GET http://localhost:3000/time?db=db1
or use custom header:
GET http://localhost:3000/time
Header: x-database: db1