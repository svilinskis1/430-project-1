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

  for (let i = 0; i < books.length; i++) {
    if (request.query.title === books[i].title) {
      JSONresponse = books[i];
    }
  }

  return respondJSON(request, response, 200, JSONresponse);
};

// getGenre - returns every book with the genre
const getGenre = (request, response) => {
  let JSONresponse = {};

  for (let i = 0; i < books.length; i++) {
    for (let j = 0; j < books[i].genres; j++) {
      if (request.query.genre === books[i].genres[j]) {
        JSONresponse += books[i];
      }
    }
  }

  if (JSONresponse === '') {
    JSONresponse = {
      message: 'There are no books with this genre!',
    };
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

  if (!request.query.title || !request.query.review) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  const userTitle = request.query.title;
  const userReview = request.query.review;

  // send an error if the book doesnt exist
  if (!books[userTitle]) {
    responseCode = 400;
    responseJSON.message = 'Title not Found';
  }

  books[userTitle].review = userReview;

  responseJSON.message = 'Review Updated';

  return respondJSON(request, response, responseCode, responseJSON);
};

// addBook - allows user to add a new book to the api
// NEEDS FIXING
const addBook = (request, response) => {
  const responseJSON = {
    message: 'title is required.',
  };

  if (!request.query.title) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  const userTitle = request.query.title;

  // if the book doesnt already exist make it
  if (!books[userTitle]) {
    responseCode = 201;
    books[userTitle] = {
      userTitle,
    };
  }

  // update all the fields
  books[userTitle].author = request.query.author;
  books[userTitle].country = request.query.country;
  books[userTitle].link = request.query.link;
  books[userTitle].pages = request.query.pages;
  books[userTitle].year = request.query.year;
  books[userTitle].genre = request.query.genre;

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
