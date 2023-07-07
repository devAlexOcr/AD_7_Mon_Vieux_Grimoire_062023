const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
// const helmet = require('helmet')


mongoose.connect('mongodb+srv://ADback:nie3eiRETJ82vNFJ@atlascluster.bzinuny.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
// app.use(helmet());
app.use(express.json()); // = bodyParser intercepete toute les requeste avec un json et les met a disposition dans un req.body
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => { // ajout des headers sur l'objet response
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;
