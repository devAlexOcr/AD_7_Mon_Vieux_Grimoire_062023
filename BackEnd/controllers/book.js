const Book = require('../models/Book.js')
const fs = require('fs')

exports.rating = (req, res, next) => {
  Book.findOne({_id: req.params.id})
    .then((book) => {

      // ajout de la notation pour le livre 

      book.ratings.push(req.body)

      // recupération de l'ensemble des notes 

      const notes = book.ratings.map(note => {
        if ( note.grade == undefined){
          return note.rating
        } else {
          return note.grade
        }        
      });

      // Calcul de la note moyenne du livre

      function check(a, b) {
        return a + b;
      }
      let sum = notes.reduce(check);
      let avg = Math.round(sum / notes.length);
      console.log(avg)
        Book.updateOne({_id: req.params.id}, {Book, ratings: book.ratings, averageRating: avg})
          .then (() => res.status(200).json({message: 'ratings enregistré'}))
          .catch(error => res.status(401).json({error}));
    })
  .catch(error => res.status(404).json({ message : 'book non trouvé '}));   
};

exports.bestrating = (req, res, next) => {
  Book.find()
  .then(books => {
 
    let sortBook = books.sort(function (a,b) {
      return a.averageRating - b.averageRating
    });

    let bestBook = sortBook.reverse();

  res.status(200).json(bestBook.slice(0,3))
})
  .catch(error => res.status(400).json({error})); 
}

exports.createBook = (req, res, next) => {  
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const NewBook = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  NewBook.save()
    .then(() => res.status(201).json({message: 'Objet enregistre !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : {...req.body};
  delete bookObject._userId;
  Book.findOne({_id: req.params.id})
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(400).json({message: 'non autorisé'});
      } else {
        Book.updateOne({ _id: req.params.id}, {...bookObject, _id: req.params.id})
        .then (() => res.status(200).json({message: 'objet modifié'}))
        .catch(error => res.status(401).json({error}))
      }
    })
    .catch(error => res.status(400).json({error}))
  };

  exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

exports.getOneBook = (req, res, next) => { // id accessible par req.params.id
    Book.findOne({ _id: req.params.id})
      .then(book => res.status(200).json(book))
      .catch(error => res.status(404).json({error}));   
  };

exports.getAllBook = (req, res, next) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({error}));   
  };