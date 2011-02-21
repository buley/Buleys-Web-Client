<!-- This code is copyright, in all of its sloppy glory, by its shameless author Taylor Buley --><?php
header('HTTP/1.0 200 OK');
?>
<html>
<head>
<title>Buley's</title>
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
<script type="text/javascript">
var checker;


if ('webkitIndexedDB' in window) {
    window.indexedDB = window.webkitIndexedDB;
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
} else if ('mozIndexedDB' in window) {
    window.indexedDB = window.mozIndexedDB;
}

var Buleys = {};
Buleys.db = {};
Buleys.queues = {};
Buleys.settings = {};
Buleys.profile = {};
Buleys.mouse = {};
Buleys.shortcuts = {};
Buleys.history = {};
Buleys.session = {};
Buleys.view = {};
Buleys.debug = {};
Buleys.debug.database = false;
Buleys.debug.ajax = false;
Buleys.debug.items = false;
Buleys.settings.mini_inbox_topic_count = 5;
Buleys.shortcuts.s_depressed = false;
Buleys.shortcuts.d_depressed = false;
Buleys.shortcuts.shift_depressed = false;
Buleys.settings.crawl_speed = 10000;
Buleys.settings.crawl_deincrement = (2 / 4);
Buleys.settings.crawl_increment = (1 / 5);
Buleys.settings.crawl_max = 6000000;
Buleys.settings.crawl_min = 10000;
Buleys.queues.pending_crawls = [];
Buleys.queues.new_items = {};
Buleys.mouse.mouse_y = 0;
Buleys.mouse.mouse_x = 0;
Buleys.mouse.mouse_y_snapshot = 0;
Buleys.mouse.mouse_x_snapshot = 0;
Buleys.store = window.localStorage;
Buleys.session.database_is_open = false;

var session_token = '';
var debug;

function set_page_vars() {

    console.log("Setting page vars: ", location.pathname);

    var string_for_split = location.pathname;
    string_for_split = string_for_split.replace(/^\//, "");
    string_for_split = string_for_split.replace(/\/$/, "");

    var splitted = string_for_split.split("/");
    Buleys.view.type = splitted[0];
    Buleys.view.slug = splitted[1];
    Buleys.view.page = splitted[2];

}

function check_login_status() {

    console.log("check_login_status()");

    console.log("Get", get_local_storage("session_id"));
    var session_id = get_local_storage("session_id");
    if (typeof session_id == "undefined" || session_id == null || session_id == "") {
        jQuery("#header").append("<div id='login_status_pane'>" + '<a href="#" id="get_settings_button" class="get_settings">Settings</a>' + '<a href="#" id="get_login" class="getloginform">Login or Signup</a>' + "</div>");
    } else {
        jQuery("#header").append("<div id='login_status_pane'>" + '<a href="#" id="get_settings_button" class="get_settings">Settings</a>' + "</div>");
    }


}

function get_settings_page() {
    console.log("get_settings_page()");
    jQuery("#main").append("<div od='login_prompt'>Logged in with session id <code>" + get_local_storage("session_id") + "</code>.<br/><br/><a href='#' class='do_logout'>Click here</a> to log out.</div>");

}

function get_setting_type(setting_to_get) {
    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting_type(setting_to_set, setting_value) {
    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}

function get_setting(setting_to_get) {
    return get_local_storage("setting_type_" + setting_to_get)
}

function set_setting(setting_to_set, setting_value) {
    return set_local_storage("setting_type_" + setting_to_set, setting_value)
}



function clear_page() {
    jQuery("#right").html('');
    jQuery("#main").html('');
}

function load_current_page() {

    clear_page();
    set_page_vars();

    console.log("load_current_page(): ", Buleys.view.type, Buleys.view.slug, Buleys.view.page);

    if (Buleys.view.type == "settings" || Buleys.view.type == "account") {


        get_settings_page();

    } else if (Buleys.view.type == "signin" || "signin" == Buleys.view.type || "start" == Buleys.view.type) {


        if (Buleys.view.loaded != "signin") {
            get_signin();
        }

    } else if (Buleys.view.type == "register") {


        get_registration();

    } else if (Buleys.view.type == "confirm") {


        get_confirmation();

    } else if (Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs") {


        get_favorites(Buleys.view.type, Buleys.view.slug);

    } else if (Buleys.view.type == "archive" || Buleys.view.page == "archive" || Buleys.view.page == "archived") {


        get_archived(Buleys.view.type, Buleys.view.slug);

    } else if (Buleys.view.type == "trash" || Buleys.view.page == "trash" || Buleys.view.page == "trashed" || Buleys.view.page == "deleted") {

        get_deleted(Buleys.view.type, Buleys.view.slug);

    } else if (Buleys.view.type == "read" || Buleys.view.page == "read") {


        get_read(Buleys.view.type, Buleys.view.slug, null, null, false);

    } else if (Buleys.view.type == "unread" || Buleys.view.page == "unread") {


        get_read(Buleys.view.type, Buleys.view.slug, null, null, true);

    } else if (Buleys.view.type == "seen" || Buleys.view.page == "seen") {


        get_seen(Buleys.view.type, Buleys.view.slug, null, null, false);

    } else if (Buleys.view.type == "unseen" || Buleys.view.page == "unseen") {


        get_seen(Buleys.view.type, Buleys.view.slug, null, null, true);

    } else if (typeof Buleys.view.page == "undefined" || Buleys.view.page == "" || Buleys.view.page == "home" || Buleys.view.page == "index") {
        get_items(Buleys.view.type, Buleys.view.slug);

    } else {
        get_items(Buleys.view.type, Buleys.view.slug);

    }

    Buleys.view.loaded = Buleys.view.type;


}

function reload_results() {

    clear_page();

    load_current_page();
}



$(document).ready(function () {



});


</script>

</head>
<style>

a { 
color:#000;
}
a:visited { 
color:#000;
}
h3 a:visited { 
color:#000;
}
h3 a { 
color:#000;
padding:0;
margin:0;
	font:normal normal normal 1.4em Helvetica,Georgia,serif;
}
body {
background: #fff;
}
ul {
	list-style-type:none;
	padding:0;
	margin:0;
}
#main {
	position:absolute;
	margin:4.5% 1% 0 0%;
	left:2%;
	clear:left;
	width:50%;
}
#right {
	position:absolute;
	margin:4.5% 1% 0 0%;
	right:5%;
	clear:left;
	width:50%;
}

