//packages required
const express= require("express");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");


const app= express();

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{useUnifiedTopology :true,useNewUrlParser:true});
const itemSchema=new mongoose.Schema({
  itemname:String,
  itemcount:Number,
  itemprice:Number,
});

const Item=mongoose.model("Item",itemSchema);

const categorySchema=new mongoose.Schema({
  categoryname:String,
  itemList:[itemSchema],
});
const Category=mongoose.model("Category",categorySchema);

const userSchema=new mongoose.Schema({
  username:String,
  password:String,
  categoryList:[categorySchema],
});

const User=mongoose.model("User",userSchema);

const defaultItem1=new Item({
  itemname:"Item 1",
  itemcount: 2,
  itemprice: 5,
});
defaultItem1.save();
const defaultItem2=new Item({
  itemname:"Item 2",
  itemcount: 2,
  itemprice: 5,
});
defaultItem2.save();

var defaultItems=[defaultItem1,defaultItem2];

const defaultCategory1=new Category({
  categoryname:"Category 1",
  itemList:defaultItems,
});
const defaultCategory2=new Category({
  categoryname:"Category 2",
  itemList:defaultItems,
});


var defaultCategories=[defaultCategory1,defaultCategory2];


app.get("/", function(req, res){
    res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
})

app.get("/register",function(req,res){
  res.render("register");
})


var username="";
var password="";
app.get("/folderList",function(req,res){

  User.findOne({username:username},function(err,foundUser){
    if(!err){
        res.render("folderList", {newFolderItems : foundUser.categoryList, Username : foundUser.username});
    }

  });

});

app.post("/register",function(req,res){
   username=req.body.username;
   password=req.body.password;

  User.findOne({username:username},function(err,foundUser){
    if(!err){
      if(!foundUser){
         newUser=new User({
          username:username,
          password:password,
          categoryList:[],
        });

        newUser.save(function(err){
          if(err){
            console.log("Cannot Register.");
          }
          else{
            res.redirect("/folderList");
          }
        });
      }
      else{
        coonsole.log("Username already exists.");
      }
    }
  });


})


app.post("/login", function(req, res){
   username=req.body.username;
   password=req.body.password;

  User.findOne({username:username},function(err,foundUser){
    if(!err){
    if(foundUser){
      if(foundUser.password===password)
          res.redirect("/folderList");
      else
      console.log("Password mismatch!!!");
    }
    else{
      console.log("User not found");
    }
  }

  });
});

app.post("/folderList",function(req,res){
  const categoryname=req.body.newFolder;
  const newCategory=new Category({
    categoryname:categoryname,
    itemList:[],
  });
  newCategory.save();

  User.findOne({username:username},function(err,foundUser){
    if(!err){
    if(foundUser){
      foundUser.categoryList.push(newCategory);
      foundUser.save();
      res.redirect("/folderList");
    }
    else{
      console.log("User not found");
    }
  }

  });



});

app.post("/folderList/delete",function(req,res){
  const categoryId=req.body.button;
  console.log(categoryId);
 Category.findByIdAndRemove(categoryId,function(err){
        if(!err){
          res.redirect("/folderList");
        }

  });
})


app.listen("3000", function(){
  console.log("Server running on port 3000");
})
