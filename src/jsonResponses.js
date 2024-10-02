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

// getusers- send back the users
const getUsers = (request, response) => {
  const JSONresponse = {
    users,
  };

  return respondJSON(request, response, 200, JSONresponse);
};

// post
const addUser = (request, response) => {
  const responseJSON = {
    message: 'Name and age are both required.',
  };

  //this line of code crashed for me, even though it worked 
  //in the demo. i added a placeholder for now
  //const { name, age } = request.body;

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
  getUsers,
  addUser,
  notFound,
};