#console_wrapper {
	left:5%;
	width:45%;
	bottom:2%;
	background:url('/images/5percenttransparency.png') repeat;
	z-index: 999;
	position: fixed;
}
#console {
	float:left;
	clear:left;
	margin:0 10px 0 10px;
	padding:10px;
}
#console_controls {
	clear:right;
	float:right;
	margin:10px;
}
#console_controls a, #console_controls a:visited {
	color:#000;
}

#login_prompt {
width:330px;
margin:20px 0 0 0;
z-index: 999;
}

#console_close_button {
	padding: 0 20px 20px 20px;
}
#login_status_pane {
padding:5px 5px 20px 10px;
float:right;
font: 1.3em Georgia,Helvetica;
}


#login_status_pane a {
	margin:0 10px 0 0;
	color:#000;
	font-size:1.25em Helvetica, Georgia;
}

#service_status_pane {
padding:5px;
float:right;
}
#overlay {
	padding: 10px 20px 20px 20px;
	margin:4.5% 0% 0 0%;
	width:38%;
	left:1%;
	z-index:999;
	position:fixed;
	background:url('/images/5percenttransparency.png') repeat;
	border:1px solid #eee;

}
#overlay_controls {
	margin:20px 0 0 0;
	clear: both;
	
}
#overlay_controls a, #overlay_controls a:visited {
	margin:0 10px 0 0;
	color: #000;
}
#overlay ul {
	list-style-type:none;
	margin:0 0px 30px 0px;
	border-left:solid 3px #000;
}
#overlay ul li {
	list-style-type:none;
	margin:0 10px 0px 0px;
	padding:0 10px 5px 0px;
	float:left;
	font:normal normal normal 1.1em Helvetica,Georgia,serif;
}
#overlay p {
	font:normal normal normal 1.1em Georgia,Helvetica,serif;
}
#overlay h3 {
	width:80%;
}

#overlay .category {
	float:left;
	text-decoration: none;
	font-family: Georgia;
	font-size:1em;
	line-height: 1.4em;
}

#overlay .vote_down_category. .vote_up_category {
	float:left;
	margin:0 0px 0px 0px;
	padding:0 0px 0px 0px;
	line-height: 1.4em;
}

#overlay .delete_category {
	float:right;
	margin:0 0px 0px 0px;
	padding:0 0px 0px 7px;
	line-height: 1.4em;
}

#overlay .selected_category {
}

.vote_context {
	clear:left;
	float:left;
	padding:10px 10px 0px 0;
	margin:0;
	vertical-align: middle;
}

