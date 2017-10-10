
var express = require('express');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

var path = require('path');

app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));

app.set('view engine', 'ejs');

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/message_board');

var Schema = mongoose.Schema;

var PostSchema = new mongoose.Schema({
    name: String,
    text: { type: String, required: true }, 
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
    }, { timestamps: true });

mongoose.model('Post', PostSchema); 
var Post = mongoose.model('Post') 


var CommentSchema = new mongoose.Schema({
    name: String,
    _post: {type: Schema.Types.ObjectId, ref: 'Post'},
    text: { type: String, required: true },
    }, {timestamps: true });


mongoose.model('Comment', PostSchema); 
var Comment = mongoose.model('Comment')





app.get('/', function(req, res) {

    Post.find({}).populate('comments').exec(function(err, post) {
        console.log(post)   

        res.render('index', {posted: post});

    })
})

app.post('/process', function(req, res) {
    console.log("POST DATA", req.body);

    var postInstance = new Post()
    postInstance.name = req.body.name
    postInstance.text = req.body.text
    postInstance.save(function(err){

    })

    res.redirect('/');
})

app.post('/post/:id', function (req, res){
Post.findOne({_id: req.params.id}, function(err, post){

    var comment = new Comment(req.body);
    comment.name = req.body.name
    //  set the reference like this:
    comment._post = req.body.text
    // now save both to the DB
    comment.save(function(err){
            post.comments.push(comment);
            post.save(function(err){
                 if(err) {
                      console.log('Error');
                 } else {
                      res.redirect('/');
                 }
             });
     });
});
});


app.listen(8000, function() {
    console.log("listening on port 8000");
})










