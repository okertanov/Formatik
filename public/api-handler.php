<?php
//  ---------------------------------------------------------
//  Formatik Server Application.
//  Copyright (c) 2011 Oleg Kertanov <okertanov@gmail.com>
//  ---------------------------------------------------------

//
// Globals
//
$ctx = array();
$ctx['sqlhost']         = ':/var/run/mysqld/mysqld.sock' or 'localhost'; 
$ctx['sqlusername']     = 'formatik';
$ctx['sqlpassword']     = '9sTrTBBnnMO';
$ctx['sqlflags']        = 0;

//
// API handlers
// return json buffer
//
function handle_ping()
{
    global $ctx;
    $rs = &$ctx['rs'];
    $rs['endpoint'] = $ctx['endpoint'];
    $rs['success']  = TRUE;
    $rs['msg']      = 'pong';

    return json_encode($ctx['rs'], JSON_FORCE_OBJECT);
}
function handle_auth()
{
}  
function handle_settings()
{
}
function handle_newtask()
{
}
function handle_settask()
{
}
function handle_tasks()
{
}
function handle_catalog()
{
}
function handle_default()
{
}

//
// handle_api: api dispatcher
//
function handle_api()
{
    global $ctx;

    //Initialize
    $ctx['endpoint'] = $_SERVER[PATH_INFO];
    $ctx['rq'] = $_REQUEST;
    $ctx['rs'] = array();

    $js_str = '';

    //Route & gather reply buffer
    switch( explode('/', $ctx['endpoint'])[1] )
    {
        case 'ping':
            $js_str = handle_ping();
            break;
        case 'auth':
            $js_str = handle_auth();
            break;
        case 'settings':
            $js_str = handle_settings();
            break;
        case 'newtask':
            $js_str = handle_newtask();
            break;
        case 'settask':
            $js_str = handle_settask();
            break;
        case 'tasks':
            $js_str = handle_tasks();
            break;
        case 'catalog':
            $js_str = handle_catalog();
            break;
        default:
            $js_str = handle_default();
            break;
    }

    //Output 
    header('Content-type: application/json');
    echo $js_str;

    //Debug
    dbg_out();
}

//
// dbg_out: misc debug printing
//
function dbg_out()
{
    global $ctx;
    echo('<br />CTX------------------------------------------------<br />');
    print_r($ctx);
    echo('<br />_ENV------------------------------------------------<br />');
    print_r($_ENV);
    echo('<br />_SERVER------------------------------------------------<br />');
    print_r($_SERVER);
    echo('<br />_SESSION------------------------------------------------<br />');
    print_r($_SESSION);
    echo('<br />_REQUEST------------------------------------------------<br />');
    print_r($_REQUEST);
    echo('<br />_GET------------------------------------------------<br />');
    print_r($_GET);
    echo('<br />_POST------------------------------------------------<br />');
    print_r($_POST);
    echo('<br />------------------------------------------------<br />');
}

//
// session_enter: creates a named session for the request
//
function session_enter()
{
    $sess_name = session_name("FormatikAPI");
    session_start();
}

//
// session_leave: closes active session
//
function session_leave()
{
    session_write_close();
}

//
// sql_connect: create mysql connection
//
function sql_connect()
{
    global $ctx;
    
    $ctx['sqlconn'] = 
        mysql_pconnect($ctx['sqlhost'], $ctx['sqlusername'], $ctx['sqlpassword'], $ctx['sqlflags']) 
            or die('MySQL Connection Error: ' . mysql_error());
}

//
// sql_refresh: updates mysql connection. 
// returns true if connected, false otherwise
//
function sql_refresh()
{
    global $ctx;
    if ( !mysql_ping($ctx['sqlconn']) )     sql_connect();

    return mysql_ping($ctx['sqlconn']);
}

//
// sql_close: close connection or not, if persistent
//
function sql_close()
{
    global $ctx;
    mysql_close($ctx['sqlconn']);
}

//
// main entry point
//
function main()
{
    sql_connect();
        session_enter();
            handle_api();
        session_leave();
    sql_close();
}

main();

?>
