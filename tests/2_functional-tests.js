/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    var id;
    var id1;
    var id2;
    var id3;
  suite('API ROUTING FOR /api/threads/:board', function() {

    suite('POST', function() {
         test('create new threads - one will be deleted later', function(done) {
        chai.request(server)
        .post('/api/threads/fcc')
        .send({text:'fcctest', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
        });
        chai.request(server)
        .post('/api/threads/fcc')
        .send({text:'fcctest', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          done();
        });
      });
    });
    
    suite('GET', function() {
       test('most recent 10 bumped threads on the board with only the most recent 3 replies', function(done) {
        chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isArray(res.body[0].replies);
          assert.isBelow(res.body.length, 11);
          assert.isBelow(res.body[0].replies.length, 4);
          id = res.body[0]._id;
          id2 = res.body[1]._id;
          done();
        });
      });
    });
    
    suite('DELETE', function() {
       test('delete thread - good password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id:id, delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
      test('delete thread - bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: id2, delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('report a thread', function(done) {
        chai.request(server)
        .put('/api/threads/fcc')
        .send({report_id:id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
      
    });
 

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
       test('reply to a thread', function(done) {
        chai.request(server)
        .post('/api/replies/fcc')
        .send({thread_id: id2, text:'a reply'+'fcc reply testing', delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          //id3 = res.body[0]._id;
          //console.log(id3);
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('entire thread with all its replies', function(done) {
        chai.request(server)
        .get('/api/replies/fcc')
        .query({thread_id: id2})
        .end(function(err, res){
          //console.log(res.body.replies)
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.property(res.body, 'text');
          assert.property(res.body, 'replies');
          assert.notProperty(res.body, 'reported');
          assert.property(res.body, 'created_on');
          assert.property(res.body,'bumped_on');
          assert.isArray(res.body.replies);
          assert.notProperty(res.body.replies[0], 'delete_password');
          assert.notProperty(res.body.replies[0], 'reported');
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'a reply'+'fcc reply testing');
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('report a reply', function(done) {
        chai.request(server)
        .put('/api/replies/fcc')
        .send({thread_id:id2 ,reply_id:id2})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
      });
      
    });
    
    suite('DELETE', function() {
         test('delete reply - good password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id:id2,reply_id:id3, delete_password:'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
      });
      
      test('delete reply - bad password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({thread_id: id2,reply_id:id3 , delete_password: 'wrong'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
      });
    });
    
  });

});
