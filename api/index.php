<?php

	// api endpoint (not the api class)
	
	//central point for any requests from a human (user/admin) to the system
	
	//this class handles:
	//-authentication
	//-security/filterng
	//-translation/encoding

header("HTTP/1.0 200 OK");
	$session_id = '';
	$user_id = '';

	$session_id = str_replace(",","",$_COOKIE['session_id']);
	$user_id = str_replace(",","",$_COOKIE['user_id']);

	if( empty($user_email) ) {
		$user_email = $_REQUEST['email'];
	}

	
	include_once('/home/web/public_html/buleys.com/aggregator/aggregator.class.php');
	$aggregator = new Aggregator($user_id, $session_id);

	/*
	if( empty($session_id) ) {
	
		if( empty($user_id) ) { 
			$user_id = $aggregator->api->create_user(); 
			//set_session_cookie("user_id", $user_id);
			$aggregator->guest = true;
		}
	
	} else {

		$aggregator->guest = false;
	
	} */
	
	global $debug;
	#$debug->enabled=true;
	#$debug->dump=true;
	
	if(isset($_REQUEST['user_id'])) {
		$user_id = $_REQUEST['user_id'];
	}
	$event =  $_REQUEST['event'];
	$sort_by =  $_REQUEST['sort_by'];
	$sort_order =  $_REQUEST['sort_order'];
	$method =  $_REQUEST['method'];
	$context =  $_REQUEST['context'];
	$type =  $_REQUEST['type'] ;
	$item_key = $_REQUEST['item'];
	$begin_time = strtotime($_REQUEST['begin_time']);
	$end_time = strtotime($_REQUEST['end_time']);
	
	if($debug->enabled) {
		
		if($debug->dump) {
			echo "event";
			var_dump($event);
			echo "method";
			var_dump($method);
			echo "context";
			var_dump($context);
			echo "item";
			var_dump($item_key);
		}
	}
	
	$path_for_redirect = $context . "/" . $item_key;
	
	$user_email = $_REQUEST['email'];
	$user_secret =  $_REQUEST['secret'] ;

	$details_array['display_name'] = $_REQUEST['display_name'];
	$details_array['last_name'] = $_REQUEST['last_name'];
	$details_array['first_name'] = $_REQUEST['first_name'];
	$details_array['address_1'] = $_REQUEST['address_1'];
	$details_array['address_2'] = $_REQUEST['address_2'];
	$details_array['city'] = $_REQUEST['city'];
	$details_array['country'] = $_REQUEST['country'];
	$details_array['state'] = $_REQUEST['state'];
	$details_array['zip'] = $_REQUEST['zip'];
	
	if(isset($event) && $event != '') {
		if($event == "pageview") {
			$aggregator->api->send_clickstream_request($user_id, "pageview", $context);
		}elseif($event == "clickthrough") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_clickstream_request($user_id, "clickthrough", $request_array );
		} elseif($event == "preview") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_clickstream_request($user_id, "preview", $request_array );
		} elseif($event == "subscribe") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "subscribe", $request_array );
		} elseif($event == "unsubscribe") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "unsubscribe", $request_array );
		} elseif($event == "follow") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "follow", $request_array );
		} elseif($event == "unfollow") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "unfollow", $request_array );
		} elseif($event == "share") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "share", $request_array );
		} elseif($event == "peer_share") {
			$aggregator->api->send_event_request($user_id, "peer_share", array($context=>$item_key)  );
		} elseif($event == "backout") {
			$aggregator->api->send_clickstream_request($user_id, "backout", array($context=>$item_key) );
		} elseif($event == "engage") {
			$aggregator->api->send_clickstream_request($user_id, "engage", array($context=>$item_key) );
		} elseif($event == "reccomended_click") {
			$aggregator->api->send_clickstream_request($user_id, "reccomended_click", array($context=>$item_key) );
		} elseif($event == "email_click") {
			$aggregator->api->send_clickstream_request($user_id, "email_click", array($context=>$item_key) );
		} elseif($event == "twitter_click") {
			$aggregator->api->send_clickstream_request($user_id, "twitter_click", array($context=>$item_key) );
		} elseif($event == "star") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "star", $request_array );
			add_item_to_session_cookie("star", $item_key);
		} elseif($event == "unstar") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "unstar", $request_array );
			remove_item_from_session_cookie("star", $item_key);
		} elseif($event == "item_delete") {
			$aggregator->api->send_event_request($user_id, "item_delete", array($context=>$item_key) );
			add_item_to_session_cookie("deleted_items", $item_key);
		} elseif($event == "category_delete") {
			$aggregator->api->send_event_request($user_id, "category_delete", array($context=>$item_key) );
			add_item_to_session_cookie("deleted_categories", $cookie_value);
		} elseif($event == "tag_delete") {
			$aggregator->api->send_event_request($user_id, "tag_delete", array($context=>$item_key) );
			add_item_to_session_cookie("deleted_tags", $cookie_value);
		} elseif($event == "item_move") {
			$aggregator->api->send_event_request($user_id, "item_move", array($context=>$item_key) );
			add_item_to_session_cookie("moved_items", $cookie_value);
		} elseif($event == "category_move") {
			$aggregator->api->send_event_request($user_id, "category_move", array($context=>$item_key) );
			add_item_to_session_cookie("moved_categories", $cookie_value);
		} elseif($event == "tag_move") {
			$aggregator->api->send_event_request($user_id, "tag_move", array($context=>$item_key) );
			add_item_to_session_cookie("moved_tags", $cookie_value);
		} elseif($event == "item_upvote") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "item_upvote", $request_array );
			add_item_to_session_cookie("item_upvote", $cookie_value);
		} elseif($event == "category_upvote") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "category_upvote", $request_array );
			add_item_to_session_cookie("category_upvote", $cookie_value);
		} elseif($event == "item_downvote") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "item_downvote", $request_array );
			add_item_to_session_cookie("item_downvote", $cookie_value);
		} elseif($event == "category_downvote") {
			$request_array = array();
			$request_array['context_key'] = $context;
			$request_array['item_uri'] = $item_key;
			$request_array['context_type'] = $type;
			$aggregator->api->send_event_request($user_id, "category_downvote", $request_array );
			add_item_to_session_cookie("category_downvote", $cookie_value);
		}
		
	}
	if(!$aggregator->guest) {
		if($method == "update_user_attributes") {
			echo json_encode( $aggregator->api->update_user_attributes($user_id, $details_array) );
		} elseif($method == "get_user_attributes") {
			echo json_encode( $aggregator->api->get_user_attributes($user_id) );
		} elseif($method == "account_confirmation") {
			echo json_encode( $aggregator->api->claim_account_with_email($user_id, $user_email, $path_for_redirect) );
		} elseif($method == "cancel_account_confirmation") {
			echo json_encode( $aggregator->api->request_cancel_confirmation( $user_id ) );
		} elseif($method == "account_confirmation_resend") {
			echo json_encode( $aggregator->api->request_reinitiate_confirmation($user_id, $user_email, $path_for_redirect) );
		} elseif($method == "confirm_account") {
			echo json_encode( $aggregator->api->request_account_confirmation($user_id, $user_secret) );
		} elseif($method == "request_password_set") {
			echo json_encode( $aggregator->api->request_password_set($user_id, $user_secret) );
		} elseif($method == "request_registration") {
			echo json_encode( $aggregator->api->request_registration($user_id, $user_secret, $details_array) );
		} elseif($method == "request_login") {

			$session_id = $aggregator->api->request_account_login($user_email, $user_secret); 
			if( strtolower($session_id['result']) == "success" ) {
				add_item_to_session_cookie("session_id", $session_id['session_id']);
				echo json_encode( $session_id );
			} else {
				echo json_encode( $session_id );
			}
		
		} elseif($method == "email_login") {
			$email_login_result = $aggregator->api->request_email_login($user_email, $user_secret );
			if(isset($email_login_result['session_id'])) {
				//set_session_cookie("session_id", $email_login_result['session_id']);
			}
			if(isset($email_login_result['user_id'])) {
				//set_session_cookie("user_id", $email_login_result['user_id']);
			} 
			echo json_encode( $email_login_result );

		} else if($method == "logout") {
			echo json_encode( $aggregator->api->request_logout($user_id) );
			//set_session_cookie("session_id","");
		} else if($method == "get_user_votes") {
			$params = array("type" => $type);
			$params['sort_by'] = $sort_by;
			$params['sort_order'] = $sort_order;
			$params['begin_timestamp'] = $begin_time;
			$params['end_timestamp'] = $end_time;
			if( !empty($context) ) {
				$params['context_key'] = $context;
			}
			if( !empty($type) ) {
				$params['context_type'] = $type;
			}
			$params['user_id'] = $user_id;
			
			echo json_encode( $aggregator->api->get_user_votes( $params ) );
		} else if($method == "get_user_stars") {
			$params = array("type" => $type);
			$params['sort_by'] = $sort_by;
			$params['sort_order'] = $sort_order;
			$params['begin_timestamp'] = $begin_time;
			$params['end_timestamp'] = $end_time;
			if( !empty($context) ) {
				$params['context_key'] = $context;
			}
			if( !empty($type) ) {
				$params['context_type'] = $type;
			}
			$params['user_id'] = $user_id;

			echo json_encode( $aggregator->api->get_user_stars( $params ) );
		} else if($method == "get_users_personal_collection") {
			$params = array("user_id"=>$user_id);
			echo json_encode( $aggregator->api->get_users_personal_collection( $params ) );
		}
		 
	}

	function set_session_cookie($cookie_key, $cookie_value) {
		//drop cookie
		setcookie($cookie_key, $cookie_value , 0, "/", ".buleys.com", 0);
	}
		
	function add_item_to_session_cookie($cookie_key, $cookie_value) {
		//drop cookie
		$cookie = trim( remove_item_from_session_cookie($cookie_key, $cookie_value), "," );
		setcookie($cookie_key, trim( $cookie . "," . $cookie_value , "," ) , 0, "/", ".buleys.com", 0);
	}

	function remove_item_from_session_cookie($cookie_key, $cookie_value) {
		//drop cookie
		$cookie = $_COOKIE[$cookie_key];
		$cookie = trim(preg_replace("|/b$cookie_value/b|", '', $cookie), ",");
		setcookie($cookie_key, $cookie, 0, "/", ".buleys.com", 0);
		return $cookie;
	}
	header('HTTP/1.0 200 OK');
	header('Content-Length: 0',true);
	die();
?>