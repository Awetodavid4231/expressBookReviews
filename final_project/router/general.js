const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists. Please choose another" });
    }

    users.push({ username, password });

    return res.status(200).json({ message: "User registered successfully!" });
});


// Task 1: Get all books
public_users.get('/books', (req, res) => {
    return res.status(200).json(books);
});

// Task 2: Get book details based on ISBN
public_users.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get book details based on author
public_users.get('/books/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const results = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === author) {
            results.push({ isbn: key, ...books[key] });
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get book details based on title
public_users.get('/books/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const results = [];

    for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
            results.push({ isbn: key, ...books[key] });
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review
public_users.get('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


// Internal routes for Axios tasks (Tasks 10–13)
public_users.get('/internal/books', (req, res) => {
    return res.status(200).json(books);
});

public_users.get('/internal/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/internal/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const results = [];

    for (let key in books) {
        if (books[key].author.toLowerCase() === author) {
            results.push({ isbn: key, ...books[key] });
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

public_users.get('/internal/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const results = [];

    for (let key in books) {
        if (books[key].title.toLowerCase() === title) {
            results.push({ isbn: key, ...books[key] });
        }
    }

    if (results.length > 0) {
        return res.status(200).json(results);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});


// Task 10: Get all books using Axios
public_users.get('/books/axios', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/internal/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
});

// Task 11: Get book by ISBN using Axios
public_users.get('/books/axios/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`http://localhost:5000/internal/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found", error: error.message });
    }
});

// Task 12: Get books by Author using Axios
public_users.get('/books/axios/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const response = await axios.get(`http://localhost:5000/internal/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Author not found", error: error.message });
    }
});

// Task 13: Get books by Title using Axios
public_users.get('/books/axios/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const response = await axios.get(`http://localhost:5000/internal/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Title not found", error: error.message });
    }
});

module.exports.general = public_users;
