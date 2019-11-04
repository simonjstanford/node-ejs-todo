const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let todoItems = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", function(req, res) {
  let today = new Date();
  let currentDay = getDayName();
  res.render("list", { day: currentDay, items: todoItems});
});

app.post("/", function(req, res) {
  let newItem = req.body.newTodo;
  todoItems.push(newItem);
  res.redirect("/");
});

function getDayName() {
  let date = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  return date.toLocaleDateString("en-GB", options);
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
})