.vote_context a {
	padding:6px 0 0 0;
}

.sidebar_close_link {
	margin:10px 0px 0 0;
	float: right;
	position: relative;
}

.loading {
	height:11px;
	padding:10px;
	width:100%;
	background:url('/images/ajax-loader.gif') no-repeat;
	background-position:center;
}

.selected_category {
	color:#66000;
	margin:0;
	padding:0;
	list-style-type:none;
}

.category_controls div {
	float:left;
	width:16px;
	height:16px;
	padding:0 2px 0 2px;
}

#star_item {
	margin:10px 0px 10px 0px;
}

ul#result_controls {
	margin:0px 0 0px 0;
	padding:20px 20px 10px 20px;
	left:0px;
	bottom:0px;
	position:fixed;
	font-size:1.4em;
	border-top:1px solid #111;
	background:transparent url('/images/80percenttransparency.png') repeat;
	width:100%;
	color:#eee;
	z-index:1000;
}
ul#result_controls > li {
	float:left;
	margin:0 10px 10px 0;
font-size:.8em;
}

ul#result_controls a, ul#result_controls a:visited {
	color:#eee;
}
ul#results {
	clear:both;
	margin:0px 0 0px 0;
	z-index:0;
	overflow: visible;
}
ul#results > li {
	margin:0;
	padding:3% 2% 3% 2%;
	line-height:32px;
border-bottom:1px solid #eee;
z-index: 1;
	overflow: visible;
}
ul#results > li > a {
	margin:0;
	padding:0;
	font:normal normal normal 1.4em Helvetica,Georgia,serif;
}

.favorite_status {
	margin:0 10px 0 0;
}
div#overlay span.overlay_favorite_status a {
padding:0px 00px 0px 0;
float:left;
	margin:0 0px 0 0;

}

.overlay_favorite_status {
	margin:0 0px 0 0;
	float: left;
	clear:left;
	position: relative;
}

#page_meta {
	margin:0 0 10px 0;

}
#page_meta a {
	margin:0 10px 0 0;
	color: #000;
}

#page_meta a:visited {
	margin:0 10px 0 0;
	color: #000;
}
.category_list a {
color:#666;
}
a.upvoted {
color:#333;

}
a.downvoted{
color:#999;
}

#login_status_pane-depreciateme {
	top:16%;
	right:0;
	position: fixed;
	background:url('/images/80percenttransparency.png') repeat;
	z-index:5000;
	border-left:1px solid #111;
	border-top:1px solid #111;
	border-bottom:1px solid #111;
	padding:2.35%;
	color:#eee;
}


#inbox_box {
	right:0;
	position: fixed;
	background:url('/images/80percenttransparency.png') repeat;
	z-index:5000;
	border-left:1px solid #111;
	border-top:1px solid #111;
	border-bottom:1px solid #111;
	padding:2.35%;
	color:#eee;
}

#inbox_box a {
	color:#fff;
}


#help_box {
	bottom:4%;
	left:2%;
	position: fixed;
	z-index:999;
	padding:1%;
	color:#000;
	color:#eee;
}

#help_box a {
	color:#fff;
}

#minimize_login_controls {
float:right;
position: relative;
display: inline;
padding:0 0 20px 20px;
}

#minimize_mini_inbox_controls {
float:right;
position: relative;
display: inline;
padding:0 0 20px 20px;
}

#login_form {
	float:left;
}

a #dologinsubmit {
clear:both;
color:#fff;
}

#login_form input {
	margin:10px 0 0px 0;
}


#login_buttons {
	clear:left;
	padding: 10px 10px 10px 0px;
}

#header {
position: fixed;
top:0;
right:0;
left:0;
padding:.5% 1% 0% 1%;
z-index: 10000;
/*background:url('/images/5percenttransparency.png') repeat;*/
color:#000;
border-bottom:1% solid #111;

}
a.logo {
color:#000;
text-decoration: none;
font-size:150%;
margin:.25% 1% 1% 1%;
text-transform: uppercase;
font-weight: 100#;
text-shadow: #000 0 1% 0;
float:right;
position:relative;
border:1px solid #000;
padding:.25% .5% 0 .5%;
}
#page_meta {
font-size:125%;
padding-top:3px;
margin:7px 0 0 0;
float:left;
}
#page_meta a {
color:#000;
}
#page_meta a:visited {
color:#000;
}
#right li a {
	color:#000;
}
#right li.seen a {
	color:#333;
}
#right li.read a {
	color:#222;
}
#right li.favorited a {
	color:#111;
}

