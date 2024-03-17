var express = require("express");
var mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
var app = express();
var cors = require("cors");
app.use(cors());
const client = new MongoClient("mongodb://localhost:27017/book");
app.use(express.json());

//****************************mmongodb get api**************************//
app.get("/bookfrom", async (req, res) => {
  await client.connect(); //connect the mongodb
  const database = client.db("book");
  const bookslist = database.collection("bookslist"); //collection name
  let list = await bookslist.find().toArray(); //gets the data from the collection and print in the console
  res.json(list);
  // console.log(req['query']['name']);
  res.end("this is get method");
});

//**********************mongodb post api***************************//

app.post("/booklist", async (req, res) => {
  let body = req["body"];
  await client.connect(); //connect the mongodb
  const database = client.db("book");
  const bookslist = database.collection("bookslist"); //collection name
  let data = {
    bookname: body["bookname"],
    price: body["price"],
    author: body["author"],
    publisher: body["publisher"],
    address: body["address"],
  };

  await bookslist.insertOne(data);
  res.json({ message: "data is inserted!!" });
  res.end();
});

//*******************************mongoose api post************************************************ */

app.post("/create_booklist", async (req, res) => {
  let body = req["body"]; //receive the data from request body
  await mongoose.connect("mongodb://localhost:27017/book");
  const BookModel = mongoose.model("listOfbooks", {
    bookname: String,
    price: Number,
    author: String,
    publisher: String,
    address: String,
  });
  let listOfbooks = new BookModel({
    bookname: body["bookname"],
    price: body["price"],
    author: body["author"],
    publisher: body["publisher"],
    address: body["address"],
  });
  await listOfbooks.save();
  res.json({ message: "listofbooks data is inserted" });
  res.end();
});

//*******************************mongoose api get************************************************ */

app.get("/list_books", async (req, res) => {
  await mongoose.connect("mongodb://localhost:27017/book");
  const BookModel = mongoose.model("listOfbooks", {
    bookname: String,
    price: Number,
    author: String,
    publisher: String,
    address: String,
  });
  let data = await BookModel.find();
  res.json(data);
  res.end();
});

//http://localhost:8080

//starting server
app.listen(8080, () => {
  console.log("server started");
});
