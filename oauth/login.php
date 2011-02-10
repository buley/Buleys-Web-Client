<?php
// require twitterOAuth lib
require_once('/home/web/public_html/cptlst.net/public/oauth/twitterOAuth.php');

/* Sessions are used to keep track of tokens while user authenticates with twitter */
session_start();
/* Consumer key from twitter */
$consumer_key = 'Y4xUWW3FSa4gHyTn8xwBA';
/* Consumer Secret from twitter */
$consumer_secret = 'dzOlHgW7gKyBcoD7JYDM9AGpOZB9t8t0J2K4pdrwE0';
/* Set up placeholder */
$content = NULL;
/* Set state if previous session */
$state = $_SESSION['oauth_state'];
/* Checks if oauth_token is set from returning from twitter */
$session_token = $_SESSION['oauth_request_token'];
/* Checks if oauth_token is set from returning from twitter */
$oauth_token = $_REQUEST['oauth_token'];
/* Set section var */
$section = $_REQUEST['section'];

/* Clear PHP sessions */
if ($_REQUEST['clear'] === 'true' || $_GET['clear'] === 'true') {/*{{{*/
  session_destroy();
  session_start();
}/*}}}*/


    /* Create TwitterOAuth object with app key/secret */
    $to = new TwitterOAuth($consumer_key, $consumer_secret);
    /* Request tokens from twitter */
    $tok = $to->getRequestToken();

    /* Save tokens for later */
    $_SESSION['oauth_request_token'] = $token = $tok['oauth_token'];
    $_SESSION['oauth_request_token_secret'] = $tok['oauth_token_secret'];
    $_SESSION['oauth_state'] = "start";

    /* Build the authorization URL */
    $request_link = $to->getAuthorizeURL($token);

    /* Build link that gets user to twitter to authorize the app */
    
    /* This will give an error. Note the output
 * above, which is before the header() call */
header("Location: $request_link");
    
    
?>