const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {
    it('GET request "/" should return the index page', function () {
      return chai.request(app)
        .get('/')
        .then(function (res) {
          expect(res).to.exist;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
        });
    });
  
});
  
describe('404 handler', function () {
    it('should respond with 404 when given a bad path', function () {
      return chai.request(app)
        .get('/DOES/NOT/EXIST')
        .then(res => {
          expect(res).to.have.status(404);
        })
    });
});

describe('Get request "/api/notes"', function(){
    it('should respond with an array of objects containing 10 notes', function(){
        return chai.request(app)
        .get('/api/notes')
        .then(function(res){
            console.log(res); 
            expect(res).to.have.property('body').and.to.be.an('array'); 
            expect(res.body).lengthOf(10); 
            for(let i=0; i<res.body.length; i++){
            expect(res.body[i]).to.have.keys('id', 'title', 'content');
            }
        }); 
    });

    it('should respond with the correct object', function(){
        return chai.request(app)
        .get('/api/notes/?searchTerm=incredible')
        .then((res)=>{
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(1); 
        });
    });

    it('should return correct note if searched with id',function(){
        return chai.request(app)
        .get('/api/notes/1004')
        .then((res)=>{
            for(let i=0; i<res.body.length; i++){
                expect(res.body).to.have.length(1);
                expect(res.body[i]).to.have.keys('id', 'title', 'content');
                expect(res.body[i].id)===1004; 
            }
        });
    });

    it('should respond with 404 error for invalid target id', function(){
        
        return chai.request(app)
        .get('/api/notes/DOESNOTEXIST')
        .catch(err => err.response)
        .then(res => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('message');
        })
        .catch(err =>err.response);
    });
});

describe('POST "api/notes"', function(){
    it('should create a new item when provided the correct data', function(){
        const newObject = {
            title:'mad max screams anarchy', 
            content:'witness me!!!!'
        };
        return chai.request(app)
        .post('/api/notes')
        .send(newObject)
        .then((res) =>{
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('id', 'title', 'content');
            expect(res.body).to.deep.equal(
                Object.assign(newObject, { id: res.body.id })
              );
        });
    });

    it('should respond with "Missing title in request body" when missing title', function(){
        const missingTitle = {
            content:'witness me!!!'
        }
        return chai.request(app)
        .post('/api/notes')
        .send(missingTitle)
        .then((res)=>{
            expect(res).to.have.status(404);
            expect(res).to.be.json; 
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('message'); 
            expect(res.body.message).to.eq('Missing `title` in request body');
        })
        .catch(err => err.response); 
    })
});
describe('DELETE /api/notes/:id', function()  {
    it('should delete recipes on DELETE', () => {
      return chai
        .request(app) 
        .delete('/api/notes/1001')
        .then(res => {
          expect(res).to.have.status(204);
        });
    });
}); 
    
