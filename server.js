const express = require('express');
const path = require('path');
require('cross-fetch/polyfill');

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const API_KEY = '6a6275c0-b77e-11e8-a4d1-69890776a30b';

// behavior for the index route
app.get('/', (req, res) => {
  const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    res.render('index', {galleries: data.records});
  });
});

app.get('/gallery/:gallery_id', function(req, res) {
  const ids = `https://api.harvardartmuseums.org/object?gallery=${req.params.gallery_id}&apikey=${API_KEY}`;
  fetch(ids)
  .then(response => response.json())
  .then(data => {
    res.render('gallery', {objects: data.records});
  })
});

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}/`);
});
