/*
    Formatik Server Application.
    Copyright (c) 2011 Oleg Kertanov <okertanov@gmail.com>
*/

var sys  = require('sys'),
    http = require('http'),
    url  = require('url'),
    path = require('path'),
    fs   = require('fs');

const WEBROOT       = '/cygdrive/c/okertanov/projects/_unsupported_/Formatik.svn/webroot/';
//const WEBROOT       = '/home/okertanov/projects/Formatik.svn/webroot/';
const WEBPORT       = 8800;
const INDEXHTML     = 'index.html';

http.createServer(function(request, response) 
{
    try 
    {
        serve_request(request, response);
    }
    catch(e)
    {
        sys.puts('Exception: ' + e);
        var vDebug = ""; 
        for (var prop in e) 
        {   
           vDebug += "property: "+ prop + " value: ["+ e[prop]+ "]\n"; 
        } 
        vDebug += "toString(): " + " value: [" + e.toString() + "]"; 
        sys.puts('Exception details:\n ' + vDebug);
    }
}).listen(WEBPORT);

sys.puts('Starting server at http://localhost:8800/...');

function serve_request(request, response)
{
    switch (url.parse(request.url).pathname) 
    {
        case '/':
          serve_request_fsobject(INDEXHTML, response);
          break;
        case '/api':
          serve_request_api(request, response);
          break;
        default:
          serve_request_fsobject(request, response);
          break;
    }
}

function serve_request_fsobject(request, response)
{
    var url_obj = ( typeof request == 'object' ? url.parse(request.url).pathname : request );
    var filename = path.join(WEBROOT, url_obj);

    path.exists(filename, function(exists) 
    {
        if(!exists) 
        {
            return response_error(request, response, 404);
        }

        fs.readFile(filename, "binary", function(err, file) 
        {
            if(err) 
            {
                return response_error(request, response, 500);
            }

            response.writeHead(200, {"Content-Type": get_mime_for(filename)});
            response.write(file, "binary");
            response.end();
            sys.puts(url_obj + ': \t\t200 OK');
        });
    });
}

function serve_request_api(request, response)
{
    return response_error(response, 501);
}

var HTTPMimeTypes = 
{
    'text': 'text/plain',
    'html': 'text/html',
    'css' : 'text/css',
    'js'  : 'application/javascript', 
    'ico' : 'image/x-icon'
};

function get_mime_for(filename)
{
    var extension = filename.match(/\.(\w+)$/)[1];
    var mime = HTTPMimeTypes['text'];
    switch (extension)
    {
        case 'htm':
        case 'html':
            mime = HTTPMimeTypes['html'];
            break;
        case 'css':
            mime = HTTPMimeTypes['css'];
            break;
        case 'js':
            mime = HTTPMimeTypes['js'];
            break;
        case 'txt':
            mime = HTTPMimeTypes['text'];
            break;
        case 'ico':
            mime = HTTPMimeTypes['ico'];
            break;
        default:
            mime = HTTPMimeTypes['text'];
            break;
    }
    return mime;
}

var HTTPErrorStrings = 
{
    200: 'OK',
    404: 'Not Found', 
    500: 'Internal Server Error', 
    501: 'Not Implemented' 
};

function response_error(request, response, errcode)
{
    var url_obj = ( typeof request == 'object'? url.parse(request.url).pathname : request );
    response.writeHead(errcode, {"Content-Type": HTTPMimeTypes['text']});
    response.write(errcode + ' ' + HTTPErrorStrings[errcode] + '\n');
    response.end();
    sys.puts(url_obj + ': \t\t' + errcode + ' ' + HTTPErrorStrings[errcode]);
}

