<?php
//  ---------------------------------------------------------
//  Formatik Server Application.
//  Copyright (c) 2011 Oleg Kertanov <okertanov@gmail.com>
//  ---------------------------------------------------------

//
// Settings
//
ini_set("display_errors", 1);

//
// Globals
//
$ctx = array();
$ctx['sqlhost']         = 'localhost'; 
$ctx['sqldb']           = 'formatikdb'; 
$ctx['sqlusername']     = 'formatik';
$ctx['sqlpassword']     = '9sTrTBBnnMO';

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

    return json_encode($ctx['rs']);
}

function handle_auth()
{
    global $ctx;
    $rq = &$ctx['rq'];
    $rs = &$ctx['rs'];
    $rs['endpoint'] = $ctx['endpoint'];
    $rs['success']  = FALSE;
    $rs['msg']      = 'not authenticated';
    
    try
    {
        $rs['username'] = isset($rq['username']) ? $rq['username'] : '';
        $rs['password'] = isset($rq['password']) ? $rq['password'] : '';

        if ( !strlen($rs['username']) or !strlen($rs['password']) )
            e_throw('Username or password couldn\'t be empty.');

        $sql_statement = sprintf('call check_auth("%s", "%s");', $rs['username'], $rs['password']);
        $sql_result    = sql_execute($sql_statement) or 
            e_throw( 'sql_execute error: ' . sql_get_error() );
        $sql_data      = sql_get_data($sql_result) or 
            e_throw( 'not authenticated' );
        if ( isset($sql_data['authenticated']) and $sql_data['authenticated'])
        {
            $rs['success']  = TRUE;
            $rs['address']  = isset($sql_data['address']) ? $sql_data['address'] : '';
            $rs['msg']      = 'authenticated';
        }
        sql_release_data($sql_result);
    }
    catch(Exception $e)
    {
        $rs['success']  = FALSE;
        $rs['msg']      = 'Exception: ' . $e->getMessage();
    }

    return json_encode($ctx['rs']);
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
    global $ctx;
    $rq = &$ctx['rq'];
    $rs = &$ctx['rs'];
    $rs['endpoint'] = $ctx['endpoint'];
    $rs['success']  = FALSE;
    $rs['msg']      = 'empty';
    
    try
    {
        $rs['name'] = isset($rq['name']) ? $rq['name'] : '';
        $sql_statement = '';
        switch ($rs['name'])
        {
            case 'places':
                $sql_statement = sprintf('call get_places;');
                break;
            case 'kinds':
                $sql_statement = sprintf('call get_kinds;');
                break;
            case 'categories':
                $sql_statement = sprintf('call get_categories;');
                break;
            case 'packages':
                $sql_statement = sprintf('call get_packages;');
                break;
            case 'weightclasses':
                $sql_statement = sprintf('call get_weightclasses;');
                break;
            default:
                e_throw('Catalog parameter is unknown.');
                break;
        }
        if ( !strlen($sql_statement) )
            e_throw('Unknown catalog parameter.');
        $sql_result    = sql_execute($sql_statement) or 
            e_throw( 'sql_execute error: ' . sql_get_error() );
        while( $sql_data = sql_get_data($sql_result) );
        {
            $rs[$rs['name']][] = array(
                                                'id'   => $sql_data['cid'],
                                                'name' => $sql_data['cname'],
                                           );
        }

        sql_release_data($sql_result);
    }
    catch(Exception $e)
    {
        $rs['success']  = FALSE;
        $rs['msg']      = 'Exception: ' . $e->getMessage();
    }

    return json_encode($ctx['rs']);
}

function handle_default()
{
    global $ctx;
    $rs = &$ctx['rs'];
    $rs['endpoint'] = $ctx['endpoint'];
    $rs['success']  = FALSE;
    $rs['msg']      = 'Failure: unknown api endpoint.';

    return json_encode($ctx['rs']);
}

//
// handle_api: api dispatcher
//
function handle_api()
{
    global $ctx;

    //Initialize
    $ctx['endpoint'] = $_SERVER['PATH_INFO'];
    $ctx['rq'] = $_REQUEST;
    $ctx['rs'] = array();

    $js_str = '';

    //Route & gather reply buffer
    $ep_parts = explode('/', $ctx['endpoint']);
    $ep_route = $ep_parts[2] or '';
    switch( $ep_route )
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
    //dbg_out();
}

//
//
//
function e_throw($m)
{
    throw new Exception($m);
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
        new mysqli($ctx['sqlhost'], $ctx['sqlusername'], $ctx['sqlpassword'], $ctx['sqldb']) 
            or die('MySQL Connection Error: ' . mysqli_connect_error());
}

//
// sql_close: closes connection or not, if persistent
//
function sql_close()
{
    global $ctx;
    $ctx['sqlconn']->close();
}

//
// sql_execute: executes an sql command
//
function sql_execute($sql)
{
    global $ctx;
    return $ctx['sqlconn']->query($sql);
}

//
//
//
function sql_get_data($res)
{
    global $ctx;
    return $res->fetch_array(MYSQLI_ASSOC);
}

//
//
//
function sql_release_data($res)
{
    $res->close();
}

//
//
//
function sql_get_error()
{
    global $ctx;
    return $ctx['sqlconn']->error;
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