#result_controls { 
	display: none;
}

#right li.selected {
	background:url('/images/5percenttransparency.png') repeat;
	color:#000;
	margin:0px;
	width:96%;

}

#right li.cursor {
border-left:10px solid #a60000;

}

#mini_inbox_box {
	bottom:20px;
	right:20px;
	position: fixed;
	background:url('/images/5percenttransparency.png') repeat;
	z-index:999;
	padding:1%;
	color:#000;
}

#mini_inbox_box a {
	color:#000;
	z-index: 1000;
}

.mini_box_icon {
padding:10px 0 0px 0;
}

.isotope,
.isotope .isotope-item {
  /* change duration value to whatever you like */
  -webkit-transition-duration: 0.8s;
     -moz-transition-duration: 0.8s;
          transition-duration: 0.8s;
}

.isotope {
  -webkit-transition-property: height, width;
     -moz-transition-property: height, width;
          transition-property: height, width;
}

.isotope .isotope-item {
  -webkit-transition-property: -webkit-transform, opacity;
     -moz-transition-property:    -moz-transform, opacity;
          transition-property:         transform, opacity;
}

#overlay_left {
	position: relative;
	float:left;
	margin:1% 0 1% 0;
}
#overlay_right {
	width:90%;
	margin:0;
	padding:0;
	position: relative;
	float:right;
}

