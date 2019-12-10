require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", routes.todo.getAllToDo);
app.post("/", routes.todo.postNewToDo);
app.post("/done", routes.todo.markToDoAsDone);
app.post("/delete", routes.todo.deleteToDo);

app.get("/lists/:customListName", routes.customLists.getList);
app.post("/lists/:customListName", routes.customLists.postNewToDo);
app.post("/lists/:customListName/done", routes.customLists.markToDoAsDone);
app.post("/lists/:customListName/delete", routes.customLists.deleteToDo);

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port " + (process.env.PORT || 3000));
})
