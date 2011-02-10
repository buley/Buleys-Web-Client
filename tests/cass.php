
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


CassandraConn::add_node('64.62.228.202', 9160);

echo 			$time_uuid = UUID::generate(UUID::UUID_TIME,UUID::FMT_STRING, $thing_to_get_2['timestamp']); 

?>




<?php
//$CF = new CassandraCF('Aggregator', 'Items'); // ColumnFamily

/*
$CF = new CassandraCF('Aggregator', 'ItemsByTime'); // ColumnFamily
$iterator = $CF->get_range_iterator('', '', 1024, array('col1', 'col2')); 
foreach($iterator as $key => $value) { 
	echo "got key... $key col1={$col1} col2={$col2}\n"; 
} 
*/
?>
