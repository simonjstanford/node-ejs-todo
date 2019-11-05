const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let todoItems = ["Buy Food", "Cook Food", "Eat Food"];
let workTodoItems = [];

app.get("/", function(req, res) {
  let today = new Date();
  let currentDay = date.getDate();
  res.render("list", { listTitle: currentDay, items: todoItems, postAction: "/"});
});

app.post("/", function(req, res) {
  let newItem = req.body.newTodo;
  todoItems.push(newItem);
  res.redirect("/");
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

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
