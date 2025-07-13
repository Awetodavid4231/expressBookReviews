const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Username and password are required" });

  const userExists = users.some((user) => user.username === username);
  if (userExists) return res.status(409).json({ message: "Username already exists" });

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get all books
public_users.get("/books", (req, res) => res.status(200).json(books));

// Task 2: Get book by ISBN
public_users.get("/books/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

// Task 3: Get books by Author
public_users.get("/books/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const results = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author) results.push({ isbn: key, ...books[key] });
  }
  results.length ? res.json(results) : res.status(404).json({ message: "No books by this author" });
});

// Task 4: Get books by Title
public_users.get("/books/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const results = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title) results.push({ isbn: key, ...books[key] });
  }
  results.length ? res.json(results) : res.status(404).json({ message: "No books with this title" });
});

// Task 5: Get book reviews
public_users.get("/books/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book.reviews) : res.status(404).json({ message: "Book not found" });
});

// Internal Routes for Axios
public_users.get("/internal/books", (req, res) => res.json(books));
public_users.get("/internal/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});
public_users.get("/internal/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const results = [];
  for (let key in books) {
    if (books[key].author.toLowerCase() === author) results.push({ isbn: key, ...books[key] });
  }
  results.length ? res.json(results) : res.status(404).json({ message: "No books by this author" });
});
public_users.get("/internal/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const results = [];
  for (let key in books) {
    if (books[key].title.toLowerCase() === title) results.push({ isbn: key, ...books[key] });
  }
  results.length ? res.json(results) : res.status(404).json({ message: "No books with this title" });
});

// Task 10–13 using Axios
const BASE_URL = "https://awetoegbarog-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";

public_users.get("/books/axios", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/books`);
    res.json(response.data);
  } catch (e) {
    res.status(500).json({ message: "Failed to fetch books", error: e.message });
  }
});
public_users.get("/books/axios/isbn/:isbn", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/isbn/${req.params.isbn}`);
    res.json(response.data);
  } catch (e) {
    res.status(404).json({ message: "Book not found", error: e.message });
  }
});
public_users.get("/books/axios/author/:author", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/author/${req.params.author}`);
    res.json(response.data);
  } catch (e) {
    res.status(404).json({ message: "Author not found", error: e.message });
  }
});
public_users.get("/books/axios/title/:title", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/internal/title/${req.params.title}`);
    res.json(response.data);
  } catch (e) {
    res.status(404).json({ message: "Title not found", error: e.message });
  }
});

module.exports.general = public_users;
