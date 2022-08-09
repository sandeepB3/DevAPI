const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Setting up MongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);


/////Route chaining, targeting All Articles
app.route("/articles")

.get(function(req,res){
  Article.find(function(err,articles){
    if(!err){
      res.send(articles);
    }
    else{
      res.send(err);
    }

  });
})

.post(function(req,res){
  const entry = new Article({
    title: req.body.title,
    content: req.body.cont
  });
  entry.save(function(err){
    if(!err){
      res.send("POST request complete to API");
    }
    else{
      res.send(err);
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("Deleted all articles");
    }
    else{
      res.send(err);
    }
  });
});


/////Route chaining, targeting Specific Articles

app.route("/articles/:specific")

.get(function(req,res){
  const title = req.params.specific;
  Article.findOne({title: title}, function(err,docs){
    if(!err){
      res.send(docs);
    }
    else{
      res.send(err);
    }
  });
})

.put(function(req,res){
  Article.updateOne(
    {title: req.params.specific},
    {title: req.body.title, content: req.body.cont},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Updated WikiDB");
      }
    }
  );
})

.patch(function(req,res){
  Article.updateOne(
    {title: req.params.specific},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Updated WikiDB");
      }
    }
  );
})

.delete(function(req,res){
  Article.deleteOne({title: req.params.specific}, function(err){
    if(!err){
      res.send("Deleted");
    }
  });
});


app.listen(3000, function(){
  console.log("Server Up and Running at port 3000");
});
