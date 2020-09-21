const express= require("express");

const bodyParser= require("body-parser");


const app= express();

var items=["Folder 1", "Folder 2", "Folder3"];

app.use(bodyParser.urlencoded({extended : true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res){
    res.render("folderList", { newFolderItems: items});
})

app.post("/", function(req, res){
    let item= req.body.newFolder;
    items.push(item);
    res.redirect("/");
})



app.listen("3000", function(){
  console.log("Server running on port 3000");
})
