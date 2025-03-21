// get book (read)
const Book = require('../models/Book.js');

const getBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// add book
const addBook = async (req, res) => {
    const { title, author, isbn, description } = req.body;
    try {
        const book = await Book.create({ title, author, isbn, description });
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update book
const updateBook = async (req, res) => {
    const { title, author, isbn, description } = req.body;
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found!'});
        book.title = title || book.title;
        book.author = author || book.author;
        book.isbn = isbn || book.isbn;
        book.description = description || book.description;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// delete book
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found!'});

        await book.remove();
        res.json({ message: 'Book deleted'});

    } catch (error) {
        res.status(500).json({message: error.message });
    }
}

module.exports = { getBooks, addBook, updateBook, deleteBook };