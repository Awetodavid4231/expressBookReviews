const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // In-memory user list

// Check if a username is unique (for registration)
const isValid = (username) => {
  return users.every((user) => user.username !== username);
};

// Check if user credentials are valid (for login)
const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

// Task 7: Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

    // Store token and user info in session
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Task 8: Add or modify a review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  book.reviews[username] = review; // Add/update review by username

  return res.status(200).json({ message: "Review added/updated successfully." });
});

// Task 9: Delete a user's own review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(403).json({ message: "You haven't posted a review for this book." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
