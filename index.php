<!-- This code is copyright, in all of its sloppy glory, by its shameless author Taylor Buley --><?php
header('HTTP/1.0 200 OK');
?>
<html>
	<head>
		<title>Buley's</title>
		<link rel="stylesheet" href="/css/style.css">
		<script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>


	</head>
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
		<script type="text/javascript" src="/js/combined.js"></script>

</html>