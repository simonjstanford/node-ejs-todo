const mongoose = require("mongoose");
const url = process.env.DB_CONNECTION;

var Schema = mongoose.Schema;

const itemSchema = Schema({
  name: String,
  done: Boolean
});

const listSchema = Schema({
  name: String,
  items: [itemSchema]
});

const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List", listSchema);

exports.createItem = function(name) {
  return new Item({name: name});
};

exports.createList = function(name, items) {
  return new List({name: name, items: items});
};

exports.getItems = getItems;

function getItems(defaults, callback) {
  openConnection();
  Item.find().lean().exec(function(err, items) {
    //if the todo list doesn't contain any items then create some defaults
    if (!items || items.length === 0) {
      Item.insertMany(defaults, (err) => getItems(defaults, callback));
    } else {
      if (err) {
        console.log(err)
      }
      mongoose.connection.close(() => callback(items));
    }
  });
};

exports.addItems = function(items, callback) {
  openConnection();
  console.log("Adding items: ");
  console.log(items);

  if (Array.isArray(items)) {
    Item.insertMany(items, (err) => {
      if (err) {
        console.log(err)
      }
      mongoose.connection.close(() => callback());
    });
  } else {
    items.save((err) => {
      if (err) {
        console.log(err)
      }
      mongoose.connection.close(() => callback());
    });
  }
};

function getItems(defaults, callback) {
  openConnection();
  Item.find().lean().exec(function(err, items) {
    //if the todo list doesn't contain any items then create some defaults
    if (!items || items.length === 0) {
      Item.insertMany(defaults, (err) => getItems(defaults, callback));
    } else {
      if (err) {
        console.log(err)
      }
      mongoose.connection.close(() => callback(items));
    }
  });
};

exports.markAsDone = function(itemId, callback) {
  openConnection();
  console.log("Marking item as done: " + itemId);

  Item.findOneAndUpdate({_id: itemId}, {done: true}, {useFindAndModifyOption: false}, (err) => {
    if (err) {
      console.log(err)
    }
    mongoose.connection.close(() => callback());
  });
};

exports.markItemInListAsDone = function(listName, itemId, callback) {
  openConnection();
  List.findOneAndUpdate({name: listName, "items._id" : itemId}, {"items.$.done" : true}, {useFindAndModifyOption: false}, function(err) {
    if (err) {
      console.log(err)
    }
    mongoose.connection.close(() => callback());
  });
};

exports.removeItem = function(itemId, callback) {
  openConnection();
  console.log("Removing item: ");
  console.log(itemId);

  Item.findByIdAndRemove(itemId, (err) => {
    if (err) {
      console.log(err)
    }
    mongoose.connection.close(() => callback());
  });
};

exports.removeItemInList = function(listName, itemId, callback) {
  openConnection();
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemId}}}, {useFindAndModifyOption: false}, function(err) {
    if (err) {
      console.log(err)
    }
    mongoose.connection.close(() => callback());
  });
};

exports.removeItemInList = function(listName, itemId, callback) {
  openConnection();
  List.findOne({name: listName}, function(err, foundList) {
    if (err) {
      console.log(err);
      mongoose.connection.close(() => callback());
    } else if (foundList && itemId) {
      foundList.items.pull(itemId);
      foundList.save(function() {
        mongoose.connection.close(() => callback());
      });
    }
  });
};

exports.addList = function(list, callback) {
  openConnection();

  List.findOne({name: list.name}).lean().exec(function(err, foundList) {
    if (err) {
      console.log(err);
      mongoose.connection.close(() => callback());
    } else {
      if (!foundList) {
        console.log("Can't find the list, adding it: " + list.name)
        list.save((err) => {
          mongoose.connection.close(() => callback(list));
        });
      } else {
        console.log("List found: " + foundList.name)
        mongoose.connection.close(() => callback(foundList));
      }
    }
  });
};

exports.addItemToList = function(listName, newItem, callback) {
  openConnection();
  List.findOne({name: listName}, function(err, foundList) {
    if (err) {
      console.log(err);
      mongoose.connection.close(() => callback());
    } else if (foundList && newItem) {
      foundList.items.push(newItem);
      foundList.save(function() {
        mongoose.connection.close(() => callback());
      });
    }
  });
};

function openConnection() {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
}
