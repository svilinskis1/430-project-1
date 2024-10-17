const fs = require('fs');
// pull in the file system module
const books = JSON.parse(fs.readFileSync(`${__dirname}/../data/books.json`, 'utf8'));

// send a response
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);

  // send the response
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  // we dont want to send the body if its a head request
  if (request.method !== 'HEAD') {
    response.write(content);
  }
  response.end();
};

// getTitle - returns a single book with matching title
const getTitle = (request, response) => {
  let JSONresponse = {
    message: 'Title not found!',
  };

  const foundBook = books.find((book) => book.title === request.query.title);
  if (foundBook) {
    JSONresponse = foundBook;
  }

  return respondJSON(request, response, 200, JSONresponse);
};

// getGenre - returns every book with the genre
const getGenre = (request, response) => {
  let JSONresponse = {
    message: 'There are no books with that genre!',
  };

  //this crashes? 
  const foundBooks = books.filter((book) => book.genres.includes(request.query.genre));
  if (foundBooks.length > 0) {
    JSONresponse = foundBooks;
  }

  return respondJSON(request, response, 200, JSONresponse);
};

// getRandom - returns a random book
const getRandom = (request, response) => {
  // get a random index within the book object
  const book = Math.floor(Math.random() * books.length);

  // return it
  const JSONresponse = books[book];

  return respondJSON(request, response, 200, JSONresponse);
};

// getBooks - returns all books
const getBooks = (request, response) => {
  const JSONresponse = books;

  return respondJSON(request, response, 200, JSONresponse);
};

// reviewBook - post. allows user to write a review
// NEEDS FIXING
const reviewBook = (request, response) => {
  const responseJSON = {
    message: 'title and review are both required.',
  };

  const { title, review } = request.query;

  if (!title || !review) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  bookIndex = books.findIndex((book) => book.title === title);

  // send an error if the book doesnt exist
  if (bookIndex < 0) {
    responseCode = 400;
    responseJSON.message = 'Title not Found';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  
  books[bookIndex].review = review;

  responseJSON.message = 'Review Updated';

  return respondJSON(request, response, responseCode, responseJSON);
};

// addBook - allows user to add a new book to the api
const addBook = (request, response) => {
  const responseJSON = {
    message: 'title is required.',
  };

  const { title, author, country, link, pages, year, genre } = request.query;

  if (!title) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  bookIndex = books.findIndex((book) => book.title === title);

  // if the book doesnt already exist make it
  if (bookIndex < 0) {
    responseCode = 201;
    books[books.length] = {
      title : title
    };
  }

  bookIndex = books.findIndex((book) => book.title === title);

  // update all the fields
  books[bookIndex].author = request.query.author;
  books[bookIndex].country = request.query.country;
  books[bookIndex].link = request.query.link;
  books[bookIndex].pages = request.query.pages;
  books[bookIndex].year = request.query.year;
  books[bookIndex].genre = request.query.genre;

  responseJSON.message = 'Book Updated';

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

const notFound = (request, response) => {
  const JSONresponse = {
    message: 'The page you are looking for was not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, JSONresponse);
};

module.exports = {
  getTitle,
  getGenre,
  getRandom,
  getBooks,
  reviewBook,
  addBook,
  notFound,
};
