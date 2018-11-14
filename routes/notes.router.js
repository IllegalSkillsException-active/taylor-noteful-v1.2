
const express = require('express'); 
const router = express.Router(); 
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

  router.get('/',(req, res, next)=> {
    console.log('api notes'); 
    const { searchTerm } = req.query;  
    notes.find(searchTerm, (err, list)=> {
      if(err){
        return next(err); 
      }
      if(list === undefined){
        return res.json(data); 
      }
      console.log(!list); 
      res.json(list); 
    });
  });

console.log('Hello Noteful!');

// Put update an item
router.put('/:id', (req, res, next) => {
    const id = req.params.id;
    /***** Never trust users - validate input *****/
    const updateObj = {};
    const updateableFields = ['title', 'content'];
  
    updateableFields.forEach(field => {
      if (field in req.body) {
        updateObj[field] = req.body[field];
      }
    });
    /***** Never trust users - validate input *****/
    if (!updateObj.title) {
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    notes.update(id, updateObj, (err, item) => {
      if (err) {
        return next(err);
      }
      if (item) {
        res.json(item);
      } else {
        next();
      }
    });
});
// Post (insert) an item
router.post('/', (req, res, next) => {
  const { title, content } = req.body;
  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});
module.exports= router
