require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const persistence = require("./persistence.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let item1 = persistence.createItem("Welcome to your todo list!");
let item2 = persistence.createItem("Hit the + button to add a new item.");
let item3 = persistence.createItem("<-- Hit this to mark as done.");
let item4 = persistence.createItem("Hit the bin to delete an item.");
let defaults = [item1, item2, item3, item4];

app.get("/", function(req, res) {
  persistence.getItems(defaults, (todoItems) => {
    let todo = {
      name: "To Do",
      items: todoItems.filter(item => !item.done),
    }

    let done = {
      name: "Done",
      items: todoItems.filter(item => item.done),
    }

    res.render("list", { todoList: todo, doneList: done, postAction: "/"});
  });
});

app.post("/", function(req, res) {
  let newItemName = req.body.newTodo;
  let newItem = persistence.createItem(newItemName);
  persistence.addItems(newItem, () => res.redirect("/"));
});

app.post("/done", function(req, res) {
  let newItemId = req.body.checkbox;
  persistence.markAsDone(newItemId, () => res.redirect("/"));
});

app.post("/delete", function(req, res) {
  let newItemId = req.body.button;
  persistence.removeItem(newItemId, () => res.redirect("/"));
});

app.get("/lists/:customListName", function(req, res) {
  let listName = req.params.customListName;
  let list = persistence.createList(listName, defaults);
  persistence.addList(list, function(addedList) { 
    res.render("list", { todoList: addedList, doneList:undefined, postAction: "/lists/" + listName})
  });
});

app.post("/lists/:customListName", function(req, res) {
  let listName = req.params.customListName;
  let newItemName = req.body.newTodo;  
  let newItem = persistence.createItem(newItemName);
  persistence.addItemToList(listName, newItem, function() {
     res.redirect("/lists/" + listName)
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port " + (process.env.PORT || 3000));
})
