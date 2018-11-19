'use strict';

// Load array of notes
  /***** Never trust users - validate input *****/
  const express = require('express');
  const { PORT } = require('./config');

  const morgan = require('morgan'); 
  const app = express(); 
  const notesRouter = require('./routes/notes.router.js')
  
  app.use(express.json()); 

 

app.use(morgan('common'));
app.use(express.static('public')); 

app.use('/api/notes',notesRouter); 

app.use(function (req, res, next) {
  console.log('404 should run'); 
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
  next(); 
}); 

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
  next(); 
});

if(require.main === module){
app.listen(PORT, function () {
  console.info(`Server listening on  ${PORT}`);
}).on('error', err => {
  console.error(err);
});
}
module.exports = app;
//change for heroku