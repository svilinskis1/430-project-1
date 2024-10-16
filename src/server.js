const http = require('http'); // http module
const htmlHandler = require('./htmlResponses.js');
const responseHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/bookshelf.png': htmlHandler.getBackground,
  '/docs': htmlHandler.getDocs,
  '/getTitle': responseHandler.getTitle,
  '/getGenre': responseHandler.getGenre,
  '/getRandom': responseHandler.getRandom,
  '/getBooks': responseHandler.getBooks,
  '/reviewBook': responseHandler.reviewBook,
  '/addBook': responseHandler.addBook,
  notFound: responseHandler.notFound,
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  request.query = Object.fromEntries(parsedUrl.searchParams);

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response);
  } else {
    urlStruct.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
