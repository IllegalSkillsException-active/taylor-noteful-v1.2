'use strict';

// Load array of notes
const express = require('express'); 
const data = require('./db/notes');
const app = express();


app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

app.get('/api/notes', (req, res) => {
   const search = req.query.search; 

   if(search){
     const searchData = data.filter((item)=>item.title.includes(search))
     res.json(searchData);
   }

  
  else{
  res.json(data);
  }
  });

  app.get('/api/notes/:id',(req, res)=> {
    const id = req.params.id; 
    let note = data.find(item=>item.id === Number(id));  
    res.json(note); 
  });
console.log('Hello Noteful!');


