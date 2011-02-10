<?php

$urlToShare = $_REQUEST['url'];
$headlineToShare = $_REQUEST['headline'];
$source = $_REQUEST['source'];
$message = $_REQUEST['message'];

// require twitterOAuth lib
require_once('/home/web/public_html/cptlst.net/public/oauth/twitterOAuth.php');

/* Sessions are used to keep track of tokens while user authenticates with twitter */
session_start();
/* Consumer key from twitter */
$consumer_key = 'Y4xUWW3FSa4gHyTn8xwBA';
/* Consumer Secret from twitter */
$consumer_secret = 'dzOlHgW7gKyBcoD7JYDM9AGpOZB9t8t0J2K4pdrwE0';

$to = new TwitterOAuth($consumer_key, $consumer_secret, $_SESSION['oauth_access_token'], $_SESSION['oauth_access_token_secret']);
echo $content = $to->OAuthRequest('https://twitter.com/statuses/update.json', array('status' => "$message"), 'POST');


?>