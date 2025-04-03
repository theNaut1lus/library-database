//we will set up our routes here

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const Book = require("../models/books");
const Author = require("../models/authors");
const books = require("../models/books");
const { search } = require("./authors");

const uploadPath = path.join("public", Book.coverImageBasePart); //this is the path where we will save the cover images
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        //check if the file is an image or not
        callback(null, imageMimeTypes.includes(file.mimetype));
    },
})

//all books route
router.get("/", async (req, res) => {
    let query = Book.find();
    if (req.query.title != null && req.query.title !== "") {
        query = query.regex("title", new RegExp(req.query.title, "i")); //case insensitive search
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore !== "") {
        query = query.lte("publishDate", req.query.publishedBefore); //less than or equal to
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter !== "") {
        query = query.gte("publishDate", req.query.publishedAfter); //greater than or equal to
    }
    try {
        const books = await query.exec(); //exec will execute the query and return the result
        res.render("books/index", {
            books: books,
            searchOptions: req.query,
        });
    } catch (error) {
        res.redirect("/");
    }
});

// New route for books
router.get("/new", async (req, res) => {
    renderNewPage(res, new Book());
});

//create books route
router.post("/", upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null; //if the file is not null then get the filename else set it to null

    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
        coverImageName: fileName,
    })

    try {
        const newBook = await book.save();
        console.log("Book created successfully:", newBook);
        // res.redirect(`/book/${newBook.id}`);
        res.redirect("/books");
    } catch (error) {
        console.log(error);
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName); //remove the cover image if there is an error
        }
        renderNewPage(res, book, true); //pass true to renderNewPage to show error message
    }


});

//remove the cover image if there is an error
function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), (err) => {
        if (err) {
            console.error("Error removing cover image:", err);
        } else {
            console.log("Cover image removed successfully:", fileName);
        }
    });
}

async function renderNewPage(res, book, hasError = false) {
    try {
        //get all the authors first
        const authors = await Author.find({});
        const params = {
            authors: authors,
            book: book,
        }
        if (hasError) {
            params.errorMessage = "Error creating Book";
        }
        res.render("books/new", params);
    } catch (error) {
        res.status(500).send("Error retrieving books: " + error.message);
        res.redirect("/books");

    }

}

module.exports = router;