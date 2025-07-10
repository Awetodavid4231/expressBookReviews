const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable sessions for /customer routes
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Middleware to protect authenticated customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session && req.session.authorization) {
    const token = req.session.authorization['accessToken'];

    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user; // Attach user info to request
        next(); // Move to next middleware or route
      } else {
        return res.status(403).json({ message: "Invalid Token" });
      }
    });
  } else {
    return res.status(401).json({ message: "User not logged in" });
  }
});

const PORT = 5000;

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
