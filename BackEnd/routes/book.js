const express = require('express');
const auth = require('../middlewares/auth');
const multer = require ('../middlewares/multer-config');
const bookCtrl = require ('../controllers/book');

const router = express.Router();


router.post('/', auth, multer, bookCtrl.createThing); 
router.put('/:id', auth, multer, bookCtrl.modifyThing);  
router.delete('/:id', auth, bookCtrl.deleteThing);  
router.get('/:id', auth, bookCtrl.getOneThing);
router.get('/', auth, bookCtrl.getAllThing);

module.exports = router;