//we will set up our routes here

const express = require("express");
const router = express.Router();
const Book = require("../models/books");
const Author = require("../models/authors");

router.get("/", async (req, res) => {
    let books;
    try {
        books = await Book.find().sort({ createdAt: "desc" }).limit(10).exec(); //get the last 10 books sorted by createdAt in descending order
    } catch (error) {
        books = [];

    }
    res.render("index", { books: books });
});

module.exports = router;