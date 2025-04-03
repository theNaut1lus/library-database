//we will set up our routes here

const express = require("express");
const router = express.Router();
const Author = require("../models/authors");

//all authors route
router.get("/", async (req, res) => {
    let searchOptions = {};
    //get request so we need query not body
    if (req.query.name != null && req.query.name !== "") {
        searchOptions.name = new RegExp(req.query.name, "i"); //case insensitive search
    }
    try {
        const authors = await Author.find(searchOptions);
        res.render("authors/index", {
            authors: authors,
            searchOptions: req.query
        });
    } catch (error) {
        res.status(500).send("Error retrieving authors: " + error.message);
        res.redirect("/");
    }
});

// New route for authors
router.get("/new", (req, res) => {
    res.render("authors/new", { author: new Author() });
});

//create authors route
router.post("/", async (req, res) => {
    const author = new Author({
        name: req.body.name,
    });
    try {
        const newAuthor = await author.save();
        console.log("Author created successfully:", newAuthor);
        // res.redirect(`/authors/${newAuthor.id}`);
        res.redirect("/authors");
    }
    catch (error) {
        console.log(error);
        res.render("authors/new", { author: author, errorMessage: "Error creating Author" });
    }
});

module.exports = router;