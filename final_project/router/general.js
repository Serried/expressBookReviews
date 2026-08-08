const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!isValid(username)) {
    users.push({ username, password });
    return res.status(200).send("User successfully registered");
  }
});

// Get all books
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5142/');
    res.send(response.data);
  } catch (error) {
    res.send(JSON.stringify(books));
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  Promise.resolve(books[isbn])
    .then(book => res.send(JSON.stringify(book)));
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  const result = await Promise.resolve(
    Object.values(books).filter(book => book.author === author)
  );

  res.send(JSON.stringify(result));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  const result = await Promise.resolve(
    Object.values(books).filter(book => book.title === title)
  );

  res.send(JSON.stringify(result));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;