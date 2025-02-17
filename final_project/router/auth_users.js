const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username, password)=>{ //returns boolean
//write code to check is the username is valid
    const validusers = users.find((user) => user.username === username && user.password === password);
    return validusers !== undefined;
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return isValid(username, password)
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {
        accessToken, username
    };

    return res.status(200).send('User successfully logged in');
  } else {
    return res.status(401).json({message: "Invalid Login. Check username and password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const ISBN = req.params.isbn;
  const newReview = req.query.review;
  const username = req.session.authorization ? req.session.authorization.username : null;
  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  // Resto de tu código para agregar/modificar la reseña
  if (books[ISBN] && newReview) {
    if (!books[ISBN].reviews) {
      books[ISBN].reviews = {};
    }

    if (books[ISBN].reviews[username]) {
      books[ISBN].reviews[username] = newReview;
      return res.status(200).send('Review modified successfully');
    } else {
      books[ISBN].reviews[username] = newReview;
      return res.status(200).send('Review added successfully');
    }
  } else {
    return res.status(400).json({ message: "Book not found or review not provided" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const ISBN = req.params.isbn;
    const username = req.session.authorization ? req.session.authorization.username : null;

    if (!username) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    if (!books[ISBN]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (books[ISBN].reviews && books[ISBN].reviews[username]) {
        delete books[ISBN].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
    } else {
        return res.status(404).json({ message: "No review found for this username and book" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
