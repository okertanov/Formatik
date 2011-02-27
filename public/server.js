/*
    Formatik Server Application.
    Copyright (c) 2011 Oleg Kertanov <okertanov@gmail.com>
*/

var sys  = require('sys'),
    http = require('http'),
    url  = require('url'),
    path = require('path'),
    fs   = require('fs');

const WEBROOT       = path.join(path.dirname(__filename), '/');
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
        dump_js_object(e);
    }
}).listen(WEBPORT);

sys.puts('Starting server at http://localhost:8800/...');

function serve_request(request, response)
{
    var serve_path = url.parse(request.url).pathname;

    //The top-level router
    if (/^\/{1}(api)\/?(.*)$/i.test(serve_path)) // "/api", "/api/send/etc"
    {
        serve_request_api(request, response); 
    }
    else if (/^\/?$/.test(serve_path)) // "/"
    {
        serve_request_fsobject(INDEXHTML, response); 
    }
    else if (/^\/{1}(.*(?!api))$/i.test(serve_path)) // "/resource.mime"
    {
        serve_request_fsobject(request, response); 
    }
    else
    {
        throw "serve_request: Can't handle " + serve_path;
    }
}

function serve_request_fsobject(request, response)
{
    var url_obj = ( typeof request == 'object' ? url.parse(request.url).pathname : request );
    var filename = path.join(WEBROOT, url_obj);
    var file_mime = get_mime_for(filename);

    path.exists(filename, function(exists) 
    {
        if(!exists) 
        {
            return response_http_code(request, response, 404);
        }

        if ( !file_mime.length || file_mime == '_disabled' )
        {
            return response_http_code(request, response, 403);
        }

        fs.readFile(filename, "binary", function(err, file) 
        {
            if(err) 
            {
                return response_http_code(request, response, 500);
            }

            response.writeHead(200, {"Content-Type": file_mime});
            response.write(file, "binary");
            response.end();
            sys.puts(url_obj + ': \t\t200 OK' + ' (' + file_mime + ')');
        });
    });
}

function serve_request_api(request, response)
{
    var api_path = url.parse(request.url).pathname;
    var api_re = /^\/{1}(api)\/{0,1}(.*)$/i;
    var api_result = api_re.exec(api_path);
    var api_api = api_result[1] || '';
    var api_cmd = api_result[2] || '';

    try
    {
        if (!api_api.length || !api_cmd.length)
            throw 'API Exception: api_api or api_cmd couldn\'t be empty.';
        switch(api_cmd)
        {
            case 'ping':
                response_http_code(request, response, 200);
                break;
            case 'newtask':
                response_http_code(request, response, 200);
                break;
            case 'tasks':
                response_http_code(request, response, 200);
                break;
            case 'settings':
                response_http_code(request, response, 401);
                break;
            case 'auth':
                response.writeHead(200, {"Content-Type": HTTPMimeTypes['json']});
                response.write('{ "success":true, "msg":"Authenticated" }' + '\n');
                response.end();
                break;
            default:
                throw 'API Exception: unknown api command.';
                break;
        }
        sys.puts('\tAPI>>> ' + api_api + ' cmd: ' + api_cmd);
    }
    catch(e)
    {
        sys.puts('Exception: ' + e);
        response_http_code(request,response, 501);
    }
}

var HTTPMimeTypes = 
{
    'text': 'text/plain',
    'html': 'text/html',
    'css' : 'text/css',
    'js'  : 'application/javascript', 
    'ico' : 'image/x-icon', 
    'json': 'application/json',
    '---' : '_disabled'
};

function get_mime_for(filename)
{
    var extension_re_result = filename.match(/\.(\w+)$/);
    var extension = (extension_re_result?extension_re_result[1]:'');
    var mime = HTTPMimeTypes['---'];
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
            mime = HTTPMimeTypes['---'];
            break;
    }
    return mime;
}

var HTTPErrorStrings = 
{
    200: 'OK',
    401: 'Unauthorized',
    403: 'Forbidden', 
    404: 'Not Found', 
    500: 'Internal Server Error', 
    501: 'Not Implemented'
};

function response_http_code(request, response, errcode)
{
    var url_obj = ( typeof request == 'object'? url.parse(request.url).pathname : request );
    response.writeHead(errcode, {"Content-Type": HTTPMimeTypes['text']});
    response.write(errcode + ' ' + HTTPErrorStrings[errcode] + '\n');
    response.end();
    sys.puts(url_obj + ': \t\t' + errcode + ' ' + HTTPErrorStrings[errcode]);
}

function dump_js_object(obj)
{
    var str_out = ""; 
    for (var prop in obj) 
    {   
        str_out += "\tproperty: "+ prop + " value: ["+ obj[prop]+ "]\n"; 
    } 
    
    str_out += "toString(): " + " value: [" + obj.toString() + "]"; 
    sys.puts('JS Object details for:\n ' + obj + "\n" + str_out);
}

