<?php


	$session_id = '';
	$user_id = '';

	$session_id = str_replace(",","",$_COOKIE['session_id']);
	$user_id = str_replace(",","",$_COOKIE['user_id']);
	
	
	include_once('/home/web/public_html/buleys.com/aggregator/aggregator.class.php');
	$aggregator = new Aggregator($user_id, $session_id);

		
/*
$user_id = "4cfc86407ed67";

// Connect to localhost on the default port.
$m = new Mongo("mongodb://173.255.237.51:27017");

// select a database
$db = $m->activity;
$collection = $db->$user_id;

// add an element
$obj = array( "title" => "Calvin and Hobbes", "author" => "Bill Watterson" );
$collection->insert($obj);

// add another element, with a different "shape"
$obj = array( "title" => "XKCD", "online" => true );
$collection->insert($obj);

// find everything in the collection
$cursor = $collection->find();

// iterate through the results
foreach ($cursor as $obj) {
    echo $obj["title"] . "\n";
}

// disconnect
$m->close();
*/

?>