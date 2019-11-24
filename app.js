require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const persistence = require("./persistence.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let workTodoItems = [];

let item1 = persistence.createItem("Welcome to your todo list!");
let item2 = persistence.createItem("Hit the + button to add a new item.");
let item3 = persistence.createItem("<-- Hit this to delete an item.");
let defaults = [item1, item2, item3];

app.get("/", function(req, res) {
  persistence.getItems(defaults, (todoItems) => {
    let today = new Date();
    let currentDay = date.getDate();
    res.render("list", { listTitle: currentDay, items: todoItems, postAction: "/"});
  });
});

app.post("/", function(req, res) {
  let newItemName = req.body.newTodo;
  let newItem = persistence.createItem(newItemName);
  persistence.addItems(newItem, () => res.redirect("/"));
});

app.post("/delete", function(req, res) {
  let newItemId = req.body.button;
  persistence.removeItem(newItemId, () => res.redirect("/"));
});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work List", items: workTodoItems, postAction: "work"});
});

app.post("/work", function(req, res) {
  let newItem = req.body.newTodo;
  workTodoItems.push(newItem);
  res.redirect("/work");
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port " + (process.env.PORT || 3000));
})
