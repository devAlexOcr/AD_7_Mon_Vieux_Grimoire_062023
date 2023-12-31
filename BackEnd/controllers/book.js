const Book = require('../models/Book.js')
const fs = require('fs')

function uploadFile(req, res) {
  const { mimetype } = req.file;
 
  const mimeTypesArray = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  const mimeTypeVerify = mimeTypesArray.includes(mimetype) 
  // gestion de l'envoie du mauvais type de fichier

  if (mimeTypeVerify === false) {
    return false
  } else {
    // verification de la presence du dossier de sortie et creation si necessaire
      fs.access('./images', (error) => {
          if (error) {
            fs.mkdirSync('./images');
          }
        });
        return `${req.protocol}://${req.get('host')}/${req.file.path}`;
  }};

exports.rating = (req, res, next) => {
  Book.findOne({_id: req.params.id})
    .then((book) => {
      // creation d'un tableau regroupant les differents users qui ont notés le livre
      const userRated = book.ratings.map(verify => {
        return verify.userIds
      });
      
      // permet de verifier la presence d'un utilisateur dans le tableau ratings et renvoie un boolean
      const userVerify = userRated.includes(req.auth.userId)


      if (userVerify == false) {
      const NewRating = {
        userId: req.auth.userId,
        grade: req.body.rating
      };

      // ajout de la notation pour le livre 

      book.ratings.push(NewRating)

      // recupération de l'ensemble des notes 

      const notes = book.ratings.map(note => {
        return note.grade      
        });

      // Calcul de la note moyenne du livre
        // function callback pour caluler la somme de 2 nbres
      function check(a, b) {
        return a + b;
      }
      let sum = notes.reduce(check);
      let avg = Math.round(sum / notes.length);
      book.averageRating = avg
     
      Book.updateOne({_id: req.params.id}, {averageRating: avg, ratings: book.ratings})
          .then (() => {

           res.status(200).json(book)
          })
          .catch(error => res.status(401).json({error}));
      }
    })
    .catch(error => res.status(404).json({ message : 'book non trouvé '}));
   
};

exports.bestrating = (req, res, next) => {
  Book.find()
  .then(books => {
    // tri des livre en fonction de la moyenne = classement min a max
    let sortBook = books.sort(function (a,b) {
      return a.averageRating - b.averageRating
    });
    // reverse classement pour note max a min
    let bestBook = sortBook.reverse();
    // selection des 3 premiers livre du classement
  res.status(200).json(bestBook.slice(0,3))
})
  .catch(error => res.status(400).json({error})); 
}

exports.createBook =   async (req, res, next) => {  
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

  const link = uploadFile(req);

  if(link === false){
    return  res.status(410).json({message : 'format image incorrect'})
  }else{
  const NewBook = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: link
  });

  NewBook.save()
    .then(() => res.status(201).json({message: 'Objet enregistre !'}))
    .catch(error => res.status(400).json({ error }));
}
};

exports.modifyBook =  async (req, res, next) => {
  const link = uploadFile(req);
  if(link === false){
    res.status(410).json({message : 'format image incorrect'})
  }else{
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: link
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
  }
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