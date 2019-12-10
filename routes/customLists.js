var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");
const defaults = require(appRoot + "/defaults.js");
const _ = require("lodash");

module.exports.getList = function(req, res) {
    let listName = req.params.customListName;
    let list = persistence.createList(listName, defaults.defaults);
    persistence.addList(list, function(addedList) {
      let todo = {
        name: "To Do",
        items: addedList.items.filter(item => !item.done),
      }
    
      let done = {
        name: "Done",
        items: addedList.items.filter(item => item.done),
      }
      res.render("list", { todoList: todo, doneList:done, postAction: "/lists/" + listName + "/"})
    });
}

module.exports.postNewToDo = function(req, res) {
    let listName = req.params.customListName;
    let newItemName = _.capitalize(req.body.newTodo);
    let newItem = persistence.createItem(newItemName);
    persistence.addItemToList(listName, newItem, function() {
       res.redirect("/lists/" + listName)
    });
}

module.exports.markToDoAsDone = function(req, res) {
    let listName = req.params.customListName;
    let newItemId = req.body.button;
    persistence.markItemInListAsDone(listName, newItemId, () => res.redirect("/lists/" + listName));
}

module.exports.deleteToDo = function(req, res) {
    let listName = req.params.customListName;
    let newItemId = req.body.button;
    persistence.removeItemInList(listName, newItemId, () => res.redirect("/lists/" + listName));
  }