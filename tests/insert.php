<?php

include_once('/home/web/public_html/buleys.com/private/cassandra.class.php');

$Cassandra = new Cassandra();

$Cassandra->insert_into('Aggregator', 'Companies', 'GOOG', array('test'=>'false'));
 
$array = multiget($keys, $slice_start="1261956797", $slice_finish="1262102640");

 print_r($array);
 
?>