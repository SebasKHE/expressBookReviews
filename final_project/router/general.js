const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  if (books) {
    res.send(JSON.stringify(books));
  } else {
  return res.status(403).json({message: "Error getting the books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  if (books[ISBN]) {
    let book = books[ISBN];
    res.send(JSON.stringify(book));
  } else{
  return res.status(404).json({message: "Book not Found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    // Convertimos 'books' en un array de valores para poder filtrarlo
    let filtered_books = [];

    Object.keys(books).forEach(key => {
        if (books[key].author === author) {
            filtered_books.push(books[key]);
        }
    });

    if (filtered_books.length > 0) {
        res.send(JSON.stringify(filtered_books));  // Enviar la respuesta como JSON
    } else {
        return res.status(404).json({ message: "Author not found" });
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  let filtered_books = [];
  
  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
        filtered_books.push(books[key]);
    } 
});

if (filtered_books.length > 0) {
    res.send(JSON.stringify(filtered_books));
} else {
return res.status(404).json({message: "Book not found"});
}
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  if (books[ISBN]) {
    res.send(JSON.stringify(books[ISBN].reviews));
  } else {
  return res.status(404).json({message: "Book not found"});
}
});

module.exports.general = public_users;
