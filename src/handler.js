const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertAt = new Date().toISOString();
    const updatedAt = insertAt;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
}