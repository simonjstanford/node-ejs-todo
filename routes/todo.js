var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");
const defaults = require(appRoot + "/defaults.js");

module.exports.getAllToDo = function(req, res) {
    persistence.getItems(defaults.defaults, (todoItems) => {
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
  }

module.exports.postNewToDo = function(req, res) {
  let newItemName = req.body.newTodo;
  let newItem = persistence.createItem(newItemName);
  persistence.addItems(newItem, () => res.redirect("/"));
}

module.exports.markToDoAsDone = function(req, res) {
  let newItemId = req.body.button;
  persistence.markAsDone(newItemId, () => res.redirect("/"));
}

module.exports.deleteToDo = function(req, res) {
  let newItemId = req.body.button;
  persistence.removeItem(newItemId, () => res.redirect("/"));
}