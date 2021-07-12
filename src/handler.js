const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = false;

    const newBook = {
        name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt,
    };

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    } 
    
    if (name !== undefined) {
        if (pageCount >= readPage) {
            books.push(newBook);
    
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id,
                }
            });
            response.code(201);
            return response;
        } else {
            const response = h.response({
                status: 'fail',
                message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
            });
            response.code(400);
            return response;
        }
    }
    
    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
}

const getAllBooksHandler = (request, h) => {
    const paramRead = request.query.reading;
    const paramFinish = request.query.finished;
    const paramName = request.query.name;

    const reading = books.filter((n) => n.reading == true);
    const unread = books.filter((n) => n.reading == false);
    const finished = books.filter((n) => n.pageCount == n.readPage);
    const unfinished = books.filter((n) => n.pageCount != n.readPage);
    const checkName = books.filter((n) => n.name.toLowerCase().includes('dicoding'));

    if (paramRead == '1') {
        const response = h.response({
            status: 'success',
            data: {
                books: reading.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    } 
    
    if (paramRead == '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: unread.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    } 
    
    if (paramFinish == '1') { 
        const response = h.response({
            status: 'success',
            data: {
                books: finished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    } 
    
    if (paramFinish == '0') {
        const response = h.response({
            status: 'success',
            data: {
                books: unfinished.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    if (paramName == 'Dicoding') {
        const response = h.response({
            status: 'success',
            data: {
                books: checkName.map((book) => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher,
                })),
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
}

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const index = books.findIndex((book) => book.id === id);
    const book = books.filter((n) => n.id === id)[0];

    if (!book) {
        const response = h.response({ 
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        });
        response.code(404);
        return response;
    } else {
        if (name !== undefined) {
            if (pageCount > readPage) {
                if (index !== -1) {
                    books[index] = {
                        ...books[index],
                        name,
                        year,
                        author,
                        summary,
                        publisher, 
                        pageCount,
                        readPage,
                        reading,
                        insertedAt,
                        updatedAt,
                    };
            
                    const response = h.response({
                        status: 'success',
                        message: 'Buku berhasil diperbarui',
                    });
                    response.code(200);
                    return response
                }
            } else {
                const response = h.response({
                    status: 'fail',
                    message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
                });
                response.code(400);
                return response;
            }
        }
    }

    if (name === undefined) {
        const response = h.response({
            status: 'fail', 
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
    }
}

const deleteBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];

    if(book !== undefined) {
        books.splice(id);

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
}

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler };