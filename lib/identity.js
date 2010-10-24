var cookieDecoder = require('connect/middleware/cookieDecoder');

require('joose');
require('joosex-namespace-depended');
require('hash');

module.exports = function(settings) {
  var cookie_name = settings.cookie || '_identity';

  function headersToArray(headers) {
    if (Array.isArray(headers)) return headers;

    return Object.keys(headers).reduce(function(arr, k) {
      arr.push([k, headers[k]]);
      return arr;
    }, []);
  };

  return function(request, response, next) {

    cookieDecoder(request, response);

    // replace writeHead to write cookie to all responses
    var _writeHead = response.writeHead;

    //console.log(require('sys').inspect(request));

    var value = (request.cookies && request.cookies[cookie_name]) ||
                Hash.sha512((new Date()).toString() + Math.random());

    request.identity = value;

    response.writeHead = function() {
      var args    = Array.prototype.slice.call(arguments);
      var headers = (args.length > 1) ? args[args.length-1] : {};

      var cookiestr = escape(cookie_name) + '=' + value + '; ' +
        'expires=1 Jan 2020 00:00:00 UTC; path=/'

        if (Array.isArray(headers)) {
          headers.push(['Set-Cookie', cookiestr]);
        } else {
          if (headers['Set-Cookie'] !== undefined) {
            headers = headersToArray(headers);
            headers.push(['Set-Cookie', cookiestr]);
            args[args.length-1] = headers;
          } else {
            headers['Set-Cookie'] = cookiestr;
          }
        }

        // call the original writeHead on the request
        return _writeHead.apply(response, args);
    }

    next()
  }
}
