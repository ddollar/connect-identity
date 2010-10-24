# connect-identity

  Creates a persistent identity for a visitor.

## Installation

    $ npm install connect-identity
    
## Usage

    var identity = require('connect-identity');

    var app = express.createServer(
      identity({ cookie: 'some_cookie_name' })
    )

    app.get('/', function(request, response) {
      console.log(request.identity);
    })

## Thanks

  Borrows heavily from [connect-sessions](http://github.com/caolan/cookie-sessions)