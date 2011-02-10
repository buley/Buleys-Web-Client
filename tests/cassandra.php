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


?>


* Create a column family object

<?php
$users = new CassandraCF('Buleys', 'Buleys Cluster'); // ColumnFamily
?>
* Querying:

<?php
$get = $users->get('1'); // array('email' => 'hoan.tonthat@gmail.com', 'password' => 'test')
print_r($get);
$users->multiget(array('1', '2')); // array('1' => array('email' => 'hoan.tonthat@gmail.com', 'password' => 'test'))
?>


* Inserting:

<?php
$users->insert('1', array('email' => 'hoan.tonthat@gmail.com', 'password' => 'test'));
?>



* Removing:

<?php
$users->remove('1'); // removes whole object
$users->remove('1', 'password'); // removes 'password' field
?>

* Other:

<?php
$users->get_count('1'); // counts the number of columns in user 1 (in this case 2)
$users->get_range('1', '10'); // gets all users between '1' and '10'
?>