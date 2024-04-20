import express from 'express';
import path from 'path';
import db from './src/server/db.js'; // Make sure the path to your db config is correct
import { getHTML, getCSS, getJavaScript, getImage, get404, get500 } from './functions.js';
import { fileURLToPath } from 'url';

import cors from 'cors';

const app = express();
app.use(cors()); // This enables CORS for all routes and all origins

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
db.getConnection()
  .then(() => {
    console.log('Connected to the database successfully');
    logUsers(); // Call the function to log all users
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

async function logUsers() {
    try {
        const [users] = await db.execute('SELECT * FROM users');
        console.log('All users:', users);
    } catch (error) {
        console.error('Error retrieving users:', error);
    }
}
  

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

app.get('/api/users', async (req, res) => {
  console.log('Reached /api/users route');
  // Hardcoded test data for users with IDs 1 and 2
  const testData = [
      {
          id: 1,
          username: 'torarne',
          email: 'torarnehave@gmail.com',
          password: 'dev_Mandala1.',
          role: 'admin',
          created_at: '2024-04-20T07:58:13.000Z',
          updated_at: '2024-04-20T07:58:13.000Z'
      },
      {
          id: 2,
          username: 'maiken',
          email: 'msneeggen@gmail.com',
          password: 'dev_Mandala24.',
          role: 'admin',
          created_at: '2024-04-20T07:59:07.000Z',
          updated_at: '2024-04-20T07:59:07.000Z'
      }
  ];

  res.json(testData); // Send the hardcoded data as JSON
});


app.post('/api/log-error', (req, res) => {
  console.log('Error received:', req.body);
  // Add any logging mechanism here, e.g., writing to a file or database
  res.status(200).json({ message: 'Error logged successfully' });
});


export default app;
