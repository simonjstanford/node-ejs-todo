const mongoose = require("mongoose");
const url = process.env.DB_CONNECTION;

var Schema = mongoose.Schema;

const itemSchema = Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

exports.createItem = function(name) {
  return new Item({name: name});
};

exports.getItems = getItems;

function getItems(defaults, callback) {
  openConnection();
  Item.find().lean().exec(function(err, items) {
    //if the todo list doesn't contain any items then create some defaults
    if (!items || items.length === 0) {
      Item.insertMany(defaults, (err) => getItems(defaults, callback));
    } else {
      callback(items);
      closeConnection(err);
    }
  });
};

exports.addItems = function(items, callback) {
  openConnection();
  if (Array.isArray(items)) {
    console.log("Adding items: ");
    console.log(items);
    Item.insertMany(items, (err) => {
      closeConnection(err);
      callback();
    });
  }
};

function openConnection() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}

function closeConnection(err) {
  if (err) {
    console.log(err)
  }
  mongoose.connection.close();
}
