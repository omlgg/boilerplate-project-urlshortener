import "dotenv/config";
import express from 'express';
import cors from 'cors';
import urlShortenerRouter from './url_shortener.js';
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({
  extended: true
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.use('/api/shorturl', urlShortenerRouter)

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
