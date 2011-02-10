<?php

// Copy all the files in this repository to your include directory.

//$GLOBALS['THRIFT_ROOT'] = dirname(__FILE__) . '/include/thrift/';
$GLOBALS['THRIFT_ROOT'] = '/etc/cassandra/thrift';
require_once $GLOBALS['THRIFT_ROOT'].'/packages/cassandra/Cassandra.php';
require_once $GLOBALS['THRIFT_ROOT'].'/transport/TSocket.php';
require_once $GLOBALS['THRIFT_ROOT'].'/protocol/TBinaryProtocol.php';
require_once $GLOBALS['THRIFT_ROOT'].'/transport/TFramedTransport.php';
require_once $GLOBALS['THRIFT_ROOT'].'/transport/TBufferedTransport.php';

include_once('/etc/cassandra/phpcassa.php');
include_once('/etc/cassandra/uuid.php');




include_once('/home/web/public_html/buleys.com/private/cassandra.class.php');

$Cassandra = new Cassandra();

//$Cassandra->insert_into('Aggregator', 'Companies', 'GOOG', array('test'=>'false'));
 

 print_r($array);
 
  CassandraConn::add_node('64.62.228.202', 9160);
		$ItemsByTime = new CassandraCF('Aggregator','Companies'); // ColumnFamily

$array = $ItemsByTime->get_list("Amazon Inc.");

print_r($array);

 
?>