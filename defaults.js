var appRoot = require('app-root-path');
const persistence = require(appRoot + "/persistence.js");

let item1 = persistence.createItem("Welcome to your todo list!");
let item2 = persistence.createItem("Hit the + button to add a new item.");
let item3 = persistence.createItem("<-- Hit this to mark as done.");
let item4 = persistence.createItem("Hit the bin to delete an item.");
let defaults = [item1, item2, item3, item4];

module.exports.defaults = defaults;
