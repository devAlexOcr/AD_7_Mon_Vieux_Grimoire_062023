const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    imageUrl: { type: String, required: true },
    titre: { type: String, required: true},
    auteur: { type: String, required: true },
    année: { type: Number, required: true },
    genre:{ type: String, required: true }, 
    note: { type: Number, required: true }, 
});

module.exports = mongoose.model('thing', bookSchema); // 2 arguments le nom et le schema