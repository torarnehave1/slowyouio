import express from 'express';
import path from 'path';
import db from './src/server/db.js'; // Make sure the path to your db config is correct
import { getHTML, getCSS, getJavaScript, getImage, get404, get500 } from './functions.js';
import { fileURLToPath } from 'url';

import cors from 'cors';

const app = express();
app.use(cors()); // This enables CORS for all routes and all origins


db.getConnection().then(() => { 
  console.log('Connected to database');
}).catch((error) => {
  console.error('Error connecting to database:', error);
});



app.get('/api/users', async (req, res) => {
  try {
    await db.getConnection();  // Ensure database connection
    const [users] = await db.execute('SELECT * FROM users');  // Fetch users

    res.json({ status: 'Connected', users: users });
  } catch (error) {
    console.error('Error:', error);
    const message = error.code === 'ECONNREFUSED' ? 'Database connection refused' : 'Internal server error';
    
    res.status(500).json({ status: 'Error', error: message });
  }
});

app.get('/api/test-db', async (req, res) => {
 
  db.getConnection().then(() => { 
    console.log('Connected to database');
  }).catch((error) => {
    console.error('Error connecting to database:', error);
  });
  
});


// app.get('/api/users', async (req, res) => {
//   console.log('Reached /api/users route');
//   // Hardcoded test data for users with IDs 1 and 2
//   res.json([
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' }
//   ]);
// });

// app.get('/api/users', async (req, res) => {
//   try {
//     console.log('Reached /api/users route');
//     const [rows] = await db.execute('SELECT * FROM users');
//     res.send(JSON.stringify(rows));
//   } catch (error) {
//     console.error('Failed to fetch users:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/style.css', (req, res) => {
  res.send(getCSS());
});

app.get('/main.js', (req, res) => {
  res.send(getJavaScript());
});

app.get('/image.jpg', (req, res) => {
  res.send(getImage());
});

app.get('*', (req, res) => {
  res.send(get404());
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(get500());
});

// Check database connection and log all users
// async function logUsers() {
//     try {
//         const [users] = await db.execute('SELECT * FROM users');
//         console.log('All users:', users);
//     } catch (error) {
//         console.error('Error retrieving users:', error);
//     }
// }
  






export default app;
