// array that holds all the users
const users = {};

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
  const JSONresponse = {
    users,
  };

  return respondJSON(request, response, 200, JSONresponse);
};

// getGenre - returns every book with the genre
const getGenre = (request, response) => {
  const JSONresponse = {
    users,
  };

  return respondJSON(request, response, 200, JSONresponse);
};

// getRandom - returns a random book
const getRandom = (request, response) => {
  const JSONresponse = {
    users,
  };

  return respondJSON(request, response, 200, JSONresponse);
};

// getBook - returns a book matching provided fields
const getBook = (request, response) => {
  const JSONresponse = {
    users,
  };

  return respondJSON(request, response, 200, JSONresponse);
};

// reviewBook - post. allows user to write a review
const reviewBook = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // this line of code crashed for me, even though it worked
  // in the demo. i added a placeholder for now
  // const { name, age } = request.body;

  const { name, age } = { name: 'baby', age: '0' };

  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  users[name].age = age;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSON(request, response, responseCode, {});
};

// addBook - allows user to add a new book to the api
const addBook = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  // this line of code crashed for me, even though it worked
  // in the demo. i added a placeholder for now
  // const { name, age } = request.body;

  const { name, age } = { name: 'baby', age: '0' };

  if (!name || !age) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 204;

  if (!users[name]) {
    responseCode = 201;
    users[name] = {
      name,
    };
  }

  users[name].age = age;

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
  getBook,
  reviewBook,
  addBook,
  notFound,
};
