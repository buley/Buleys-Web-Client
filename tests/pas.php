<?php

	include_once('/home/web/public_html/buleys.com/aggregator/aggregator.class.php');
	$aggregator = new Aggregator("4cfc70c6dde04", 'ab93f0a66060d898f898fcc347761cb1');


	#$user_id = str_replace(",","",$_COOKIE['user_id']);
	#if( empty($user_id) ) { 
	#	$user_id =  $aggregator->api->create_user(); 
	#	add_item_to_session_cookie("user_id", $user_id);
	#} 

#	$aggregator->user->delete_all_users();
	#$login = $aggregator->api->request_account_login("4cfb42c69a796", "eccd15e2754db51d81b2b2ff6dd9b863");

	#$result = $aggregator->secure->request_email_login("taylor.buley@gmail.com", md5("123"));
	#var_dump($result);

	#$login = $aggregator->secure->set_privilege_level("4cfb42c69a796", "admin", 1);
	#var_dump($login);
	#$login = $aggregator->secure->get_privilege_level("4cfb42c69a796", "admin");

	#$set_request = $aggregator->user->set_password_hash($user_id, md5("RWza2JOkFM"));
	#var_dump($set_request);
	
	#$pass_hash = $aggregator->user->get_password_hash($user_id);
	#var_dump($pass_hash);

?>