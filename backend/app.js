const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');

const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const publicationsRoutes = require('./routes/publications');
const commentsRoutes = require('./routes/comments');


const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/users', usersRoutes);
app.use('/auth', authRoutes);
app.use('/publications', publicationsRoutes);
app.use('/comments', commentsRoutes);


module.exports = app;
