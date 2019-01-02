var MongoClient = require('mongodb');
const CONNECTION_STRING = process.env.MONGOLAB_URI; 
var ObjectId = require('mongodb').ObjectId;


function reply(){
  
this.newReply = function(req,res){
  var board = req.params.board;
  var reply = {
    _id: new ObjectId(),
    text: req.body.text,
    created_on: new Date(),
    bumped_on: new Date(),
    reported: false,
    delete_password: req.body.delete_password, 
  }
    MongoClient.connect(CONNECTION_STRING, function(err, db) {
            var collection = db.collection('thread');
             collection.findAndModify({_id: new ObjectId(req.body.thread_id)},[],{$set: {bumped_on: new Date()},$push: {replies: reply } },
        function(err, result) {
               if (err) throw console.log('Database insert err: '+err);
               console.log('reply new')
        });
    });
    res.redirect('/b/'+board+'/'+req.body.thread_id);
 }

this.fetchReply= function(req,res){
 var board = req.params.board;
  MongoClient.connect(CONNECTION_STRING, function(err, db) {
            var collection = db.collection('thread');
              collection.find({_id: new ObjectId(req.query.thread_id)},{reported: false,delete_password: false, "replies.delete_password": false,"replies.reported": false}).toArray(function(err,result){
                 if (err) throw console.log('Database insert err: '+err);
                console.log(result[0]);
                 res.json(result[0]);
          });
      })

}

this.deleteReply = function(req,res){
  var board = req.params.board;
   MongoClient.connect(CONNECTION_STRING, function(err, db) {
            var collection = db.collection('thread');
             collection.findAndModify(
        {
          _id: new ObjectId(req.body.thread_id),
          replies: { $elemMatch: { _id: new ObjectId(req.body.reply_id), delete_password: req.body.delete_password } },
        },
        [],
        { $set: { "replies.$.text": "[deleted]" } },
        function(err, doc) {
          if (doc.value === null) {
            res.send('incorrect password');
          } else {
            res.send('success');
          }
        });
    });
}


this.reportReply = function(req, res) {
    var board = req.params.board;
    MongoClient.connect(CONNECTION_STRING,function(err,db) {
      var collection = db.collection(board);
      collection.findAndModify({_id: new ObjectId(req.body.thread_id),"replies._id": new ObjectId(req.body.reply_id)},{ $set: { "replies.$.reported": true } },
        function(err, doc) {
        });
    });
    res.send('reported');
  };

}
module.exports = reply;