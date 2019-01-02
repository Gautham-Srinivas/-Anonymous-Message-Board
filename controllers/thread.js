var MongoClient = require('mongodb');
const CONNECTION_STRING = process.env.MONGOLAB_URI; 
var ObjectId = require('mongodb').ObjectId;

function thread(){
  
this.newThread = function(req,res){
  var board = req.params.board;
  var thread = {
    text: req.body.text,
    created_on: new Date(),
    bumped_on: new Date(),
    reported: false,
    delete_password: req.body.delete_password,
    replies: []   
  }
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
            var collection = db.collection('thread');
              collection.insert(thread,function(err,result){
                 if (err) throw console.log('Database insert err: '+err);
                 res.redirect('/b/'+board+'/');
          });
      })
 }


this.fetchThread= function(req,res){
  var board = req.params.board;
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
            var collection = db.collection('thread');
              collection.find({},{reported: false,delete_password: false, "replies.delete_password": false,"replies.reported": false}).sort({bumped_on: -1}).limit(10).toArray(function(err,result){
                 if (err) throw console.log('Database insert err: '+err);
                result.forEach(function(val){
                val.replycount = val.replies.length;
                if(val.replies.length > 3) {
                    val.replies = val.replies.slice(-3);
                }
            });
                res.json(result);
          });
      })
}

this.deleteThread = function(req,res){
  var board = req.params.board;
   MongoClient.connect(CONNECTION_STRING, function(err, db) {
            var collection = db.collection('thread');
           collection.findAndModify(
        {
          _id: new ObjectId(req.body.thread_id),
          delete_password: req.body.delete_password
        },
        [],
        {},
        {remove: true, new: false},
        function(err, doc){
          if (doc.value === null) {
            res.send('incorrect password');
          } else {
            res.send('success');
          }
        });    
   });
}

this.reportThread = function(req, res) {
    var board = req.params.board;
    MongoClient.connect(CONNECTION_STRING,function(err,db) {
      var collection = db.collection(board);
      collection.findAndModify({_id: new ObjectId(req.body.report_id)},{$set: {reported: true}},
        function(err, doc) {});
    });
    res.send('reported');
  };


}
module.exports = thread;