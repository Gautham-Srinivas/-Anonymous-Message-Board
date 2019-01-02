/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var thread = require('../controllers/thread.js');
var reply = require('../controllers/reply.js');

module.exports = function (app) {
  var threads = new thread();
  var replies = new reply();
  app.route('/api/threads/:board')
      .get(threads.fetchThread)
      .post(threads.newThread)
      .put(threads.reportThread)
      .delete(threads.deleteThread); 
    
  app.route('/api/replies/:board')
    .get(replies.fetchReply)
    .post(replies.newReply)
    .put(replies.reportReply)
    .delete(replies.deleteReply);

};
