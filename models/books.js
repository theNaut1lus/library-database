const mongoose = require("mongoose");
const path = require("path");

const coverImageBasePart = 'uploads/bookCovers';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    pageCount: {
        type: Number,
        required: true,
    },
    coverImageName: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    }
});

bookSchema.virtual("coverImagePath").get(function () {
    if (this.coverImageName != null) {
        return path.join("/", coverImageBasePart, this.coverImageName);
    }
});

module.exports = mongoose.model("Book", bookSchema);
module.exports.coverImageBasePart = coverImageBasePart; // Export the base part for use in other files