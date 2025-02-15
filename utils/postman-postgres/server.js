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
  const env_ = req.headers['base-url']; // req.url.host[0];
  let databaseUrl;

  switch(env_){ //process.env.RUN_ENV
    case 'sbh-stg': // 'stg-api':
      switch (dbIdentifier) {
        case 'business':
          databaseUrl = process.env.DB_STG_URL_BUSINESS;
          break;
        case 'banking':
          databaseUrl = process.env.DATABASE_URL_BANKING;
          break;
        case 'qr_request':
          databaseUrl = process.env.DATABASE_URL_QR_REQUEST;
          break;
        case 'qc':
          databaseUrl = process.env.DB_STG_URL_QC;
          break;
        default:
          return res.status(400).send('Invalid database identifier');
      }
      break;
    case "https://dev-api.finan.one": //'dev-api':
      switch (dbIdentifier) {
        case 'business':
          databaseUrl = process.env.DATABASE_URL_BUSINESS;
          break;
        case 'banking':
          databaseUrl = process.env.DATABASE_URL_BANKING;
          break;
        case 'qc':
          databaseUrl = process.env.DB_STG_URL_QC;
          break;
        default:
          return res.status(400).send('Invalid database identifier');
      }
      break;
    case "https://api.finan.one": // 'api': // prod env
    default:
        return res.status(400).send('Invalid env' + env_);
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

// ============================================================================================
// Example endpoint to get list log and report
app.get('/report-and-log/get-list', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const page_size = parseInt(req.query.page_size) || 10;

    // Calculate OFFSET and LIMIT
    const offset = (page - 1) * page_size;
    const limit = page_size;

    const result = await req.dbClient.query(
      'SELECT *'
      + ' FROM public.qc_auto_report_n_log'
      + ' ORDER BY created_at DESC LIMIT $1 OFFSET $2'
      // + ' WHERE business_id = ' + req.query.business_id
      // + ' AND usage_type = ' + req.query.usage_type.toString()
      , [limit, offset]
    );

    // Query total count for pagination
    const countQuery = 'SELECT COUNT(*) FROM public.qc_auto_report_n_log';
    const countResult = await req.dbClient.query(countQuery);

    // Get total rows in the table
    const total_items = parseInt(countResult.rows[0].count, 10);
    const total_pages = Math.ceil(total_items / page_size);

    let meta ={
      "page": page,
      "page_size": page_size,
      "total_pages": total_pages,
      "total_rows":total_items
    }

    let resp = {
      "data":result.rows,
      "meta":meta
    }
    res.json(resp);
    // res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Write report & log to database
app.post('/report-and-log/create', async (req, res) => {
  const {
    log_file_link,
    report_file_link,
    created_at
  } = req.body;

  try {
    const result = await req.dbClient.query(
      `INSERT INTO public.sbh_report_n_log (
        project, type, log_file_link, report_file_link, created_at
      ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        log_file_link,
        report_file_link, 
        created_at
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get finan_stg_fs_banking_adapters.request
app.get('/banking/get_terminal_label', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const page_size = parseInt(req.query.page_size) || 10;

    // Calculate OFFSET and LIMIT
    const offset = (page - 1) * page_size;
    const limit = page_size;
 
    const result = await req.dbClient.query(
      'SELECT id, created_at, provider, action, object_key, status'
      + ' FROM public.request'
      + ' ORDER BY created_at DESC LIMIT $1 OFFSET $2'
      // + ' WHERE business_id = ' + req.query.business_id
      // + ' AND usage_type = ' + req.query.usage_type.toString()
      , [limit, offset]
    );

    // Query total count for pagination
    const countQuery = 'SELECT COUNT(*) FROM public.request';
    const countResult = await req.dbClient.query(countQuery);

    // Get total rows in the table
    const total_items = parseInt(countResult.rows[0].count, 10);
    const total_pages = Math.ceil(total_items / page_size);

    let meta ={
      "page": page,
      "page_size": page_size,
      "total_pages": total_pages,
      "total_rows":total_items
    }

    let resp = {
      "data":result.rows,
      "meta":meta
    }
    res.json(resp);
    // res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Get finan_stg_fs_biz_qr.qr_manual_request
app.get('/banking/get_qr_terminal', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const page_size = parseInt(req.query.page_size) || 10;

    // Calculate OFFSET and LIMIT
    const offset = (page - 1) * page_size;
    const limit = page_size;
 
    const result = await req.dbClient.query(
      'SELECT id, created_at, remark, ref_id, source_number, bank_code, amount, transaction_type, transaction_ref_id, platform_key'
      + ' FROM public.qr_manual_request'
      + ' ORDER BY created_at DESC LIMIT $1 OFFSET $2'
      // + ' WHERE business_id = ' + req.query.business_id
      // + ' AND usage_type = ' + req.query.usage_type.toString()
      , [limit, offset]
    );

    // Query total count for pagination
    const countQuery = 'SELECT COUNT(*) FROM public.qr_manual_request';
    const countResult = await req.dbClient.query(countQuery);

    // Get total rows in the table
    const total_items = parseInt(countResult.rows[0].count, 10);
    const total_pages = Math.ceil(total_items / page_size);

    let meta ={
      "page": page,
      "page_size": page_size,
      "total_pages": total_pages,
      "total_rows":total_items
    }

    let resp = {
      "data":result.rows,
      "meta":meta
    }
    res.json(resp);
    // res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});