</style>
<body>
	<div id='header'>
		<!--<a href="#" class="logo">Buley's</a>-->
		<div id='page_meta'></div>
		<div id='service_status_pane'></div>
	</div>
		<ul id='result_controls'>
			<li id='view_home_button'>
				<a href='#' id='view_home'>View Home</a> (shift + h)
			</li>		
			<li id='view_index_button'>
				<a href='#' id='view_index'>View Index</a> (shift + z)
			</li>
			<li id='view_favorites_button'>
				<a href='#' id='view_favorites'>View Favorites</a> (shift + f)
			</li>
			<li id='view_seen_button'>
				<a href='#' id='view_seen'>View Seen</a> (shift + q)
			</li>
			<li id='view_unseen_button'>
				<a href='#' id='view_unseen'>View Unseen</a> (shift + w)
			</li>
			<li id='view_read_button'>
				<a href='#' id='view_read'>View Read</a> (shift + q)
			</li>
			<li id='view_unread_button'>
				<a href='#' id='view_unread'>View Unread</a> (shift + w)
			</li>
			<li id='view_archive_button'>
				<a href='#' id='view_archive'>View Archive</a> (shift + c)
			</li>
			<li id='view_trash_button'>
				<a href='#' id='view_trash'>View Trash</a> (shift + x)
			</li>


			<li id='reload_button'>
				<a href='#' class='refresh_results'>Refresh</a> (z)
			</li>
			<li id='select_button'>
				<a href='#' id='select'>Select</a> (i)
			</li>
			<li id='deselect_button'>
				<a href='#' id='deselect'>Deselect</a> (o)
			</li>			
			<li id='delete_button'>
				<a href='#' id='delete'>Trash</a> (x)
			</li>
			<li id='archive_items_button'>
				<a href='#' id='archive'>Archive</a> (c)
			</li>
			<li id='unarchive_items_button'>
				<a href='#' id='unarchive'>Unarchive</a> (v)
			</li>
			<li id='favorite_button'>
				<a href='#' id='favorite'>Favorite</a> (f)
			</li>
			<li id='unfavorite_button'>
				<a href='#' id='unfavorite'>Unfavorite</a> (g)
			</li>
			<li id='read_items_button'>
				<a href='#' id='read'>Read</a> (e)
			</li>
			<li id='read_items_button'>
				<a href='#' id='preview_item'>Preview</a> (e)
			</li>
			<li id='read_items_button'>
				<a href='#' id='close_item_preview'>Close preview</a> (e)
			</li>			
			<li id='read_items_button'>
				<a href='#' id='read'>Enter Cursor Mode</a> (space)
			</li>
			<li id='read_items_button'>
				<a href='#' id='read'>Normal Mode</a> (esc)
			</li>
			<li id='mark_read_button'>
				<a href='#' id='mark_read'>Mark As Read</a> (e)
			</li>
			<li id='mark_unread_button'>
				<a href='#' id='mark_unread'>Mark As Unread</a> (r)
			</li>
			<li id='mark_seen_button'>
				<a href='#' id='mark_seen'>Mark As Seen</a> (q)
			</li>
			<li id='mark_unseen_button'>
				<a href='#' id='mark_unseen'>Mark As Unseen</a> (w)
			</li>
			
			<li id='select_all_button'>
				<a href='#' id='select_all'>Select All</a> (sa)
			</li>
			<li id='select_none_button'>
				<a href='#' id='select_none'>Select None</a> (sx)
			</li>
			<li id='select_inverse_button'>
				<a href='#' id='select_inverse'>Select Inverse</a> (sz)
			</li>

			<li id='select_seen_button'>
				<a href='#' id='select_favorites'>Select Favorites</a> (sf)
			</li>
			<li id='deselect_seen_button'>
				<a href='#' id='deselect_favorites'>Deselect Favorites</a> (df)
			</li>
			<li id='select_seen_button'>
				<a href='#' id='select_unfavorites'>Select Unfavorites</a> (sg)
			</li>
			<li id='deselect_seen_button'>
				<a href='#' id='deselect_unfavorites'>Deselect Unfavorites</a> (dg)
			</li>
			
			<li id='select_archived_button'>
				<a href='#' id='select_archived'>Select Archived</a> (sc)
			</li>		
			<li id='deselect_archived_button'>
				<a href='#' id='deselect_archived'>Deselect Archived</a> (dc)
			</li>			
			<li id='select_unarchived_button'>
				<a href='#' id='select_unarchived'>Select Unarchived</a> (sv)
			</li>		
			<li id='deselect_unarchived_button'>
				<a href='#' id='deselect_unarchived'>Deselect Unarchived</a> (dv)
			</li>

			<li id='select_read_button'>
				<a href='#' id='select_read'>Select Read</a> (se)
			</li>		
			<li id='deselect_read_button'>
				<a href='#' id='deselect_read'>Deselect Read</a> (de)
			</li>			
			<li id='select_unread_button'>
				<a href='#' id='select_unread'>Select Unread</a> (sr)
			</li>		
			<li id='deselect_unread_button'>
				<a href='#' id='deselect_unread'>Deselect Unread</a> (dr)
			</li>

			<li id='select_seen_button'>
				<a href='#' id='select_seen'>Select Seen</a> (sq)
			</li>
			<li id='deselect_seen_button'>
				<a href='#' id='deselect_seen'>Deselect Seen</a> (dq)
			</li>
			<li id='select_seen_button'>
				<a href='#' id='select_unseen'>Select Unseen</a> (sw)
			</li>
			<li id='deselect_seen_button'>
				<a href='#' id='deselect_unseen'>Deselect Unseen</a> (dw)
			</li>

			<li id='cursor_up_button'>
				<a href='#' id='cursor_up'>Cursor Up</a> (k)
			</li>
			<li id='cursor_down_button'>
				<a href='#' id='cursor_down'>Cursor Down</a> (h)
			</li>
			<li id='cursor_left_button'>
				<a href='#' id='cursor_left'>Cursor Left</a> (h)
			</li>
			<li id='cursor_right_button'>
				<a href='#' id='cursor_right'>Cursor Right</a> (l)
			</li>

			<li id='show_commands_button'>
				<a href='#' id='show_commands'>Show Commands </a> (/)
			</li>
		
			<li id='hide_commands_button'>
				<a href='#' id='hide_commands'>Hide Commands </a> (/)
			</li>
		
		</ul>


	<div id='console_wrapper'>
		<div id='console'></div>
		<div id='console_controls'>
			<div id='console_close_button'>
				<img src='http://buleys.com/images/icons/fugue-shadowless/cross-button.png'/></div>
			</div>
		</div>
	</div>

	<div id='main'>
	</div>
	<div id='right'>
		<ul id='results'></ul>
	</div>
	
	<div id='overlay'></div>
	<div id='help_box'>
		<a href="#" id="dogethelpbox" class="getinbox"><img src="http://buleys.com/images/icons/fugue-shadowless/question.png"></a>
	</div>
	<div id='mini_inbox_box' class='empty_inbox'>
		<a href="#" id="get_inbox" class="getinbox empty_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox.png"></a>
	</div>


</body>

<script type="text/javascript">

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-20447741-1']);
_gaq.push(['_setDomainName', '.buleys.com']);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

</script>
<script type="text/javascript" src="/js/binding.js"></script>
<script type="text/javascript" src="/js/md5.js"></script>
<script type="text/javascript" src="/js/isotope.js"></script>

</html>