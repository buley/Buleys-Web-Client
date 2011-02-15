<!-- This code is copyright, in all of its sloppy glory, by its shameless author Taylor Buley --><?php
header('HTTP/1.0 200 OK');
#ini_set('user_agent', 'Buleys.com');
$uri_path = $_SERVER['REQUEST_URI'];
$pieces = explode("/",trim($uri_path,"/"));
$typeID = preg_replace("/[^a-zA-Z0-9\s_]/", "", $pieces[0]);
if(empty($typeID)) { $typeID = "home"; }
$itemID = preg_replace("/[^a-zA-Z0-9\s_]/", "", $pieces[1]);

$pageID = preg_replace("/[^a-zA-Z0-9\s_]/", "", $pieces[2]);
if(empty($pageID)) { $pageID = ""; }

//next todos: vote up/downs
?>
<html>
<head>
<title>Buley's</title>
<script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
<script type="text/javascript">
var checker;
	/*
	items - all items
	status - read, unread, favorited
	 -> [key] id (URL)
	 -> status (unread/read/favorited)
	 	--> NOTE: favorited implies read; no entries implies unread
	 	--> users can mark as 'unread'
	 
	votes - 
	 -> [key] id (URL)
	 -> [key] type (type e.g. company)
	 -> [key] slug (slug e.g. aapl)
	 -> [key] vote (1, -1)
	 
	 social - 
	  -> [key] id (URL)
	  -> source (twitter/reddit/facebook, etc.)
	  -> type (friend_mention, mention, self_mention)
	*/

	if ('webkitIndexedDB' in window) {
	  window.indexedDB = window.webkitIndexedDB;
	  window.IDBTransaction = window.webkitIDBTransaction;
	  window.IDBKeyRange = window.webkitIDBKeyRange;
	} else if ('mozIndexedDB' in window) {
	  window.indexedDB = window.mozIndexedDB;
	}
	//////console.log("Supported? ", typeof window['indexedDB'] );
	
	var Buleys = {};
	Buleys.db = {};
	Buleys.queues = {};
	Buleys.settings = {};
	Buleys.profile = {};
	Buleys.mouse = {};
	Buleys.shortcuts = {};
	Buleys.history = {};
	Buleys.view = {};
	
	Buleys.debug = {};
	Buleys.debug.database = false;
	Buleys.debug.ajax = false;
	Buleys.debug.items = false;
	

	//default settings
	Buleys.settings.mini_inbox_topic_count = 5;
	
	var slug = <?php echo json_encode($itemID); ?>;
	var type = <?php echo json_encode($typeID); ?>;
	var page = <?php echo json_encode($pageID); ?>;
	var session_token = '';
	var debug;
	Buleys.shortcuts.s_depressed = false;
	Buleys.shortcuts.d_depressed = false;
	Buleys.shortcuts.shift_depressed = false;
	Buleys.settings.crawl_speed = 10000;
	Buleys.settings.crawl_deincrement = (2/4);
	Buleys.settings.crawl_increment = (1/5);
	Buleys.settings.crawl_max = 6000000;
	Buleys.settings.crawl_min = 10000;
	
	Buleys.queues.pending_crawls = [];
	Buleys.queues.new_items = {};

	Buleys.mouse.mouse_y = 0;
	Buleys.mouse.mouse_x = 0;
	Buleys.mouse.mouse_y_snapshot = 0;
	Buleys.mouse.mouse_x_snapshot = 0;

	function set_page_vars() {
	
		console.log( "Setting page vars: ", location.pathname );
		
		var string_for_split = location.pathname;
		string_for_split = string_for_split.replace(/^\//,"");
    	string_for_split = string_for_split.replace(/\/$/,"");
		
		var splitted = string_for_split.split("/");
			Buleys.view.type = splitted[0];
			Buleys.view.slug = splitted[1];
			Buleys.view.page = splitted[2];
	
	}
	
	function load_current_page() {
	
		set_page_vars();
		console.log("load_current_page(): ",Buleys.view.type, Buleys.view.slug, Buleys.view.page);

		
			if ( Buleys.view.type == "account"  ) {
				
				//
				get_account();

			} else if ( Buleys.view.type == "register"  ) {
				
				//
				get_registration();

			} else if ( Buleys.view.type == "confirm"  ) {
				
				//
				get_confirmation();

			} else if ( Buleys.view.type == "favorites" || Buleys.view.page == "favorites" || Buleys.view.page == "favs"  ) {
				
				//
				get_favorites(Buleys.view.type,Buleys.view.slug);

			}  else if ( Buleys.view.type == "archive" || Buleys.view.page == "archive" || Buleys.view.page == "archived" ) {
			
				//
				get_archived(Buleys.view.type,Buleys.view.slug);
			
			}  else if ( Buleys.view.type == "trash" || Buleys.view.page == "trash" || Buleys.view.page == "trashed" || Buleys.view.page == "deleted" ) {
			
				//
				get_deleted(Buleys.view.type,Buleys.view.slug);
			
			}  else if ( Buleys.view.type == "read" || Buleys.view.page == "read" ) {
			
				//
				get_read(Buleys.view.type,Buleys.view.slug,null,null,false);
			
			}  else if ( Buleys.view.type == "unread" || Buleys.view.page == "unread" ) {
			
				//
				get_read(Buleys.view.type,Buleys.view.slug,null,null,true);
			
			}  else if ( Buleys.view.type == "seen" || Buleys.view.page == "seen" ) {
			
				//
				get_seen(Buleys.view.type,Buleys.view.slug,null,null,false);
			
			}  else if ( Buleys.view.type == "unseen" || Buleys.view.page == "unseen" ) {
			
				//
				get_seen(Buleys.view.type,Buleys.view.slug,null,null,true);
			
			}  else if( typeof Buleys.view.page == "undefined" || Buleys.view.page == "" || Buleys.view.page == "home" || Buleys.view.page == "index" ) {
			
				//
				get_items(Buleys.view.type,Buleys.view.slug);
			
			} else  {
			
				get_items(Buleys.view.type,Buleys.view.slug);
			
			}

	
	}
	
	function clear_page() {
	
		jQuery("#results").fadeOut().html('').fadeIn();
			
	}
	
	function reload_results() {
		//
		clear_page();
		//
		load_current_page();
	}
	
	$(document).ready(function () {
		
		set_page_vars();
		//
		send_to_console("Loading...");
	
	
		//get_item("http://www.readwriteweb.com/archives/us_announces_120000_ipad_users_had_data_stolen_att_hack.php");
		open_database();

		$('#dologin').live('click', function(event) {
       		event.preventDefault();
		        $('#dologin').remove();
		        $('#login_box').append('<div id="minimize_login_controls"><a href="#" id="dologinboxminimize" class="loginboxminimizelink"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-in.png"></a></div><div id="login_form"><a href="#" id="doregistration" class="registrationlink">Register</a> or Login:<br/><input id="email" type="text" value="your@email.here" name="email" class="defaulttext" /><br/><input id="password"  class="defaulttext" type="password" value="p4s5w0rd" name="password" /></div><div id="login_buttons"><a href="#" id="doresetpassword" class="resetpasswordlink">Reset Password</a><br/><br/><a href="#" id="dologinsubmit" class="submitloginform">Login</a></div></div>');
		    });
    
    	$('a#get_inbox').live('click', function(event) {
       		event.preventDefault();
       		//console.log("#get_inbox was clicked");
		        $('#mini_inbox_box').html('<div id="mini_inbox_wrapper"><div id="minimize_mini_inbox_controls"><a href="#" id="minimize_inbox"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div><ul id="mini_inbox_list"><li>Loading...</li></ul></div>');
		       add_topics_to_mini_inbox();
		       //<br/><br/><a href="#" class="mini_box_icon" id="go_to_main_inbox"><img src="/images/icons/fugue-shadowless/inbox--arrow.png"></a>
		    });
		    
		    
		    
	     $('#minimize_inbox').live('click', function(event) {
        event.preventDefault();
        if($('#mini_inbox_box').hasClass('waiting_inbox')) {
           $('#mini_inbox_box').html('<a href="#" id="get_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox-document.png"></a>');
        } else {
        $('#mini_inbox_box').html('<a href="#" id="get_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox.png"></a>');
        }
    });


     $('#dologinboxminimize').live('click', function(event) {
        event.preventDefault();
        
        $('#login_box').html('<a href="#" id="dologin" class="getloginform"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-out.png"></a>');
    });
    

     $('#show_commands').live('click', function(event) {
        event.preventDefault();
        
        $('#result_controls').show();
    });    
    //
    
     $('#hide_commands').live('click', function(event) {
        event.preventDefault();
        $('#result_controls').hide();
    });    
    // 
  
  $('html').live('keyup', function (e) {
   if ( e.keyCode == 68 ) { 
   	Buleys.shortcuts.d_depressed = false;
   
   } else if ( e.keyCode == 83 ) { 
   	Buleys.shortcuts.s_depressed = false;
   
   }  else if ( e.keyCode == 16 ) { 
   	Buleys.shortcuts.shift_depressed = false;
   //spacebar is 32
   
   //Buleys.shortcuts.shift_depressed
   
   //h
   } else if ( e.keyCode == 72 ) {

    	if(Buleys.shortcuts.s_depressed) {
    	} else if(Buleys.shortcuts.d_depressed) {
    	} else if(Buleys.shortcuts.shift_depressed) {
        	$('#view_index').click();
    	} else {
	      	$('#close_item_preview').click();
    	}

   //l
    }  else if ( e.keyCode == 76 ) {

    	if(Buleys.shortcuts.s_depressed) {
    	} else if(Buleys.shortcuts.d_depressed) {
    	} else if(Buleys.shortcuts.shift_depressed) {
    	    	$('#view_home').click();
    	} else {
    		$('#preview_item').click();
    	
	    	if( jQuery('.cursor').length > 0) {
	    		alert( jQuery('.cursor').text() );
	    	}
	    	
    	}

   //n
    }    else if ( e.keyCode == 78 ) {
    	$('#preview_item').click();
		if( jQuery('.selected').length > 0) {
    		jQuery('#results li.selected:first').addClass('cursor');
    	} else {
    		jQuery('#results li:first').addClass('cursor');
    	}
    	

    } else if ( e.keyCode == 74 ) {

    	if( jQuery('.cursor').next().length > 0) {
    		jQuery('.cursor').removeClass('cursor').next().addClass('cursor');
    	} else {
    		jQuery('.cursor').removeClass('cursor');
    		jQuery('#results li:first').addClass('cursor');
    	}
    	
    } else if ( e.keyCode == 75 ) {
    	
    	if( jQuery('.cursor').prev().length > 0) {
    		jQuery('.cursor').removeClass('cursor').prev().addClass('cursor');
    	} else {
    		jQuery('.cursor').removeClass('cursor');
    		jQuery('#results li:last').addClass('cursor');
    	}
    	
    //esc is 27
    } else if ( e.keyCode == 27 ) {
    	jQuery('.cursor').removeClass('cursor');
      	$('#close_all').click();
  
    //m
    } else if ( e.keyCode == 77 ) {
    	jQuery('.cursor').removeClass('cursor');
    
    //backspace/delete
    }  else if ( e.keyCode == 219 ) {
    	$('#preview_item').click();
     // e
    }  else if ( e.keyCode == 221 ) {
      	$('#close_item_preview').click();
    
    //single quote
    } else if ( e.keyCode == 89 ) {
    		$('#show_commands').click();
    
        // u
    }  else if ( e.keyCode == 85 ) {
    		$('#hide_commands').click();
    
        // a
    }  else if ( e.keyCode == 65 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_all').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#select_none').click();
    	} else {
    	}
    	
    // r
    } else if ( e.keyCode == 82 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_unread').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_unread').click();
    	} else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_unread').click();
    	} else {
    		$('#mark_unread').click();
    	}
    
    // enter
    } else if ( e.keyCode == 13 ) {
 
    		//$('#read').click();
     // p
    } else if ( e.keyCode == 73 ) {
    		$('#select').click();
     // e
    } else if ( e.keyCode == 79 ) {
    		$('#deselect').click();
     // e
    }   
    
    else if ( e.keyCode == 69 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_read').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_read').click();
    	}  else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_read').click();
    	} else {
    		$('#mark_read').click();
    	}   	
    // x
    } else if ( e.keyCode == 88 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_none').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    	} else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_trash').click();
    	} else {
    		$('#delete').click();
    	}
    	
     // c
    } else if ( e.keyCode == 67 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_archived').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_archived').click();
    	} else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_archive').click();
    	} else {
    		$('#archive').click();
    	}
     // v
    } else if ( e.keyCode == 86 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_unarchived').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_unarchived').click();
    	} else {
    		$('#unarchive').click();
    	}
      // f
    } else if ( e.keyCode == 70 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_favorites').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_favorites').click();
    	} else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_favorites').click();
    	} else {
    		$('#favorite').click();
    	}
     // v
    } else if ( e.keyCode == 71 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_unfavorite').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_unfavorite').click();
    	} else {
    		$('#unfavorite').click();
    	} 
    	//q   	    	   	
    } else if ( e.keyCode == 81 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_seen').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_seen').click();
    	} else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_seen').click();
    	} else {
    		$('#mark_seen').click();
    	}
     // w
    } else if ( e.keyCode == 87 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_unseen').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    		$('#deselect_unseen').click();
    	}  else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_unseen').click();
    	} else {
    		$('#mark_unseen').click();
    	}  	
    // z
    }else if ( e.keyCode == 90 ) {
    	
    	if(Buleys.shortcuts.s_depressed) {
    		$('#select_inverse').click();
    	} else if(Buleys.shortcuts.d_depressed) {
    	} else if(Buleys.shortcuts.shift_depressed) {
    		$('#view_index').click();
    	} else {
    		$('#refresh').click();
    	}  	
    	//i
    } else if ( e.keyCode == 73 ) {
    	$('#deselect').click();
    	//o
    } else if ( e.keyCode == 79 ) {

    	$('#select').click();
    }
    
   
    
    //$('li.third-item').next()
    
});


 $('html').live('keydown', function (e) {
   if ( e.keyCode == 68 ) { 
   	Buleys.shortcuts.d_depressed = true;
   
   } else if ( e.keyCode == 83 ) { 
   	Buleys.shortcuts.s_depressed = true;
   
   }  else if ( e.keyCode == 16 ) { 
   	Buleys.shortcuts.shift_depressed = true;
   
   }
    
    //$('li.third-item').next()
    
});



		$(window).bind("popstate", function(e) {
		    console.log( location.pathname );
		    reload_results();
		});

        $('#view_seen').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_seen clicked");
			//implies typeof page != 'undefined' && typeof type != 'undefined' && typeof slug != 'undefined'
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/seen";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/seen";
			} else {
				urlString = "http://buleys.com/seen";
			}
			history.pushState(stateObj, "view_seen", urlString);
			reload_results();
		}); 

        $('#view_unseen').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_unseen clicked")
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/unseen";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/unseen";
			} else {
				urlString = "http://buleys.com/unseen";
			}
			history.pushState(stateObj, "view_unseen", urlString);
			reload_results();
		});     
		
         $('#view_read').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_read clicked")
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/read";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/read";
			} else {
				urlString = "http://buleys.com/read";
			}
			history.pushState(stateObj, "view_read", urlString);
			reload_results();
		}); 

        $('#view_unread').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_unread clicked")
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/unread";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/unread";
			} else {
				urlString = "http://buleys.com/unread";
			}
			history.pushState(stateObj, "view_unread", urlString);
			reload_results();
		});     
       
        $('#view_trash').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_trash clicked")
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/trash";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/trash";
			} else {
				urlString = "http://buleys.com/trash";
			}
			history.pushState(stateObj, "view_trash", urlString);
			reload_results();
		}); 

        $('#view_archive').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_archive clicked")
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/archive";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/archive";
			} else {
				urlString = "http://buleys.com/archive";
			}
			history.pushState(stateObj, "view_archive", urlString);
			reload_results();
		});  

        $('#view_favorites').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_favorites clicked")
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof page != 'undefined' && page != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/favorites";
			} else if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/favorites";
			} else {
				urlString = "http://buleys.com/favorites";
			}
			history.pushState(stateObj, "view_favorites", urlString);
			reload_results();
		});  

        $('#view_index').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_index clicked");
			jQuery("#page_meta").html('');
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			history.pushState(stateObj, "view_index", "http://buleys.com/");
			reload_results();
		});
        $('#view_home').live('click', function(event) {
	        event.preventDefault();
		    console.log( location.pathname );
			console.log("view_home clicked");
			jQuery("#page_meta").html('');
			var stateObj = { "page":page,"slug":slug,"type":type,"time":new Date().getTime() };
			var urlString = '';
			if(typeof slug != 'undefined' && slug != "") {
				urlString = "http://buleys.com/"+type+"/"+slug+"/";
			} else if(typeof type != 'undefined' && type != "") {
				urlString = "http://buleys.com/"+type+"/";
			}
			history.pushState(stateObj, "view_home",urlString);
			reload_results();
		});    
    
 		$('#dologinsubmit').live('click', function(event) {
        	event.preventDefault();
			////////console.log("Requesting login");
	        if( $('[name="password"]').val()  ) {
				////////console.log("Requesting login for email " + $('[name="email"]'));
				request_login( $('[name="email"]').val(), $('[name="password"]').val() );
			} else {
				////////console.log("No password");
			}
			
    	});
       
    
    
			
				

	    $('.unfav_link').live('click', function(event) {
	        //alert( $(this).parent().parent().parent().children('.headline').children('a').attr('href') );
	        event.preventDefault();
	        
	        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
	        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').removeClass('unfav_link').addClass('fav_link');

	        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.unfav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
	        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
	        
	        
	        remove_item_from_favorites_database($(this).attr('href'), slug, type);
	        post_feedback('unstar', $(this).attr('href'), slug, type);
	        send_to_console("<p>item removed from favorites</p>");
	        setTimeout('fade_console_message()', 1000);
	    });   
	    
	     $('#favorite').live('click', function(event) {
	        //alert( $(this).parent().parent().parent().children('.headline').children('a').attr('href') );
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	


	        jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");

	        jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	        jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').removeClass('unfav_link');

 
	        jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.fav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
	        jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.fav_link').removeClass('fav_link').addClass('unfav_link');
	        

			        add_item_to_favorites_database($(item_to_mark).children('a').attr('href'), slug, type);
			        post_feedback('star',$(item_to_mark).children('a').attr('href'), slug, type);
			        send_to_console("<p>item favorited</p>");
			        setTimeout('fade_console_message()', 1000);


		        }); 
			
			} else {
	        
	        jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");

	        jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	        jQuery("#" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').removeClass('unfav_link');

 
	        jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.fav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
	        jQuery("#favorite_" + jQuery('.cursor a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.fav_link').removeClass('fav_link').addClass('unfav_link');
	        
	        
	        add_item_to_favorites_database($('.cursor a').attr('href'), slug, type);
	        post_feedback('star', $('.cursor a').attr('href'), slug, type);
	        send_to_console("<p>item favorited</p>");
	        setTimeout('fade_console_message()', 1000);

				
			}
			
	    });  
	    
		$('#unfavorite').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {

	        
	        jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
	        jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	        jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').removeClass('unfav_link');

	        jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.unfav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
	        jQuery("#favorite_" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
	        
	   	        	remove_item_from_favorites_database($(item_to_mark).children('a').attr('href'), slug, type);
			        post_feedback('unstar', $(item_to_mark).children('a').attr('href'), slug, type);
			        send_to_console("<p>item removed from favorites</p>");
			        setTimeout('fade_console_message()', 1000);
		

		        	
		        }); 
			
			} else {
				
	        jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
	        jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	        jQuery("#" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').removeClass('unfav_link');

	        jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.unfav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star-empty.png");
	        jQuery("#favorite_" + jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.unfav_link').removeClass('unfav_link').addClass('fav_link');
	        		
			        
			        remove_item_from_favorites_database($('.cursor > a').attr('href'), slug, type);
			        post_feedback('unstar', $('.cursor > a').attr('href'), slug, type);
			        send_to_console("<p>item removed from favorites</p>");
			        setTimeout('fade_console_message()', 1000);
				
			}
	    }); 
		
		

	    $('.fav_link').live('click', function(event) {
	        event.preventDefault();

	        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");

	        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').parent().removeClass('unfavorited').addClass('favorited');
	        jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.favorite_status').children('a').removeClass('fav_link').addClass('unfav_link');;

 
	        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.fav_link').children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
	        jQuery("#favorite_" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") ).children('.fav_link').removeClass('fav_link').addClass('unfav_link');
	        
	        add_item_to_favorites_database($(this).attr('href'), slug, type);
	        post_feedback('star', $(this).attr('href'), slug, type);
	        send_to_console("<p>item favorited</p>");
	        setTimeout('fade_console_message()', 1000);
	    });

		//xxx
	    $('.close_item_preview').live('click', function(event) {
	        event.preventDefault();
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
		});

		//xxx
	    $('.sidebar_close_link').live('click', function(event) {
	        event.preventDefault();
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
		});

    	$('#close_all').live('click', function(event) {
	        event.preventDefault();
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
		});
	    
	    $('.mark_item_as_unread').live('click', function(event) {
	        event.preventDefault();
	        $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/star.png");
	        $(this).removeClass('unfav_link');
	        $(this).addClass('fav_link');
	        
	        //here
	        var item_to_work_from = jQuery("#" + jQuery(this).attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") );
	        
			////////console.log( item_to_work_from );
			if( item_to_work_from.hasClass('read') ) {
				item_to_work_from.removeClass('read');
				item_to_work_from.addClass('unread');
			}
			
	        remove_item_from_read_database($(this).attr('href'), slug, type);
	        send_to_console("<p>marked as unread</p>");
	        setTimeout('fade_console_message()', 1000);
	    });	    

	    $('#mark_all_items_as_read').live('click', function(event) {
	        event.preventDefault();
	        ////////console.log('marking ' + jQuery(".unread").length + "as read");
	        jQuery.each( jQuery(".unread"), function(k,item_to_mark) {
	        
	        	////////console.log("ITEM TO MARK: " + item_to_mark);
		        var item_to_work_from = jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") );
	        	if( item_to_work_from.hasClass('unread') ) {
					item_to_work_from.removeClass('unread');
					item_to_work_from.addClass('read');
				}
				
	        	mark_item_as_read( jQuery(item_to_mark).children('a').attr('href'), slug, type );
	        });
	        
	    });	    

	    $('#mark_seen').live('click', function(event) {
	        event.preventDefault();
	        
	        if( !is_in_cursor_mode() ) {
	        
		        ////////console.log('marking ' + jQuery(".unread").length + "as read");
		        jQuery.each( jQuery(".selected"), function(k,item_to_mark) {
		        
		        	////////console.log("ITEM TO MARK: " + item_to_mark);
					jQuery(item_to_mark).removeClass('unseen');
					jQuery(item_to_mark).addClass('seen');
					if(typeof jQuery(item_to_mark).attr('status') !== 'undefined') {
						jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unseen', '') ) );
					}
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' seen') );


					
		        	mark_item_as_seen( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        });
		        
	        } else {
					jQuery('.cursor').removeClass('seen');
					jQuery('.cursor').addClass('unseen');

					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' unseen') );
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' seen', '')) );


		        	mark_item_as_unseen( jQuery('.cursor').children('a').attr('href'), slug, type );
	        
	        }
	        
	    });	  

	    $('#mark_unseen').live('click', function(event) {
	        event.preventDefault();

	        if( !is_in_cursor_mode() ) {
	        
		        ////////console.log('marking ' + jQuery(".unread").length + "as read");
		        jQuery.each( jQuery(".selected"), function(k,item_to_mark) {
		        
					jQuery(item_to_mark).removeClass('seen');
					jQuery(item_to_mark).addClass('unseen');
					var pre_val =jQuery(item_to_mark).attr('status');
					if(typeof pre_val !== "undefined") {
					jQuery(item_to_mark).attr('status', pre_val.replace(' seen', '') );
					}
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' unseen') );

		        	mark_item_as_unseen( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        });
	        
	        } else {
					jQuery('.cursor').removeClass('seen');
					jQuery('.cursor').addClass('unseen');

					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' seen') );
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unseen', '')) );

		        	mark_item_as_unseen( jQuery('.cursor').children('a').attr('href'), slug, type );
	        
	        }
	        
	    });	  

	     $('#select_all').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('#results > li'), function(i,item_to_mark) {
	        	if(jQuery(item_to_mark).hasClass('selected')) {
	        	} else {
	        		jQuery(item_to_mark).addClass('selected');
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        	}
	        }); 
	    });
	    $('#select_none').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	jQuery(item_to_mark).removeClass('selected');
					jQuery(item_to_mark).attr('status', jQuery(item_to_mark).attr('status').replace(' selected', '') );
		        }); 
			
			} else {
				jQuery('.cursor').removeClass('selected');
				jQuery('.cursor').attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
			}
	    });
	    $('#select_inverse').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('#results li'), function(i,item_to_mark) {
		        	if( jQuery(item_to_mark).hasClass('selected') ) {
		        		jQuery(item_to_mark).removeClass('selected');

						jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );

		        	} else {
		        		jQuery(item_to_mark).addClass('selected');

						jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );

		        	}
		        }); 
		        
		    } else {
		    
			    if( jQuery('.cursor').hasClass('selected') ) {

	        		jQuery('.cursor').removeClass('selected');

					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' selected', '')) );


	        	} else {
	        		jQuery('.cursor').addClass('selected');

					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' selected') );

	        	}
	    
		    }
	    });
	    
	    $('#select_favorites').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.favorited'), function(i,item_to_mark) {
	        	if(jQuery(item_to_mark).hasClass('selected')) {
	        	
	        	} else {
	        		jQuery(item_to_mark).addClass('selected');
					
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        	
	        	}
	        }); 
	    });
	    
	      $('#deselect_seen').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.seen'), function(i,item_to_mark) {
	        	////////console.log(i);

	        	jQuery(item_to_mark).removeClass('selected');

				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );

	        }); 
	    });
	      $('#deselect_unseen').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unseen'), function(i,item_to_mark) {
	        	////////console.log(i);

	        	jQuery(item_to_mark).removeClass('selected');

				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );

	        }); 
	    });
	      $('#deselect_favorites').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.favorited'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });
	      $('#deselect_read').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.read'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });
	      $('#deselect_unread').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unread'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });
	      $('#deselect_archived').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.archived'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });	    
	      $('#deselect_unarchived').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unarchived'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });	  
	      $('#deselect_unseen').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unseen'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });
	      $('#deselect_unread').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unread'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });
	      $('#deselect_unarchived').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unarchived'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).removeClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
	        }); 
	    });	 
	    
	    
	      $('#select_seen').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.seen'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).addClass('selected');
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        }); 
	    });
	      $('#select_unseen').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unseen'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).addClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        }); 
	    });
	      $('#select_read').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.read'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).addClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        }); 
	    });
	      $('#select_unread').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unread'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).addClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        }); 
	    });
	      $('#select_archived').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.archived'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).addClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        }); 
	    });
	      $('#select_unarchived').live('click', function(event) {
	        event.preventDefault();
	        $.each( $('.unarchived'), function(i,item_to_mark) {
	        	////////console.log(i);
	        	jQuery(item_to_mark).addClass('selected');
				jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
	        }); 
	    });  
	    
	      $('#delete').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	delete_item( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        	jQuery(item_to_mark).remove();
		        }); 
		    } else {
		    
			    delete_item( jQuery('.cursor').children('a').attr('href'), slug, type );
				//xxx
				if( jQuery('.cursor').next().length > 0) {
		        	jQuery('.cursor').next().addClass('cursor').prev().remove();
		    	} else {
		    		jQuery('.cursor').remove();
		    		jQuery('#results li:first').addClass('cursor');
		    	}
		    	
		    }
	    });

	      $('#select').live('click', function(event) {
	        event.preventDefault();
	        if( is_in_cursor_mode() ) {
	        
		        $.each( $('.cursor'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	jQuery(item_to_mark).addClass('selected');
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
		        }); 
		    } else {

		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	jQuery(item_to_mark).addClass('selected');
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' selected') );
		        }); 


		    }
	    });

	      $('#deselect').live('click', function(event) {
	        event.preventDefault();
	        if( is_in_cursor_mode() ) {
	        
		        $.each( $('.cursor'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	jQuery(item_to_mark).removeClass('selected');
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
		        }); 
		    } else {

		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	jQuery(item_to_mark).removeClass('selected');
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' selected', '')) );
		        }); 

		    }
	    });

	      $('#archive').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	archive_item( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        	if(Buleys.view.page !== "favorites" && Buleys.view.page !== "archive") {
		        		jQuery(item_to_mark).remove();
		        	}
		        }); 
		        
			} else {
			
	        	archive_item( jQuery('.cursor').children('a').attr('href'), slug, type );
				//xxx
				if( jQuery('.cursor').next().length > 0) {
		        	jQuery('.cursor').next().addClass('cursor').prev().remove();
					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' cursor', '')) );
		    	} else {
		    		jQuery('.cursor').remove();
		    		jQuery('#results li:first').addClass('cursor');
					jQuery('#results li:first').attr('status', (jQuery(item_to_mark).attr('status').replace(' cursor', '')) );

		    	}
			
			}
	    });
	    
	    //            new_window = window.open(uri_string, click_window);
	      $('#read').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	var new_window = window.open(jQuery(item_to_mark).children('a').attr('href'), jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,""));
		        	mark_item_as_read( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        	jQuery(item_to_mark).addClass('read');
		        	jQuery(item_to_mark).removeClass('unread');

					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' read') );
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unread', '')) );
		        	
		        }); 
		        
			} else {
			
		        	var new_window = window.open(jQuery('.cursor > a').attr('href'), jQuery('.cursor > a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,""));
		        	mark_item_as_read( jQuery('.cursor > a').attr('href'), slug, type );
		        	jQuery('.cursor').addClass('read');
		        	jQuery('.cursor').removeClass('unread');

					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' read') );
					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' unread', '')) );
			
			}
	    });
	    
	    
	    
	    $('#unarchive').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	unarchive_item( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        	if(Buleys.view.page == "archive") {
		        		jQuery(item_to_mark).remove();
		        	}
		        }); 
			} else {

	        	unarchive_item( jQuery('.cursor').children('a').attr('href'), slug, type );
				jQuery('.cursor').removeClass('archived').addClass('.unarchived');
				if(Buleys.view.page == "archive") {
		        	jQuery('.cursor').remove();
		        }
							
			}
	    });
	    	    

	    
	     $('#mark_read').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(i);
		        	mark_item_as_read( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        	jQuery(item_to_mark).addClass('read');
		        	jQuery(item_to_mark).removeClass('unread');
					
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' read') );
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unread', '')) );
		        	
		        }); 
			} else {
			
					mark_item_as_read( jQuery('.cursor').children('a').attr('href'), slug, type );
		        	jQuery('.cursor').addClass('read');
		        	jQuery('.cursor').removeClass('unread');

					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' read') );
					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' unread', '')) );
			
			}
	    });

	     $('#mark_unread').live('click', function(event) {
	        event.preventDefault();
	        if( !is_in_cursor_mode() ) {
	
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	////////console.log(jQuery(item_to_mark).children('a').attr('href'));
		        	
		        	remove_item_from_read_database( jQuery(item_to_mark).children('a').attr('href'), slug, type );
		        	jQuery(item_to_mark).addClass('unread');
		        	jQuery(item_to_mark).removeClass('read');
		        	
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status') + ' read') );
					jQuery(item_to_mark).attr('status', (jQuery(item_to_mark).attr('status').replace(' unread', '')) );
		        	
		        }); 
		        
			} else {
		        	remove_item_from_read_database( jQuery('.cursor').children('a').attr('href'), slug, type );
		        	jQuery('.cursor').addClass('unread');
		        	jQuery('.cursor').removeClass('read');

					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status') + ' unread') );
					jQuery('.cursor').attr('status', (jQuery('.cursor').attr('status').replace(' read', '')) );
		
			}
	    });
        

	    $('#mark_all_items_as_unread').live('click', function(event) {
	        event.preventDefault();
	        ////////console.log('marking ' + jQuery(".read").length + " as unead");
	        jQuery.each( jQuery(".read"), function(k,item_to_mark) {
	        
		        var item_to_work_from = jQuery("#" + jQuery(item_to_mark).children('a').attr('href').replace(/[^a-zA-Z0-9-_]+/g,"") );
	        	if( item_to_work_from.hasClass('read') ) {
					item_to_work_from.removeClass('read');
					item_to_work_from.addClass('unread');
					jQuery(item_to_work_from).attr('status', (jQuery(item_to_mark).attr('status') + ' unread') );
					jQuery(item_to_work_from).attr('status', (jQuery(item_to_mark).attr('status').replace(' read', '')) );

				}

	        	remove_item_from_read_database( jQuery(item_to_mark).children('a').attr('href'), slug, type );
	        });

	jQuery("#logout").live("click", function(event) {
	
		account_logout();
	
	});


//login_box
	jQuery(".logout_link").live("click", function(event) {
	
		account_logout();
	
	});
	

	jQuery(".submitthelogin").live("click", function(event) {
		////////console.log("submit_login");
		//request_login( jQuery("#login_box password").val(), jQuery("#login_box email").val() );
	});






	jQuery('.defaulttext').live('click', function(event) {
		jQuery(this).val('');
		jQuery(this).removeClass('defaulttext');
	});
// Actions


	        
	    });	 	    
	    //		mark_item_as_read( url_to_preview, slug, type );

/*
		jQuery("#overlay .vote_up_category").remove();    
			jQuery("#overlay .vote_down_category").remove();    
			jQuery("#overlay .delete_category").remove(); 
*/
    $('.delete_category').live('click', function(event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        $(this).parent().parent().remove();
        remove_category_for_item(the_url.replace(/[^a-zA-Z0-9-_]+/g,""), the_type, the_slug);
        //$(this).parent().remove();
        if(!$(this).hasClass('voted')) {
            post_feedback('delete_category', the_url, the_type, the_slug);
        }
    });
    
    //unfollow_topic
    $('.follow_topic').live('click', function(event) {
	    event.preventDefault();
	    var the_key = $(this).attr('key');
	    var the_type = $(this).attr('type');
	    
	    if(typeof the_key == 'undefined') {
	    	the_key = slug;
	    } else {
	    	the_key = the_key;
	    }
	    if(typeof the_type == 'undefined' || the_type == '') {
	    	the_type = type;
	    } else {
	    	the_type = the_type;
	    }
	    
	    add_follow_if_doesnt_exist( the_type, the_key );
	    post_feedback('follow', '', the_key, the_type);
	    
	    $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/heart.png");
	    $(this).removeClass('follow_topic');
	    $(this).addClass('unfollow_topic');
	
    });
    $('.unfollow_topic').live('click', function(event) {
	    event.preventDefault();
	    var the_key = $(this).attr('key');
	    var the_type = $(this).attr('type');
	    
	    if(typeof the_key == 'undefined') {
	    	the_key = slug;
	    } else {
	    	the_key = the_key;
	    }
	    if(typeof the_type == 'undefined' || the_type == "") {
	    	the_type = type;
	    } else {
	    	the_type = the_type;
	    }
	    
	    remove_follow(the_type, the_key);
	    post_feedback('unfollow', '', the_key, the_type);
	    
	    $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/heart-empty.png");
	    $(this).removeClass('unfollow_topic');
	    $(this).addClass('follow_topic');
    });  
//

	$('.subscribe_topic').live('click', function(event) {
	    event.preventDefault();
	    var the_key = $(this).attr('key');
	    var the_type = $(this).attr('type');

	    if(typeof the_key == 'undefined') {
	    	the_key = slug;
	    } else {
	    	the_key = the_key;
	    }
	    if(typeof the_type == 'undefined' || the_type == "") {
	    	the_type = type;
	    } else {
	    	the_type = the_type;
	    }
	    add_subscription_if_doesnt_exist( the_type, the_key );
	    post_feedback('subscribe', "", the_key, the_type);
	    
	    $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/inbox-document.png");
	    $(this).removeClass('subscribe_topic');
	    $(this).addClass('unsubscribe_topic');
	});
	
	$('.unsubscribe_topic').live('click', function(event) {
	    event.preventDefault();
	    var the_key = $(this).attr('key');
	    var the_type = $(this).attr('type');

	    if(typeof the_key == 'undefined') {
	    	the_key = slug;
	    } else {
	    	the_key = the_key;
	    }
	    if(typeof the_type == 'undefined' || the_type == "") {
	    	the_type = type;
	    } else {
	    	the_type = the_type;
	    }
	    
	    remove_subscription( the_type, the_key );
	    post_feedback('subscribe', "", the_key, the_type);
	    
	    $(this).children('img').attr('src', "http://buleys.com/images/icons/fugue-shadowless/inbox.png");
	    $(this).removeClass('unsubscribe_topic');
	    $(this).addClass('subscribe_topic');
	});
    
    $('.vote_up_category').live('click', function(event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g,"") + the_type.toLowerCase() + the_slug.toLowerCase();
        
        add_or_update_vote(vote_key, 1);
        if(!$(this).hasClass('voted')) {
            post_feedback('category_upvote', the_url, the_type, the_slug);
        }
        $(this).addClass('voted');
    });
    $('.vote_down_category').live('click', function(event) {
        event.preventDefault();
        var the_url = $(this).attr('link');
        var the_type = $(this).attr('type');
        var the_slug = $(this).attr('slug');
        var vote_key = "";
        vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g,"") + the_type.toLowerCase() + the_slug.toLowerCase();
        add_or_update_vote(vote_key, -1);
        if(!$(this).hasClass('voted')) {
            post_feedback('category_downvote', the_url, the_type, the_slug);
        }
        $(this).addClass('voted');
    }); 
       
    $('.vote_up').live('click', function(event) {
        event.preventDefault();
        var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g,"");
        if( jQuery("#overlay_upvote_" + the_url).hasClass('vote') ) {
 
	        jQuery("#overlay_upvote_" + the_url).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-up-empty.png');
	        $('.vote').removeClass('vote');
	        $(this).parent().removeClass('voted');
	        post_feedback('item_remove_upvote', the_url, type, slug);
	        remove_vote(the_url);
 
        } else {
        
	        jQuery("#overlay_downvote_" + the_url).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-empty.png');
	        jQuery("#overlay_upvote_" + the_url).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-up.png');
	        $('.vote').removeClass('vote');
	        $(this).parent().addClass('voted');
	        $(this).addClass('vote');
	        
	        post_feedback('item_upvote', the_url, type, slug);
	        add_or_update_vote(the_url, 1);
        
        }
    });
    
    $('.vote_down').live('click', function(event) {
        event.preventDefault();
        var the_url = $(this).attr('link').replace(/[^a-zA-Z0-9-_]+/g,"");
        var the_url_slug = the_url.replace(/[^a-zA-Z0-9-_]+/g,"");
        
       if( jQuery("#overlay_downvote_" + the_url_slug).hasClass('vote') ) {
 
	        jQuery("#overlay_downvote_" + the_url_slug).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-empty.png');
	        $('.vote').removeClass('vote');
	        $(this).parent().removeClass('voted');

	        post_feedback('item_remove_downvote', the_url, type, slug);
	        remove_vote(the_url);
 
        } else {
        
	        jQuery("#overlay_downvote_" + the_url_slug).children('img').attr('src', '/images/icons/fugue-shadowless/thumb.png');
	        jQuery("#overlay_upvote_" + the_url_slug).children('img').attr('src', '/images/icons/fugue-shadowless/thumb-up-empty.png');

	        $('.vote').removeClass('vote');
	        $(this).parent().addClass('voted');
	        $(this).addClass('vote');
	        
	        post_feedback('item_downvote', the_url, type, slug);
	        add_or_update_vote(the_url, -1);
        
        }
 

    });

	    jQuery("#console_wrapper").stop(true).animate({
			opacity: 0,
		}, 0, function() {
		} );	
		    
	    jQuery("#overlay").stop(true).animate({
			opacity: 0,
		}, 0, function() {
		} ).html('');


	    $('#overlay .category').live('mouseenter', function(event) {
	        event.preventDefault();
	    	add_category_controls( jQuery(this) );    
	    });

	    $('#overlay .category').live('mouseleave', function(event) {
	        event.preventDefault();
			jQuery("#overlay .vote_up_category").remove();    
			jQuery("#overlay .vote_down_category").remove();    
			jQuery("#overlay .delete_category").remove();    
	    });
	    
	});
	//end document.ready (?)
	
	function load_profile_info() {
	    
	    var data_to_send;
        data_to_send = { "method":"get_user_attributes" };
	    
	    
	    $.post("/feedback/index.php", data_to_send, function(data) {
	        jQuery("#small_profile").show();
	        if(typeof data.display_name != "undefined" && data.display_name != null) {
	            jQuery("#small_profile").append("<div id='small_profile_image'><a href='/profile/'><img src='http://www.gravatar.com/avatar/" + data.email_hash + "?s=42'></a></div><div><div id='small_profile_display_name'><a href='/profile/'>" + data.display_name + "</a></div>" + "</div>");
	            jQuery.each(data, function (key,val) {
	            	add_or_update_setting(key, val);
	            });
	        }
	    },
	    dataType = "json");
	    
	}


	function post_feedback(event_type, item_url, context_string, context_type_string) {
	    var data_to_send;
        data_to_send = { "event":event_type,"item": item_url,"context":context_string,"type":context_type_string};
	    $.post("/feedback/index.php", data_to_send, function() {
	    
	    },
	    dataType = "json");
	}	
	
	function database_is_open(open_result) {
		////////console.log('database_is_open(): setting:' + open_result);
		Buleys.db = open_result;
		//////////console.log("add_or_update_setting(): name");
		//add_or_update_setting("name","Taylor");

		
		//get_settings();

		//load_all_settings_into_dom();
		//load_all_queues_into_dom();
		//setTimeout('do_work()', 10000);
		
//		fire_off_request();
		
//		load_profile_info();
		get_page_follow_status(type,slug);
		get_page_subscription_status(type,slug);
		get_page_topic_info(type,slug);
//		get_items(type,slug);

		load_current_page();


      var $container = $('#results');

      /*
      $container.isotope({
        itemSelector : 'li',
        getSortData : {
          published : function( $elem ) {
            return parseInt( $elem.attr('published-date') );
          },
          modified : function( $elem ) {
            return parseInt( $elem.attr('modified') );
          },
          name : function ( $elem ) {
            return $elem.text();
          }
        }
      });*/
      
 

  		
	}



//
    //Sure why not
    $('.headline a').live('click', function(event) {
        var related_cats = new Array();
        var related_tags = new Array();
        var uri_string =  $(this).attr('href');
        
        // Bound handler called.
        //event.preventDefault();
        
        //var data_to_send;
        data_to_send = { "event":"click","item": $(this).attr('href'),"page":slug};
        var data_to_send;
        data_to_send = { "event":"clickthrough","item":  $(this).attr('href'),"context":'<?php echo $itemID; ?>',"type":'<?php echo $typeID; ?>'};
        
        
        $.post("/feedback/index.php", data_to_send,
        dataType = "json",
        function(data){
            new_window = window.open(uri_string, click_window);
            //log.debug("open" + $(this).attr('href'));
        });
    });

$('.sidebar_headline a').live('click', function(event) {
    var related_cats = new Array();
    var related_tags = new Array();
    var uri_string =  $(this).attr('href');
    
    // Bound handler called.
    //event.preventDefault();
    var data_to_send;
        data_to_send = { "event":"click","item":  $(this).attr('href'),"context":'<?php echo $itemID; ?>',"type":'<?php echo $typeID; ?>'};
    
    $.post("/feedback/index.php", data_to_send,
    dataType = "json",
    function(data){
        new_window = window.open(uri_string, click_window);
        //log.debug("open" + $(this).attr('href'));
    });
    
});

function show_loading() {
    
    $("#index").html("<div class='loading'>&nbsp;</div>");
    
}
function hide_loading() {
    
    $("#index .loading").hide();
    
}


function is_in_cursor_mode() {
	if( jQuery('.cursor').length > 0 ) {
		return true;
	} else {
		return false;
	}
}

//
	
	function get_data_for_items(items) {
		$.each(items, function(i,item){
			////////console.log(item.link);
			get_item(item.link);
			
		});
	}
	
	function fire_off_request() {

	
    var data_to_send;
        data_to_send = { "method":"get_users_personal_collection" };
	var the_url;
	if( typeof type == "undefined" || type == "" ) {
		the_url = "/feedback/index.php";
	} else {
		the_url = "http://static.buleys.com/js/collections/<?php echo "$typeID/$itemID.js";?>";
	}
		$.ajax({
			//url: "/feedback/index.php",
			url: the_url,
			dataType: 'jsonp',
			data: data_to_send,
			jsonpCallback: 'load_collection',
			error: function() {
				$("#index").html("<li class='item'>No results.</li>");
			},
			success: function(data){
				slug = data.info.key;
				type = data.info.type;
				
				////////console.log( data.items );
				populate_and_maybe_setup_indexeddbs( data.items );
				//get_data_for_items( data.items );
				add_items(data.items, data.info.type, data.info.key);
				load_page_title_info(data.info);
				add_or_update_topic( ( data.info.type + "_" + data.info.key ) , data.info  );
			}
		});
	}

	function load_page() {
	
		//
		get_items(type, slug);
   
	}


	function new_item_transaction(){
		try {
			var transaction = Buleys.db.transaction(["items"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				//////////console.log("Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				//////////console.log("Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("items");
			//////////console.log("New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_item_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			
			////////console.log("new_item_transaction(): Create object store; db: " + Buleys.db);
			//Create object store
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("items", {
					"keyPath": "link"
				}, false);

				Buleys.objectStore.createIndex("author", "author", { unique: false });
				Buleys.objectStore.createIndex("published_date", "published_date", { unique: false });
				Buleys.objectStore.createIndex("index_date", "index_date", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_item_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_item_transaction(): Could not set the version, so cannot create database", e);
			};
			
		};
	}

	function new_categories_transaction(){
		try {
			var transaction = Buleys.db.transaction(["categories"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				//////////console.log("Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				//////////console.log("Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("categories");
			//////////console.log("New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_categories_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);

		////////console.log("new_categories_transaction(): Create object store ver:" + parseInt(Buleys.db.version));
			//Create object store
			var ver_to_set = 0;
			if(! (Buleys.db.version > 0) ) {
				ver_to_set = ver_to_set + 1;
			} else {
				ver_to_set = 1;
			}
			var request = Buleys.db.setVersion( ver_to_set );
			request.onsuccess = function(e){
				////////console.log("Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				
				Buleys.objectStore = Buleys.db.createObjectStore("categories", {
					"keyPath": "id"
				}, true);

				Buleys.objectStore.createIndex( "link", "link", { unique: false } );
				Buleys.objectStore.createIndex( "slug", "slug", { unique: false } );
				Buleys.objectStore.createIndex( "type", "type", { unique: false } );
				Buleys.objectStore.createIndex( "modified", "modified", { unique: false } );
				
				////////console.log("new_categories_transaction(): Object store created: ", Buleys.CategoriesObjectStore);
				
			};
			request.onerror = function(e){
				////////console.log("new_categories_transaction(): Could not set the version, so cannot create database", e);
			};
			
		};
	}


	function new_favorite_transaction(){
		try {
			var transaction = Buleys.db.transaction(["favorites"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_favorite_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_favorite_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("favorites");
			////////console.log("new_favorite_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_favorite_transaction(): Could not open objectStore. You may have to create it first");
			//////////console.log(e);
			////////console.log("new_favorite_transaction(): Create object store; current ver:" + Buleys.db.version);
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_status_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("favorites", {
					"keyPath": "item_link"
				}, true);

				Buleys.objectStore.createIndex("topic_slug", "topic_slug", { unique: false });
				Buleys.objectStore.createIndex("topic_type", "topic_type", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_favorite_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_favorite_transaction(): Could not set the version, so cannot create database", e);
			};

		};
	}

	function new_status_transaction(){
		try {
			var transaction = Buleys.db.transaction(["status"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_status_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_status_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("status");
			////////console.log("new_status_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_status_transaction(): Could not open objectStore. You may have to create it first");
			//////////console.log(e);
			////////console.log("new_status_transaction(): Create object store; current ver:" + Buleys.db.version);
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_status_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("status", {
					"keyPath": "link"
				}, true);

				Buleys.objectStore.createIndex("topic_slug", "topic_slug", { unique: false });
				Buleys.objectStore.createIndex("topic_type", "topic_type", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_status_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_status_transaction(): Could not set the version, so cannot create database", e);
			};

		};
	}

	function new_deleted_transaction(){
		try {
			var transaction = Buleys.db.transaction(["deleted"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_deleted_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_deleted_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("deleted");
			////////console.log("new_deleted_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_deleted_transaction(): Could not open objectStore. You may have to create it first");
			//////////console.log(e);
			////////console.log("new_deleted_transaction(): Create object store; current ver:" + Buleys.db.version);
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_deleted_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("deleted", {
					"keyPath": "link"
				}, true);

				Buleys.objectStore.createIndex("topic_slug", "topic_slug", { unique: false });
				Buleys.objectStore.createIndex("topic_type", "topic_type", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_deleted_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_deleted_transaction(): Could not set the version, so cannot create database", e);
			};

		};
	}

	function new_seen_transaction(){
		try {
			var transaction = Buleys.db.transaction(["seen"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_seen_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_seen_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("seen");
			////////console.log("new_seen_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_seen_transaction(): Could not open objectStore. You may have to create it first");
			//////////console.log(e);
			////////console.log("new_seen_transaction(): Create object store; current ver:" + Buleys.db.version);
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_seen_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("seen", {
					"keyPath": "link"
				}, true);

				Buleys.objectStore.createIndex("topic_slug", "topic_slug", { unique: false });
				Buleys.objectStore.createIndex("topic_type", "topic_type", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_seen_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_seen_transaction(): Could not set the version, so cannot create database", e);
			};

		};
	}

	function new_archived_transaction(){
		try {
			var transaction = Buleys.db.transaction(["archive"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_archived_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_archived_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("archive");
			////////console.log("new_archived_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_archived_transaction(): Could not open objectStore. You may have to create it first");
			//////////console.log(e);
			////////console.log("new_archived_transaction(): Create object store; current ver:" + Buleys.db.version);
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_archived_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("archive", {
					"keyPath": "link"
				}, true);

				Buleys.objectStore.createIndex("topic_slug", "topic_slug", { unique: false });
				Buleys.objectStore.createIndex("topic_type", "topic_type", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_archived_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_archived_transaction(): Could not set the version, so cannot create database", e);
			};

		};
	}



	function new_votes_transaction(){
		try {
			var transaction = Buleys.db.transaction(["votes"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_votes_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_votes_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("votes");
			////////console.log("new_votes_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_votes_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("votes", {
					"keyPath": "vote_key"
				}, false);

				Buleys.objectStore.createIndex("vote_value", "vote_value", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_votes_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_votes_transaction(): Could not set the version, so cannot create database", e);
			};

			
		};
	}

	function new_subscriptions_transaction(){
		try {
			var transaction = Buleys.db.transaction(["subscriptions"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_subscriptions_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_subscriptions_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("subscriptions");
			////////console.log("new_subscriptions_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_subscriptions_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("subscriptions", {
					"keyPath": "key"
				}, true);

				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("new_subscriptions_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_subscriptions_transaction(): Could not set the version, so cannot create database", e);
			};

			
		};
	}

	function new_follows_transaction(){
		try {
			//
			var transaction = Buleys.db.transaction(["follows"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_follows_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			//
			transaction.onabort = function(e){
				////////console.log("new_follows_transaction(): Transaction Aborted");
			};
			//
			Buleys.objectStore = transaction.objectStore("follows");
			////////console.log("new_follows_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			//
			////////console.log("new_follows_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			//
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_follows_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("follows", {
					"keyPath": "key"
				}, true);

				Buleys.objectStore.createIndex("modified", "modified", { unique: false });
				
				////////console.log("new_follows_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_follows_transaction(): Could not set the version, so cannot create database", e);
			};

			
		};
	}

	function new_settings_transaction(){
		try {
			var transaction = Buleys.db.transaction(["settings"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_settings_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_settings_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("settings");
			////////console.log("new_settings_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_settings_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_settings_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("settings", {
					"keyPath": "option_name"
				}, true);

				Buleys.objectStore.createIndex("option_value", "option_value", { unique: false });
				
				////////console.log("new_settings_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_settings_transaction(): Could not set the version, so cannot create database", e);
			};

			
		};
	}

function new_topics_transaction(){
		try {
			var transaction = Buleys.db.transaction(["topic"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_topic_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_topic_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("topic");
			////////console.log("new_topic_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_topic_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_topic_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("topic", {
					"keyPath": "topic_key"
				}, true);

				Buleys.objectStore.createIndex("slug", "slug", { unique: false });
				Buleys.objectStore.createIndex("type", "type", { unique: false });
				Buleys.objectStore.createIndex("last_updated", "last_updated", { unique: false });
				
				////////console.log("new_topic_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_topic_transaction(): Could not set the version, so cannot create database", e);
			};

			
		};
	}


	function new_queue_transaction(){
		try {
			var transaction = Buleys.db.transaction(["queue"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("new_settings_transaction(): Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("new_settings_transaction(): Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("queue");
			////////console.log("new_settings_transaction(): New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_settings_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("new_settings_transaction(): Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("queue", {
					"keyPath": "queue_name"
				}, true);

				Buleys.objectStore.createIndex("queue_value", "queue_value", { unique: false });
				
				////////console.log("new_settings_transaction(): Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("new_settings_transaction(): Could not set the version, so cannot create database", e);
			};

			
		};
	}

	function new_social_transaction(){
		try {
			var transaction = Buleys.db.transaction(["social"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			transaction.oncomplete = function(e){
				////////console.log("Transaction Complete");
				delete Buleys.objectStore;
			};
			transaction.onabort = function(e){
				////////console.log("Transaction Aborted");
			};
			Buleys.objectStore = transaction.objectStore("social");
			////////console.log("New Transaction", Buleys.objectStore);
		}
		catch (e) {
			////////console.log("new_social_transaction(): Could not open objectStore. You may have to create it first");
			////////console.log(e);
			
			//
			var request = Buleys.db.setVersion(parseInt(Buleys.db.version) + 1);
			request.onsuccess = function(e){
				////////console.log("Version changed to ", Buleys.db.version, ", so trying to create a database now.");
				Buleys.objectStore = Buleys.db.createObjectStore("social", {
					"keyPath": "link"
				}, true);

				Buleys.objectStore.createIndex("source", "source", { unique: false });
				Buleys.objectStore.createIndex("type", "type", { unique: false });
				Buleys.objectStore.createIndex("modified", "modified", { unique: false });

				
				////////console.log("Object store created: ", Buleys.objectStore);
			};
			request.onerror = function(e){
				////////console.log("Could not set the version, so cannot create database", e);
			};


		};
	}
				
				
	function add_item_to_results(item) {
				//////console.log("add_item_to_results(): ", item);
					var id = item.link.replace(/[^a-zA-Z0-9-_]+/g,"");
					////////console.log("add_item_to_results(): " + jQuery("#" + id).length );
					if( !( jQuery("#" + id ).length ) ) {
					
					
						jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item' href='http://buleys.com/images/icons/fugue-shadowless/magnifier.png'></a></li>").hide().prependTo("#results").fadeIn('slow');
//						jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item' href='http://buleys.com/images/icons/fugue-shadowless/magnifier.png'></a></li>").prependTo("#results");
						
						
						
					} else {
						////////console.log("add_item_to_results(): duplicate!");
						//should report the dupe
						//https://www.pivotaltracker.com/story/show/9307085 in pivotal
					}
	}
	

		function get_items(type_filter, slug_filter, begin_timeframe, end_timeframe) {
	
			//console.log("get_items(): type: " + type_filter + " slug: " + slug_filter);

			var begin_date = 0;
			if(typeof begin_timeframe == "undefined") { 
				begin_date =  0;//begin_date - 60*60*24*14*1000;
			} else {
				begin_date = parseInt( begin_timeframe );
			}
			
			var end_date = 0;
			if(typeof end_timeframe == "undefined") { 
				end_date =  new Date().getTime();
			} else {
				end_date = parseInt( end_timeframe );
			}
			
	
			if( typeof slug_filter == "undefined" || type_filter == "home" ) {

					  
				  Buleys.keyRange = new IDBKeyRange.bound(begin_date, end_date, true, false);
				  //console.log("Range Defined", Buleys.keyRange);
				  
				  Buleys.onCursor = function(callback){
					new_item_transaction();
					//console.log("get_items callback objectStore",callback,Buleys.objectStore);
		 			Buleys.index = Buleys.objectStore.index("published_date");
				    var request = Buleys.index.openCursor(Buleys.keyRange);
				    request.onsuccess = function(event){
				      //console.log("CURSOR!",event,request);
				      
				      if(typeof request.result !== "undefined") {
				     		
				     		Buleys.cursor = request.result;
				      
				      		//console.log("CURSOR2!",Buleys.cursor);
							//console.log("get_items() cursor value ", Buleys.cursor.value );
							get_item( Buleys.cursor.value.link );

							if(typeof Buleys.cursor["continue"] == "function") {
								Buleys.cursor["continue"]();
							}
							
							
					    }
					    
					    
				    };
				    request.onerror = function(event){
				      //console.log("Could not open cursor", Buleys.cursor);
				      //console.log(e);
				    };
				  };
				  Buleys.onCursor(function(){
				    //console.log("Cursor Created", Buleys.cursor);
				  });

			} else {

				new_categories_transaction();
				//console.log("get_items objectStore",slug_filter,Buleys.objectStore);
	 			Buleys.index = Buleys.objectStore.index("slug");
				var cursorRequest = Buleys.index.getAll(slug_filter);
				//console.log("get_items cursor_request",cursorRequest);
				cursorRequest.onsuccess = function(event){
					//console.log("get_items(): event; ", event);
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}

					//console.log("get_items(): Indexed on link; ", objectCursor);

					if(objectCursor.length > 1)  {
						jQuery.each(objectCursor, function(k,item) {
							//console.log("get_items(): item: " + item.link);
							get_item( item.link );
						});				
						//objectCursor["continue"]();
					} else {
						get_item( objectCursor.link );
					}
				};
				cursorRequest.onerror = function(event){
					//console.log("get_items(): Could not open Object Store", event);
				};
      
      
			}

		
	}
	
	
	//
	function get_item( item_url ) {
		//console.log("get_item(): adding: " + item_url);
		
		if(typeof item_url !== 'undefined') {
		
			new_deleted_transaction();
			var item_request_0 = Buleys.objectStore.get(item_url);
			item_request_0.onsuccess = function(event){
			if(typeof item_request_0.result == 'undefined') {

				new_item_transaction();
				var item_request_1 = Buleys.objectStore.get(item_url);
			
				item_request_1.onsuccess = function(event){
					////////console.log("get_item(): 1: done" + item_request_1);
					////////console.log(event.result);
					//Buleys.objectId = item_request.result.author;
					if(typeof item_request_1.result != 'undefined') {
		
		
						//check for archival
						//xxx
						//console.log("get_item(): check_if_item_is_archived: " + item_url);
				
				new_archived_transaction();
		
				var item_request_2 = Buleys.objectStore.get(item_url);
			
				item_request_2.onsuccess = function(event){
					////////console.log("get_item(): check_if_item_is_archived(): done" + item_request_2.result);
					if(typeof item_request_2.result !== 'undefined') {
						//console.log("check_if_item_is_archived(): is archived" + event.result);
		
		
					} else {
						//console.log("get_item(): check_if_item_is_archived: is NOT archived",item_request_1.result);
							get_item_raw_no_trash( item_request_1.result.link );
										
						
						
					}
				};
			
				item_request_2.onerror = function(e){
					////////console.log("get_item(): check_if_item_is_archived(): Could not get object");
					////////console.log(e);
									
						if(jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
							add_item_to_results( item_request_1.result );
							check_if_item_is_favorited(item_request_1.result.link);				
							check_if_item_is_read(item_request_1.result.link);
							check_if_item_is_seen(item_request_1.result.link);
						}
		
				};
		
		
						//end xxx
		
						
		
		
					}
				};
			
				item_request_1.onerror = function(e){
					//////console.log("get_item(): Could not get object");
					////////console.log(e);
			
				};
			
			}
		
			}
		};
	
	}

	//
	function get_item_raw( item_url ) {
		//console.log("get_item_raw(): ", item_url);
		
		if(typeof item_url !== 'undefined') {

			new_item_transaction();
			var item_request_1 = Buleys.objectStore.get(item_url);
		
			item_request_1.onsuccess = function(event){
				////////console.log(event.result);
				//Buleys.objectId = item_request.result.author;
				if(typeof item_request_1.result != 'undefined') {

					new_deleted_transaction();
					var item_request_2 = Buleys.objectStore.get(item_url);
				
					item_request_2.onsuccess = function(event){
						////////console.log(event.result);
						//Buleys.objectId = item_request.result.author;
						if(typeof item_request_2.result == 'undefined') {

							//check for archival
							//xxx
							//console.log("get_item_raw(): " + item_url);
					
														
							if(jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
								add_item_to_results( item_request_1.result );
								check_if_item_is_favorited(item_request_1.result.link);				
								check_if_item_is_read(item_request_1.result.link);
								check_if_item_is_seen(item_request_1.result.link);
							}
						}
						
					}
				
				}
				
				
			};
		
			item_request_1.onerror = function(e){
				////////console.log("get_item(): check_if_item_is_archived(): Could not get object");
				////////console.log(e);
	
			};
	
			
		}
	
	}

	//
	function get_item_raw_no_trash( item_url ) {
		//console.log("get_item(): ", item_url);
		
		if(typeof item_url !== 'undefined') {

			new_item_transaction();
			var item_request_1 = Buleys.objectStore.get(item_url);
		
			item_request_1.onsuccess = function(event){
				////////console.log(event.result);
				//Buleys.objectId = item_request.result.author;
				if(typeof item_request_1.result != 'undefined') {
	
	
					//check for archival
					//xxx
					//console.log("get_item_raw(): " + item_url);
			
												
					if(jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
						add_item_to_results( item_request_1.result );
						check_if_item_is_favorited(item_request_1.result.link);				
						check_if_item_is_read(item_request_1.result.link);
						check_if_item_is_seen(item_request_1.result.link);
					}
				}
				
			};
		
			item_request_1.onerror = function(e){
				////////console.log("get_item(): check_if_item_is_archived(): Could not get object");
				////////console.log(e);
								
					if(jQuery("#" + item_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
						add_item_to_results( item_request_1.result );
						check_if_item_is_favorited(item_request_1.result.link);				
						check_if_item_is_read(item_request_1.result.link);
						check_if_item_is_seen(item_request_1.result.link);
					}
	
			};
	
			
		}
	
	}



	function get_item_for_console( item_url ) {
		
		new_item_transaction();
		////////console.log("get_item_for_console: " + item_url);
		
		//////////console.log(item_url);
		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			//////////console.log(typeof item_request.result.id);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined' && typeof item_request.result.id == 'string') {
				var html_snippit = "<div id='console_" + item_request.result.id.replace(/[^a-zA-Z0-9-_]+/g,"") + "'>";
				html_snippit = html_snippit + "<h3><a href='" + item_request.result.id + "'>" + item_request.result.title + "</a></h3>";
				html_snippit = html_snippit + "<p>" + item_request.result.author + "</p>";
				html_snippit = html_snippit + "</div>";
				
				send_to_console(html_snippit);
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Error: " + e);
			//////////console.log(e);
		};
	
	}

	function get_item_for_overlay( item_url ) {
		
		new_item_transaction();
		////////console.log("get_item_for_overlay: " + item_url);
		
		//////////console.log(item_url);
		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			////////console.log("get_item_for_overlay(): type of result: " + typeof item_request.result.link);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined' && typeof item_request.result.link == 'string') {

			var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><a href="#" class="close_sidebar_link" id="' + item_url + '"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div>' + "<h3 id='overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + item_request.result.link + "'>" + item_request.result.title + "</a></h3></div><div id='overlay_left'></div><div id='overlay_controls'><a href='" + item_url + "' class='favorite_item'>Favorite</a>&nbsp;<a href='" + item_url + "' class='unfavorite_item'>Unfavorite</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_read'>Mark as read</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unread'>Mark as unread</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_seen'>Mark as seen</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + item_url + "' class='archive_item'>Archive</a>&nbsp;<a href='" + item_url + "' class='delete_item'>Delete</a>&nbsp;<a href='" + item_url + "' class='unarchive_item'>Unarchive</a>&nbsp;<a href='" + item_url + "' class='vote_item_up'>Vote up</a>&nbsp;<a href='" + item_url + "' class='vote_item_down'>Vote down</a>&nbsp;<a href='" + item_url + "' class='close_item_preview'>Close preview</a></div>";
			
			//<div id='overlay_controls'><a href='" + item_url + "' class='favorite_item'>Favorite</a>&nbsp;<a href='" + item_url + "' class='unfavorite_item'>Unfavorite</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_read'>Mark as read</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unread'>Mark as unread</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_seen'>Mark as seen</a>&nbsp;<a href='" + item_url + "' class='mark_item_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + item_url + "' class='archive_item'>Archive</a>&nbsp;<a href='" + item_url + "' class='delete_item'>Delete</a>&nbsp;<a href='" + item_url + "' class='unarchive_item'>Unarchive</a>&nbsp;<a href='" + item_url + "' class='vote_item_up'>Vote up</a>&nbsp;<a href='" + item_url + "' class='vote_item_down'>Vote down</a>&nbsp;<a href='" + item_url + "' class='close_item_preview'>Close preview</a></div>
				if( typeof item_request.result.author !== 'undefined' &&  item_request.result.author.length > 0 ) { 
					//html_snippit = html_snippit + "<p>" + item_request.result.author + "</p>";
				}
				////////console.log("get_item_for_overlay(): sending to overlay: " + html_snippit);
				send_to_overlay(html_snippit);
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Error: " + e);
			//////////console.log(e);
		};
	
	}

	jQuery("#results li").live('mouseenter', function(event) {
		
		var item_to_work_from = jQuery(this);
		//////////console.log( jQuery(this).attr('id') );
		if( item_to_work_from.hasClass('unseen') ) {
			item_to_work_from.removeClass('unseen');
			item_to_work_from.addClass('seen');
			
		}
		url_to_preview = item_to_work_from.children('a').attr('href');
		//item_to_work_from
		
		//mark_item_as_read( url_to_preview, slug, type );
		mark_item_as_seen( url_to_preview, slug, type );


	});

	jQuery("#preview_item").live('click', function(event) {

	        event.preventDefault();
	        if( !is_in_cursor_mode() && $('.selected').length > 0 ) {
	        
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	
		
				
					var item_to_work_from = jQuery(item_to_mark);
					//////////console.log( jQuery(this).attr('id') );
					if( item_to_work_from.hasClass('unseen') ) {
						item_to_work_from.removeClass('unseen');
						item_to_work_from.addClass('seen');
					}
					url_to_preview = item_to_work_from.children('a').attr('href');
					//item_to_work_from
					
					//mark_item_as_read( url_to_preview, slug, type );
					mark_item_as_seen( url_to_preview, slug, type );
					load_item_to_overlay( url_to_preview );

		jQuery("#overlay").stop(true).animate({
				opacity: 1,
			}, 100, function() {
			} );			



		        }); 
			
			} else if ($('.selected').length > 0) {
				
				var item_to_work_from = jQuery('.cursor');
				//////////console.log( jQuery(this).attr('id') );
				if( item_to_work_from.hasClass('unseen') ) {
					item_to_work_from.removeClass('unseen');
					item_to_work_from.addClass('seen');
				}
				url_to_preview = item_to_work_from.children('a').attr('href');
				//item_to_work_from
				
				//mark_item_as_read( url_to_preview, slug, type );
				mark_item_as_seen( url_to_preview, slug, type );
				load_item_to_overlay( url_to_preview );


		jQuery("#overlay").stop(true).animate({
				opacity: 1,
			}, 100, function() {
			} );			

				
			}

	});	

	//xxx
    $('#close_item_preview').live('click', function(event) {
        event.preventDefault();



	        if( !is_in_cursor_mode() ) {
	        
	        	if($('.selected').length > 0) {
		        $.each( $('.selected'), function(i,item_to_mark) {
		        	
		
				var item_to_work_from = jQuery(item_to_mark);
		var url_to_preview = item_to_work_from.children('a').attr('href');
		//////////console.log( jQuery(this).attr('id') );
		if( item_to_work_from.hasClass('unread') ) {
			item_to_work_from.removeClass('unread');
			item_to_work_from.addClass('read');
			/*
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
			*/
		}
		var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g,"");
		
		//item_to_work_from
		
		
		if( jQuery( thekey ).length > 0 ) {
		
		
				
					var item_to_work_from = jQuery(item_to_mark);
					//////////console.log( jQuery(this).attr('id') );
					if( item_to_work_from.hasClass('unseen') ) {
						item_to_work_from.removeClass('unseen');
						item_to_work_from.addClass('seen');
					}
					url_to_preview = item_to_work_from.children('a').attr('href');
					//item_to_work_from


				jQuery("#overlay").stop(true).animate({
					opacity: 0,
				}, 500, function() {
			        jQuery("#overlay").html('');
				});
		
		}
		

		        }); 
		        
		        } else {
		        
		        
		        
				jQuery("#overlay").stop(true).animate({
					opacity: 0,
				}, 500, function() {
			        jQuery("#overlay").html('');
				});
		
		        } 

				        
			
			} else {
				
		
				var item_to_work_from = jQuery('.cursor');
						//////////console.log( jQuery(this).attr('id') );
						if( item_to_work_from.hasClass('unseen') ) {
							item_to_work_from.removeClass('unseen');
							item_to_work_from.addClass('seen');
						}
						url_to_preview = item_to_work_from.children('a').attr('href');
						//item_to_work_from
						
										
				var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g,"");
				//item_to_work_from
				
				
				if( jQuery( thekey ).length > 0 ) {
		
				//////console.log( jQuery(thekey).length, jQuery(thekey) );

					jQuery("#overlay").stop(true).animate({
						opacity: 0,
					}, 500, function() {
				        jQuery("#overlay").html('');
					});
				
				} 
		
		
				
			}


		
		

	});	
	

	jQuery("#results li").live('click', function(event) {
		
		var item_to_work_from = jQuery(this);
		var url_to_preview = item_to_work_from.children('a').attr('href');
		//////////console.log( jQuery(this).attr('id') );
		if( item_to_work_from.hasClass('unread') ) {
			item_to_work_from.removeClass('unread');
			item_to_work_from.addClass('read');
			/*
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
			*/
		}
		var thekey = "#overlay_" + url_to_preview.replace(/[^a-zA-Z0-9-_]+/g,"");
		
		//item_to_work_from
		
		
		if( jQuery( thekey ).length > 0 && jQuery(item_to_work_from).hasClass('selected') ) {
			jQuery("#overlay").stop(true).animate({
				opacity: 0,
			}, 500, function() {
		        jQuery("#overlay").html('');
			});
		} else if( !jQuery(item_to_work_from).hasClass('selected') ) {
		
			jQuery("#overlay").stop(true).animate({
				opacity: 1,
			}, 100, function() {
			} );

			load_item_to_overlay( url_to_preview );
			//mark_item_as_read( url_to_preview, slug, type );
				
		}

		item_to_work_from.addClass('selected');

	});

	$(".selected").live('click', function(event) {
		
		$(this).removeClass('selected');
	});
	
	$("#results li").live('mouseleave', function(event) {
		
		/*
		////////console.log( jQuery(this).attr('id') );
		jQuery("#overlay").stop(true).animate({
			opacity: 0,
						
		
		}, 500, function() {
		} ).html('');
		*/
				
	});
	
	function load_item_to_console(item_key) {
		////////console.log("load_item_to_console: " + item_key);
		get_item_for_console( item_key );
	
	}

	function load_item_to_overlay(item_key) {
		////////console.log("load_item_to_overlay: " + item_key);
		get_item_for_overlay( item_key );
		check_if_item_is_favorited_for_overlay( item_key );
		check_item_vote_status_for_overlay( item_key );
		//get_item_categories_for_overlay( item_key );
		//next up
		
		//get_item_favorites_for_overlay( item_key );

	}	
	
	
	function send_to_console(text_to_send) {

		send_text_to_console( text_to_send );
		jQuery("#console_wrapper").stop(true).animate({
			opacity: 1,
			
			
		}, 500);
	
	}

	
	function fade_console_message() {
	
		jQuery("#console_wrapper").stop(true).animate({
			opacity: 0,
		}, 500);
	
	}

	function send_to_overlay( text ) {
		
 		send_text_to_overlay( text );
		jQuery("#overlay").stop(true).animate({
			opacity: 1,
		}, 500);
		
	}

	function get_item_categories_for_overlay( item_url ) {
	
		new_categories_transaction();
		////////console.log(item_url);
		var item_request = Buleys.objectStore.get(item_url);
		
		    try {

				new_categories_transaction();
     			Buleys.index = Buleys.objectStore.index("link");
      
				var cursorRequest = Buleys.index.getAll(item_url);
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					////////console.log("get_item_categories_for_overlay(): Indexed on link; ", objectCursor);
					////////console.log("get_item_categories_for_overlay(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							if(jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).length < 1) {
								var html_snippit = "<ul class='category_list' id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'></ul>";
								jQuery( "#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( html_snippit );
							}
							var cat_snippit = "<li id='list_item_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + item.type.toLowerCase() + item.slug.toLowerCase() + "' class='category_list_item' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "'><a id='" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + item.type.toLowerCase() + item.slug.toLowerCase() + "'  class='category' link='" + item_url + "' type='" + item.type.toLowerCase() + "' slug='" + item.slug.toLowerCase() + "' href='/" + item.type.toLowerCase() + "/" + item.slug + "'>" + item.value + "</a></li>";
							jQuery( "#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( cat_snippit );
							
							get_vote_info( item_url, item.type.toLowerCase(), item.slug.toLowerCase() );

							
						});				
						//objectCursor["continue"]();
					}
					/*
					 else {
						if(jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).length < 1) {
							var html_snippit = "<ul id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'></ul>";
							jQuery( "#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( html_snippit );
						}
						debug = cursorRequest.result;
					////////console.log("x:" + cursorRequest.result);
						var cat_snippit = "<li class='category_list_item' link='" + item_url + "' type='" + cursorRequest.result.type.toLowerCase() + "' slug='" + cursorRequest.result.slug.toLowerCase() + "'><a href='/" + cursorRequest.result.type.toLowerCase() + "/" + cursorRequest.result.slug + "'>" + cursorRequest.result.value + "</a></li>";
						jQuery( "#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( cat_snippit );
					}
					*/
				};
				request.onerror = function(event){
					////////console.log("get_item_categories_for_overlay(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      ////////console.log("get_item_categories_for_overlay(): Could not open Index, create it first");
		      ////////console.log(e);
		    }
    
	/*
		item_request.onsuccess = function(event){
			////////console.log(item_request.status);
			////////console.log(item_request.result);
			if(typeof item_request.result != 'undefined') {
				////////console.log("get_item_categories_for_overlay(): item has categories");
				////////console.log("get_item_categories_for_overlay(): type: " + item_request.result.type);
				if(jQuery("#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).length < 1) {
					var html_snippit = "<div id='categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'></div>";
					jQuery( "#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( html_snippit );
				}
				var cat_snippit = "<a href='/" + item_request.result.type + "/" + item_request.result.slug + "'>" + item_request.result.value + "</a>";
				jQuery( "#categories_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") ).append( cat_snippit );
			} else {
				////////console.log("get_item_categories_for_overlay(): item does not have categories");
				
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	*/
	}

//

	function get_follows_deleteme() {
	
		new_follows_transaction();
		    try {

				new_categories_transaction();
     			Buleys.index = Buleys.objectStore.index("id");
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					////////console.log("get_follows(): Indexed on link; ", objectCursor);
					////////console.log("get_follows(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							send_to_console("get_follows(): " + item);							
						});				
					}

				};
				request.onerror = function(event){
					////////console.log("get_follows(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      ////////console.log("get_follows(): Could not open Index, create it first");
		      ////////console.log(e);
		    }
    

	}


	function get_page_follow_status( the_type, the_key ) {
	
		new_follows_transaction();
		////////console.log("get_page_follow_status(): type: " + the_type + " key: " + the_key);
		////////console.log("get_page_follow_status(): " + the_key.toLowerCase() + "_" + the_type.toLowerCase() );
		var item_request = Buleys.objectStore.get(the_type.toLowerCase() + "_" + the_key.toLowerCase());

	
		item_request.onsuccess = function(event){
			////////console.log("get_page_follow_status(): " + event);
			//Buleys.objectId = item_request.result.author;
			////////console.log("get_page_follow_status(): "  + item_request);
			if(typeof item_request.result == 'undefined' || item_request.result == "") {
				////////console.log("get_page_follow_status(): page is NOT being followed");
				jQuery("#page_meta").append("<a href='#' class='follow_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/heart-empty.png'/></a>");
			} else {
				////////console.log("get_page_follow_status(): page is being followed");
				jQuery("#page_meta").append("<a href='#' class='follow_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/heart.png'/></a>");
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}
	
//here
	//.delete(			
	function remove_follow( the_type, the_key ) {
	
		if(typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
			////////console.log("remove_follow(): " + " key: " +  the_key + " type: " + the_type);
			new_follows_transaction();
			//
			var request = Buleys.objectStore["delete"]( the_type.toLowerCase() + "_" + the_key.toLowerCase() );
				request.onsuccess = function(event){
				////////console.log("remove_follow(): Removed id ", request.result);
				delete Buleys.objectId;
			};
			request.onerror = function(){
				////////console.log("remove_follow(): Could not delete object");
			};
		}
		
	
	}  	

	function add_follow_if_doesnt_exist( the_type,  the_key ) {
		
		if(typeof the_type !== 'undefined' && typeof the_key !== 'undefined' ) {
			new_follows_transaction();
			////////console.log("add_follow_if_doesnt_exist(): type: " + the_type + " key: " + the_key);
			var item_request = Buleys.objectStore.get(the_type.toLowerCase() + "_" + the_key.toLowerCase());
		
			item_request.onsuccess = function(event){
				////////console.log("add_follow_if_doesnt_exist(): " + event);
				//Buleys.objectId = item_request.result.author;
				////////console.log("add_follow_if_doesnt_exist(): " + item_request );
				if(typeof item_request.result == 'undefined') {
					////////console.log("add_follow_if_doesnt_exist(): doesn't exist! ");
					add_follow_to_follows_database( the_type, the_key );
				} else {
					////////console.log("add_follow_if_doesnt_exist(): DOES exist");
				}
			};
		
			item_request.onerror = function(e){
				////////console.log("add_follow_if_doesnt_exist(): Could not get object");
				////////console.log(e);
			};
		}
	
	}
	
	function add_follow_to_follows_database( the_type, the_key ) {
	
		////////console.log("add_follow_to_follows_database(): type" + the_type + " key: " + the_key);
		new_follows_transaction();
		
		var data = {
			"key": the_type.toLowerCase() + "_" + the_key.toLowerCase(),
			"modified": new Date().getTime()
		};
		
		////////console.log("add_follow_to_follows_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			////////console.log("add_follow_to_follows_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			////////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function get_subscriptions() {
	
		new_subscriptions_transaction();
		
		    try {

				new_categories_transaction();
     			Buleys.index = Buleys.objectStore.index("id");
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					////////console.log("get_subscriptions(): Indexed on link; ", objectCursor);
					////////console.log("get_subscriptions(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							////////console.log("get_subscriptions(): " + item);							
						});				
					}

				};
				request.onerror = function(event){
					////////console.log("get_subscriptions(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      ////////console.log("get_subscriptions(): Could not open Index, create it first");
		      ////////console.log(e);
		    }
    

	}


	function get_page_subscription_status( the_type, the_key ) {
	
		new_subscriptions_transaction();
		////////console.log("get_page_subscription_status(): type: " + the_type + " key: " + the_key);
		////////console.log("get_page_subscription_statusx(): " + the_type.toLowerCase() + "_" + the_key.toLowerCase() );
		var item_request = Buleys.objectStore.get(the_type.toLowerCase() + "_" + the_key.toLowerCase());

	
		item_request.onsuccess = function(event){
			////////console.log("get_page_subscription_status(): " + event);
			//Buleys.objectId = item_request.result.author;
			////////console.log("get_page_subscription_status(): "  + item_request.result);
			if(typeof item_request.result == 'undefined' || item_request.result == "") {
				////////console.log("get_page_subscription_status(): page is NOT being subscriptioned");
				jQuery("#page_meta").append("<a href='#' class='subscribe_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/mail.png'/></a>");
			} else {
				////////console.log("get_page_subscription_status(): page is being subscriptioned");
				jQuery("#page_meta").append("<a href='#' class='unsubscribe_topic'><img src='http://buleys.com/images/icons/fugue-shadowless/mail-send.png'/></a>");
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}
	
//here
	//.delete(			
	function remove_subscription( the_type, the_key ) {
	
		////////console.log("remove_subscription(): " + " key: " +  the_key + " type: " + the_type);
		new_subscriptions_transaction();
		//
		var request = Buleys.objectStore["delete"]( the_type.toLowerCase() + "_" + the_key.toLowerCase() );
			request.onsuccess = function(event){
			////////console.log("remove_subscription(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			////////console.log("remove_subscription(): Could not delete object");
		};
		
	
	}  	

	function add_subscription_if_doesnt_exist( the_type, the_key ) {
	
		if(typeof the_type !== 'undefined' && typeof the_key !== 'undefined') {
			new_subscriptions_transaction();
			////////console.log("add_subscription_if_doesnt_exist(): type: " + the_type + " key: " + the_key);
			var item_request = Buleys.objectStore.get(the_type.toLowerCase() + "_" + the_key.toLowerCase());
		
			item_request.onsuccess = function(event){
				////////console.log("add_subscription_if_doesnt_exist(): " + event);
				//Buleys.objectId = item_request.result.author;
				////////console.log("add_subscription_if_doesnt_exist(): " +item_request);
				if(typeof item_request.result == 'undefined') {
					////////console.log("add_subscription_if_doesnt_exist(): doesn't exist! ");
					add_subscription_to_subscriptions_database( the_type, the_key );
				} else {
					////////console.log("add_subscription_if_doesnt_exist(): DOES exist");
				}
			};
		
			item_request.onerror = function(e){
				////////console.log("add_subscription_if_doesnt_exist(): Could not get object");
				////////console.log(e);
			};
		}
	
	}
	
	function add_subscription_to_subscriptions_database( the_type, the_key ) {
	
		////////console.log("add_subscription_to_subscriptions_database(): type" + the_type + " key: " + the_key);
		new_subscriptions_transaction();
		
		var data = {
			"key": the_type.toLowerCase() + "_" + the_key.toLowerCase(),
			"modified": new Date().getTime()
		};
		
		////////console.log("add_subscription_to_subscriptions_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			////////console.log("add_subscription_to_subscriptions_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			////////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}
	function check_if_item_is_seen( item_url ) {
	
		new_seen_transaction();
		////////console.log(item_url);
		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			////////console.log(event);
			//Buleys.objectId = item_request.result.author;
				////////console.log(item_request.status);
			if(typeof item_request.result != 'undefined') {
				////////console.log("check_if_item_is_seen(): item is seen");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass("seen");
			} else {
				////////console.log("check_if_item_is_seen(): item is unseen");
				//jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass("unseen");
				
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}

	function check_if_item_is_read( item_url ) {
	
		new_status_transaction();
		////////console.log(item_url);
		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			////////console.log(event);
			//Buleys.objectId = item_request.result.author;
				////////console.log(item_request.status);
			if(typeof item_request.result != 'undefined') {
				////////console.log("check_if_item_is_read(): item is unread");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass("read");
			} else {
				////////console.log("check_if_item_is_read(): item is unread");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass("unread");
				
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}




	function add_item_if_new( item, type_to_get, company_to_get ) {
	
		new_item_transaction();
		//console.log("add_item_if_new(): " + item.link);
		var item_request = Buleys.objectStore.get(item.link);
	
		item_request.onsuccess = function(event1){
			//console.log("add_item_if_new(): ", event1.target.result);
			//Buleys.objectId = item_request.result.author;
			//////////console.log(item_request.status);
			if(typeof event1.target.result == 'undefined') {
				//////console.log("add_item_if_new(): doesn't exist! ", Buleys.queues.new_items);
				
				new_deleted_transaction();
				//console.log("add_item_if_doesnt_exist(): " + item.link);
				var deleted_item_request = Buleys.objectStore.get(item.link);
			
				deleted_item_request.onsuccess = function(event){
					//////console.log("add_item_if_new(): ", event.target.result);
					//Buleys.objectId = item_request.result.author;
					//////////console.log(item_request.status);
					if(typeof event.target.result == 'undefined') {
						//console.log("add_item_if_new(): not deleted! adding", item);
						add_item_to_items_database(item);
						add_categories_to_categories_database(item.link, item.categories);	
						send_to_console("<p>Added: <a href='" + item.link + "'>" + item.title + "</a></p>");
						var item_key = type_to_get.toLowerCase() + "_" + company_to_get.toLowerCase();
						if(typeof Buleys.queues.new_items[item_key] == "undefined") { Buleys.queues.new_items[item_key] = 0; }
						Buleys.queues.new_items[item_key] = Buleys.queues.new_items[item_key] + 1;
					} else {
						//////console.log("add_item_if_new(): already deleted! ");
					}
				};
			
				item_request.onerror = function(e){
					////////console.log("Could not get object");
					////////console.log(e);
				};
				
								
			} else {
				////console.log("add_item_if_doesnt_exist(): DOES exist", item.link);
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}


	//depreciate this
	function add_item_if_doesnt_exist_old( item ) {
	
		new_item_transaction();
		////////console.log("add_item_if_doesnt_exist(): " + item.link);
		var item_request = Buleys.objectStore.get(item.link);
	
		item_request.onsuccess = function(event){
			//////////console.log(event);
			//Buleys.objectId = item_request.result.author;
			//////////console.log(item_request.status);
			if(typeof item_request.result == 'undefined') {
				
				//////console.log("add_item_if_doesnt_exist(): doesn't exist! ", Buleys.queues.new_items);
				add_item_to_items_database(item);
				add_categories_to_categories_database(item.link, item.categories);	
			} else {
				//////console.log("add_item_if_doesnt_exist(): DOES exist");
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}


	function add_item_if_doesnt_exist( item ) {
	
		new_item_transaction();
		//console.log("add_item_if_doesnt_exist(): " + item.link);
		var item_request = Buleys.objectStore.get( item.link );
	
		item_request.onsuccess = function(event){
			//////////console.log(event);
			//Buleys.objectId = item_request.result.author;
			//////////console.log(item_request.status);
			if(typeof item_request.result == 'undefined') {
				//////console.log("add_item_if_doesnt_exist(): doesn't exist! ", item.categories);
				add_item_to_items_database(item);
				add_categories_to_categories_database(item.link, item.categories);
				//					

				if(item.categories.length > 0) {
					$.each(item.categories, function(cat_key,cat) {
						//////console.log("add_item_if_doesnt_exist(): checking and against",cat,slug,type);
						if(type === "home" || typeof slug === "undefined" || typeof slug === "" ||  cat.key !== null && typeof cat.key !== "null" && cat.key === slug && cat.type === type) {
							//////console.log("add_item_if_doesnt_exist():",item);
							add_item_to_results( get_data_object_for_item(item) );
							check_if_item_is_favorited(item.link);				
							check_if_item_is_read(item.link);
							check_if_item_is_seen(item.link);

						}
					
					});
				} else {
					//////console.log("add_item_if_doesnt_exist(): no cats to go through");
				}
				
					
			} else {
				//////console.log("add_item_if_doesnt_exist(): DOES exist");
			}
		};
	
		item_request.onerror = function(e){
			////////console.log("Could not get object");
			////////console.log(e);
		};
	
	}
	
	function get_data_object_for_item(item) {
		var data = {
			"link": item.link,
			"title": item.title,
			"author": item.author,
			"published_date": new Date(item.published_date).getTime(),
			"index_date": new Date(item.index_date).getTime(),
			"modified": new Date().getTime()
		};
		return data;
	}
	
	function add_item_to_items_database(item) {
	
		//////////console.log("item: " + item.link);
		
		var data = get_data_object_for_item( item );
		
		
		new_deleted_transaction();
		var item_request = Buleys.objectStore.get(item.link);
	
		item_request.onsuccess = function(event){
			////////console.log("check_if_item_is_deleted(): done" + item_request);
			 checker = item_request;
			////////console.log(item_request.result);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined') {

				////////console.log("add_item_to_items_database(): item is in trash");
			} else {
				////////console.log("add_item_to_items_database(): item NOT in trash");

				new_item_transaction();

//xxhre we are.. new titles don't work
				////////console.log("Trying to save...", data);
				//xxxhere
				var add_data_request = Buleys.objectStore.add(data);
				add_data_request.onsuccess = function(event){
					//////////console.log("Saved id ", add_data_request.result);
//					Buleys.objectId = add_data_request.result;

				if(item.categories.length > 1 && typeof item.categories.type === "undefined" && typeof item.categories.key === "undefined" ) {
					$.each(item.categories, function(cat_key,cat) {
						//////console.log("add_item_to_items_database(): checking and against 2+ ",cat,slug,type);
						if(type === "home" || typeof slug === "undefined" || typeof slug === "" ||  cat.key !== null && typeof cat.key !== "null" && cat.key === slug) {
							//////console.log("add_item_to_items_database() actually adding to results:",item);
							if(typeof page == "undefined" || page !== "favorites" && page !== "seen" &&  page !== "read" &&  page !== "archive") {
								add_item_to_results( get_data_object_for_item(item) );
							}
						}
						
					
					});
					
				} else if (item.categories.length == 1 && typeof item.categories.key !== "undefined"  ) {
					//////console.log("add_item_to_items_database(): checking and against 1 ",item.categories[0],slug,type);
					if(type === "home" || item.categories[0].key.toLowerCase() === slug && item.categories[0].type.toLowerCase() === type) {
						//////console.log("add_item_to_items_database():",item);
						add_item_to_results( get_data_object_for_item(item) );
						
					}
				} else {
					//////console.log("add_item_to_items_database(): no cats to go through");
				}


					////////console.log("add_item_to_items_database(): Adding item to result pane", add_data_request.result);
					
					///herexxx
					
				};
				add_data_request.onerror = function(e){
					////////console.log(e);
					//Buleys.transaction.abort();
				};
			

			}
		};
	
		item_request.onerror = function(e){
			////////console.log("check_if_item_is_deleted(): Could not get object");
			////////console.log(e);
		};


		

	}


	function add_categories_to_categories_database(item_url, categories) {
	
		//console.log("add_categories_to_categories_database(): ", item_url, categories);
		
		jQuery.each(categories, function(c,the_category) {
			//console.log("&& category.key !== null thing: ",the_category.key);
			if( typeof the_category.key !== 'undefined' ) {
			
				//console.log("add_categories_to_categories_database(): current category in each ", the_category.key);
				
				
				new_categories_transaction();
			 
			 
				var data = {
					"id": item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + the_category.key.toLowerCase() + the_category.type.toLowerCase(),
					"link": item_url,
					"slug": the_category.key,
					"type": the_category.type,
					"value": the_category.value,
					"modified": new Date().getTime()
				};
			
				
				//console.log("add_categories_to_categories_database(): Trying to save...", data);
				var add_data_request = Buleys.objectStore.add(data);
				add_data_request.onsuccess = function(event){
					//console.log("add_categories_to_categories_database(): Saved id ", add_data_request.result);
					//Buleys.objectId = add_data_request.result;
					if(typeof the_category.key !== 'undefined') {
						var topic_key = the_category.type.toLowerCase()+"_"+the_category.key.toLowerCase();
						if(typeof Buleys.queues.new_items[topic_key] == "undefined") {
							//console.log("add_categories_to_categories_database(): key: ",topic_key);
							//console.log("add_categories_to_categories_database(): count: ", Buleys.queues.new_items[topic_key]);
							Buleys.queues.new_items[topic_key] = 0;
						}
						Buleys.queues.new_items[topic_key] = Buleys.queues.new_items[topic_key] + 1;
					}
				};
				add_data_request.onerror = function(e){
					//console.log("add_categories_to_categories_database(): exists! " + e);
					//Buleys.transaction.abort();
				};
			
			}
			
			
		});
	
	}

	function add_item_to_readstatus_database(item, status ) {
	
		if(typeof status == 'undefined') { 
			status = "unread";
		}
		//////console.log("item: " + item.link);
		new_status_transaction();
		
		var data = {
			"link": item.link,
			"status": status,
			"modified": new Date().getTime()
		};
		
		//////console.log("Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}


	function add_item_as_favorite(item_url) {
	
		//////console.log("add_item_as_favorite(): " + item_url);
		new_status_transaction();
		
		var data = {
			"link": item_url,
			"status": "favorite",
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_as_favorite(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_as_favorite(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function check_if_item_is_favorited_for_overlay(item_url) {
	
		//////console.log("check_if_item_is_favorited(): " + item_url);
		new_favorite_transaction();

		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			//////console.log("check_if_item_is_favorited(): done" + item_request);
			 checker = item_request;
			//////console.log(item_request.result);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined') {
				//////console.log("check_if_item_is_favorited(): is favorite");
//				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).parent().prepend("<span class='overlay_favorite_status'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
				jQuery("#overlay_left").prepend("<span class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
				
				jQuery("#overlay_left").addClass('favorited');
				//jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('favorited');

			} else {
				//////console.log("check_if_item_is_favorited(): is NOT favorite");
				jQuery("#overlay_left").prepend("<span class='overlay_favorite_status' id='favorite_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");

//				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).parent().prepend("<span class='overlay_favorite_status'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");
				//jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('unfavorited');
				jQuery("#overlay_left").addClass('unfavorited');
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("check_if_item_is_favorited(): Could not get object");
			//////console.log(e);
		};
	
	}


	function check_if_item_is_favorited(item_url) {
	
		//////console.log("check_if_item_is_favorited(): " + item_url);
		new_favorite_transaction();

		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			//////console.log("check_if_item_is_favorited(): done" + item_request);
			 checker = item_request;
			//////console.log(item_request.result);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined') {
				//////console.log("check_if_item_is_favorited(): is favorite");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).prepend("<span class='favorite_status'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
				
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('favorited');

			} else {
				//////console.log("check_if_item_is_favorited(): is NOT favorite");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).prepend("<span class='favorite_status'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('unfavorited');
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("check_if_item_is_favorited(): Could not get object");
			//////console.log(e);
		};

		
	
	}

	function add_item_to_favorites_database(item_url, item_slug, item_type) {
	
		//////console.log("item: " + item_url);
		new_favorite_transaction();
		
		var data = {
			"item_link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_to_favorites_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_to_favorites_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function remove_item_from_favorites_database(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_favorites_database(): item: " + item_url);
		new_favorite_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("remove_item_from_favorites_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_item_from_favorites_database(): Could not delete object");
		};
		
	
	}

	function remove_item_from_archives_database(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_favorites_database(): item: " + item_url);
		new_archived_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("remove_item_from_favorites_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_item_from_favorites_database(): Could not delete object");
		};
		
	
	}

	function remove_item_from_items_database(item_url, item_slug, item_type) {
	
		////console.log("remove_item_from_items_database(): item: ", item_url);
		new_item_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			
			////console.log("remove_item_from_items_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			////console.log("remove_item_from_items_database(): Could not delete object");
		};
		
	
	}	
			


//xxx
//new

	function add_item_as_seen(item_url) {
	
		//////console.log("add_item_as_seen(): " + item_url);
		new_seen_transaction();
		
		var data = {
			"link": item_url,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_as_seen(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_as_seen(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function check_if_item_is_seen(item_url) {
	
		//////console.log("check_if_item_is_seen(): " + item_url);
		new_seen_transaction();

		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			//////console.log("check_if_item_is_seen(): done" + item_request);
			 checker = item_request;
			//////console.log(item_request.result);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined') {
				//////console.log("check_if_item_is_seen(): is seen");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('seen');

			} else {
				//////console.log("check_if_item_is_seen(): is NOT seen");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('unseen');
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("check_if_item_is_seen(): Could not get object");
			//////console.log(e);
		};

		
	
	}

	function add_item_to_seens_database(item_url, item_slug, item_type) {
	
		//////console.log("item: " + item_url);
		new_seen_transaction();
		
		var data = {
			"item_link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_to_seens_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_to_seens_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}
	

	function remove_item_from_seens_database(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_seens_database(): item: " + item_url);
		new_seen_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("remove_item_from_seens_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_item_from_seens_database(): Could not seen object");
		};
		
	
	}
	

	function archive_item(item_url) {
	
		//////console.log("add_item_as_archive(): " + item_url);
		new_archived_transaction();
		
		var data = {
			"link": item_url,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_as_archive(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_as_archive(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function check_if_item_is_archived(item_url) {
	
		//////console.log("check_if_item_is_archived(): " + item_url);
		new_archived_transaction();

		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			//////console.log("check_if_item_is_archived(): done" + item_request);
			 checker = item_request;
			//////console.log(item_request.result);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined') {
				//////console.log("check_if_item_is_archived(): is archive");
				
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('archived');

			} else {
				//////console.log("check_if_item_is_archived(): is NOT archive");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('unarchived');
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("check_if_item_is_archived(): Could not get object");
			//////console.log(e);
		};

		
	
	}

	function add_item_to_archives_database(item_url, item_slug, item_type) {
	
		//////console.log("item: " + item_url);
		new_archived_transaction();
		
		var data = {
			"item_link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_to_archives_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_to_archives_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function unarchive_item(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_archives_database(): item: " + item_url);
		new_archived_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("remove_item_from_archives_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_item_from_archives_database(): Could not archive object");
		};
		
	
	}

	function remove_item_from_categories_database(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_archives_database(): item: " + item_url);
	
		new_categories_transaction();
		Buleys.index = Buleys.objectStore.index("link");
     					//
		var request_for_item = Buleys.index.get(item_url);
			request_for_item.onsuccess = function(event){
			if(typeof request_for_item.result !== 'undefined') {
				
				if(typeof request_for_item.result !== 'undefined') {
				
					var slug_string = "";
						slug_string = request_for_item.result.link.replace(/[^a-zA-Z0-9-_]+/g,"") + request_for_item.result.slug.toLowerCase() + request_for_item.result.type.toLowerCase();
						////console.log("remove_item_from_categories_database(): ", slug_string);
							new_categories_transaction();
	
								var request_2 = Buleys.objectStore["delete"]( slug_string );
									request_2.onsuccess = function(event){
									//////console.log("remove_item_from_deletes_database(): Removed id ", request.result);
									delete Buleys.objectId;
								};
								request_2.onerror = function(){
									//////console.log("remove_item_from_deletes_database(): Could not delete object");
								};
					
				
				} else {
						
					$.each(request_for_item.result, function(i, item) {
						////console.log("remove_item_from_categories_database(): request result_key item  ", request_for_item, i, item);
						
						//
						var slug_string = "";
						slug_string = item.link.replace(/[^a-zA-Z0-9-_]+/g,"") + item.slug.toLowerCase() + item.type.toLowerCase();
						////console.log("remove_item_from_categories_database(): ", slug_string);
							new_categories_transaction();
	
								var request_2 = Buleys.objectStore["delete"]( slug_string );
									request_2.onsuccess = function(event){
									//////console.log("remove_item_from_deletes_database(): Removed id ", request.result);
									delete Buleys.objectId;
								};
								request_2.onerror = function(){
									//////console.log("remove_item_from_deletes_database(): Could not delete object");
								};
			
						
						
					});
				
				}
			}
		};
		request_for_item.onerror = function(){
			//////console.log("remove_item_from_categories_database(): Could not archive object");
		};
		
	
	}


	

	function delete_item(item_url, the_type, the_slug) {
	
		////console.log("delete_item(): " + item_url);
		new_deleted_transaction();
		
		var data = {
			"link": item_url,
			"modified": new Date().getTime()
		};
		
		////console.log("delete_item(): Trying to delete...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			////console.log("add_item_as_delete(): Deleted item id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
			/*
			
			
		////console.log("add_item_as_delete():  remove_item_from_items_database");
			remove_item_from_items_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_favorites_database");
			remove_item_from_favorites_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_categories_database");
			remove_item_from_categories_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_archives_database");
			remove_item_from_archives_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_seens_database");
			remove_item_from_seens_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_read_database");
			remove_item_from_read_database(item_url, the_type, the_slug);


			*/
		};
		add_data_request.onerror = function(e){
			////console.log("delete_item(): Could not delete...", e, add_data_request, data.link);
			//////console.log(e);
			//Buleys.transaction.abort();
		};
		
		
		////console.log("add_item_as_delete():  remove_item_from_items_database");
			//remove_item_from_items_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_favorites_database");
			remove_item_from_favorites_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_categories_database");
			remove_item_from_categories_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_archives_database");
			remove_item_from_archives_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_seens_database");
			remove_item_from_seens_database(item_url, the_type, the_slug);
			////console.log("add_item_as_delete():  remove_item_from_read_database");
			remove_item_from_read_database(item_url, the_type, the_slug);


	
	}

	function check_if_item_is_deleted(item_url) {
	
		//////console.log("check_if_item_is_deleted(): " + item_url);
		new_deleted_transaction();

		var item_request = Buleys.objectStore.get(item_url);
	
		item_request.onsuccess = function(event){
			//////console.log("check_if_item_is_deleted(): done" + item_request);
			 checker = item_request;
			//////console.log(item_request.result);
			//Buleys.objectId = item_request.result.author;
			if(typeof item_request.result != 'undefined') {
				//////console.log("check_if_item_is_deleted(): is delete");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).prepend("<span class='delete_status'><a href='" + item_url + "' class='fav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star.png'></a></span>");
				
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('deleted');

			} else {
				//////console.log("check_if_item_is_deleted(): is NOT delete");
				jQuery("#" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).prepend("<span class='delete_status'><a href='" + item_url + "' class='unfav_link'><img src='http://buleys.com/images/icons/fugue-shadowless/star-empty.png'></a></span>");
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("check_if_item_is_deleted(): Could not get object");
			//////console.log(e);
		};

		
	
	}

	function add_item_to_deletes_database(item_url, item_slug, item_type) {
	
		//////console.log("item: " + item_url);
		new_deleted_transaction();
		
		var data = {
			"item_link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_item_to_deletes_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_item_to_deletes_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function remove_item_from_deletes_database(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_deletes_database(): item: " + item_url);
		new_deleted_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("remove_item_from_deletes_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_item_from_deletes_database(): Could not delete object");
		};
		
	
	}
	

//end new



	function mark_item_as_read(item_url, item_slug, item_type) {
	
		//////console.log("mark_item_as_read(): url: " + item_url + "slug: " + item_slug + " type: " + item_type);
		new_status_transaction();
		
		var data = {
			"link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("mark_item_as_read(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("mark_item_as_read(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function remove_item_from_read_database(item_url, item_slug, item_type) {
	
		//////console.log("remove_item_from_read_database(): item: " + item_url);
		new_status_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("remove_item_from_read_database(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_item_from_read_database(): Could not delete object");
		};
		
	
	}  

	function mark_item_as_seen(item_url, item_slug, item_type) {
	
		//////console.log("mark_item_as_seen(): url: " + item_url + "slug: " + item_slug + " type: " + item_type);
		new_seen_transaction();
		
		var data = {
			"link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("mark_item_as_seen(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("mark_item_as_seen(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function mark_item_as_unseen(item_url, item_slug, item_type) {
	
		//////console.log("mark_item_as_unseen(): item: " + item_url);
		new_seen_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("mark_item_as_unseen(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("mark_item_as_unseen(): Could not delete object");
		};
		
	
	}  

	function mark_item_as_deleted(item_url, item_slug, item_type) {
	
		//////console.log("mark_item_as_deleted(): url: " + item_url + "slug: " + item_slug + " type: " + item_type);
		new_deleted_transaction();
		
		var data = {
			"link": item_url,
			"topic_slug": item_slug,
			"topic_type": item_type,
			"modified": new Date().getTime()
		};
		
		//////console.log("mark_item_as_deleted(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("mark_item_as_deleted(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function mark_item_as_undeleted(item_url, item_slug, item_type) {
	
		//////console.log("mark_item_as_undeleted(): item: " + item_url);
		new_deleted_transaction();
		
		//
		var request = Buleys.objectStore["delete"](item_url);
			request.onsuccess = function(event){
			//////console.log("mark_item_as_undeleted(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("mark_item_as_undeleted(): Could not delete object");
		};
		
	
	}  	
	
			
	//.delete(			
	function remove_category_for_item(item_url, item_slug, item_type) {
	
		//////console.log("remove_category_for_item(): item: " + item_url + " slug: " + item_slug + " type: " + item_type);
		new_categories_transaction();
		//
		var request = Buleys.objectStore["delete"](item_url + item_type + item_slug);
			request.onsuccess = function(event){
			//////console.log("remove_category_for_item(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_category_for_item(): Could not delete object");
		};
		
	
	}  	
	
	
	function check_for_waiting_items() {
				//console.log("check_for_waiting_items(): ", Buleys.queues.new_items);
				
				
			notify_user_of_new_items( Buleys.queues.new_items, type_to_get, company_to_get );

	}		

//better name
	function add_items( items_to_database, type_to_get, company_to_get ) {
			////console.log("add_items(): begin ");
			new_item_transaction();
			var add_transaction = Buleys.db.transaction(["items"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			$.each(items_to_database, function(i,item){
			////console.log("add_items(): item ", item);
					add_item_if_new(item, type_to_get, company_to_get);
			});

			
	}

	
	function populate_and_maybe_setup_indexeddbs( items_to_database ) {
		
		//Open database
		////////console.log("Trying to open database ...");
		//var database_open_request = window.indexedDB.open("Buleys-308", "items");
		//database_open_request.onsuccess = function(event){
			//Buleys.db = database_open_request.result;
			//////console.log("Database Opened", Buleys.db);
			//document.write("List of Object Stores", Buleys.db.objectStoreNames);
			//////console.log("Opening an Object Store using a transaction.");
			new_item_transaction();
			//Buleys.objectStore
			var add_transaction = Buleys.db.transaction(["items"], 1 /*Read-Write*/, 1000 /*Time out in ms*/);
			//add data
			$.each(items_to_database, function(i,item){
					add_item_if_doesnt_exist(item);
					//add_item_to_readstatus_database(item);	
					//add_item_to_favorites_database(item);		
			});
		//};
		//////console.log("Object Store Opened", Buleys.objectStore);
		//database_open_request.onerror = function(e){
		//	//////console.log(e);
		//};
		
	}


function open_database( ) {


	//Open database
	//////console.log("Trying to open database ...");
	var database_open_request = window.indexedDB.open("Buleys-317");
	database_open_request.onsuccess = function(event){
		database_is_open(database_open_request.result);
	};
	
	database_open_request.onerror = function(e){
		//////console.log("open_database(): Could not open database");
	};
	
	
}

function send_text_to_console(text_to_send) {
	//////console.log(text_to_send);
	jQuery("#console").html('').append("<p>" + text_to_send + "</p>");
	
	//fadeOut('fast');


}
function send_text_to_overlay(text_to_send) {
	//////console.log(text_to_send);
	jQuery("#overlay").html('').append(text_to_send);
	
	//fadeOut('fast');


}

function add_category_controls( event_context ) {
	jQuery("#overlay .vote_up_category").remove();    
	jQuery("#overlay .vote_down_category").remove();    
	jQuery("#overlay .delete_category").remove();    
	jQuery("#overlay .selected_category").removeClass('.selected_category');    
	
	
	//.addClass('selected_category');    
	var html_snippit;
	var current = jQuery(event_context).html();    
	var the_link = jQuery(event_context).attr('link');    
	var the_type = jQuery(event_context).attr('type');    
	var the_slug = jQuery(event_context).attr('slug');    
	html_snippit = "<span class='vote_up_category' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'><img src='http://buleys.com/images/icons/fugue-shadowless/thumb-up.png'>&nbsp;</span>";
	html_snippit = html_snippit + "<span class='vote_down_category' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'><img src='http://buleys.com/images/icons/fugue-shadowless/thumb.png'>&nbsp;&nbsp;</span>";
	html_snippit = html_snippit + "" + current;
	html_snippit = html_snippit + "<div class='delete_category' link='" + the_link + "' type='" + the_type + "' slug='" + the_slug + "'><img src='http://buleys.com/images/icons/fugue-shadowless/cross-button.png'></div>";
	jQuery(event_context).html(html_snippit);

}

//


	function get_settings() {

		    try {

				new_settings_transaction();
     			Buleys.index = Buleys.objectStore.index("option_name");
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					//console.log("get_settings(): Indexed on link; ", objectCursor);
					//console.log("get_settings(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							//////console.log("get_settings(): " + item);							
						});				
					}

				};
				request.onerror = function(event){
					//////console.log("get_settings(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      //console.log("get_settings(): Could not open Index, create it first");
		      //console.log(e);
		    }
    

	}


//here
	function remove_setting( option_name ) {
		//////console.log("remove_setting(): " + " option_name: " + option_name);
		new_settings_transaction();
		//
		var request = Buleys.objectStore["delete"]( option_name );
			request.onsuccess = function(event){
			//////console.log("remove_setting(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_setting(): Could not delete object");
		};
	}  	

	function load_all_settings_into_dom(  ) {
	
		new_settings_transaction();

		//console.log("load_all_settings_into_dom(): " );
		var item_request = Buleys.objectStore.getAll();
	
		item_request.onsuccess = function(event){
			if(typeof item_request.result !== 'undefined') {
				//console.log("load_all_settings_into_dom(): success ", item_request.result);
			
				if(item_request.result.length >= 0)  {
					jQuery.each(item_request.result, function(k,item) {
					//console.log("load_all_settings_into_dom(): setting, value ", k, item);
						Buleys.settings[item.option_name] = item.option_value;							
						//console.log("load_all_settings_into_dom(): now set ", Buleys.settings[item.option_name]);
					});				
				}
				
			} else {
				//console.log("get_all_settings(): failed ", item_request.result);
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("add_setting_if_doesnt_exist(): Could not get object");
			//////console.log(e);
		};
	
	}

	function add_or_update_setting( option_name, option_value ) {
	
		new_settings_transaction();
		if( typeof option_value == 'undefined' ) {
			option_value = '';
		}
		////console.log("add_setting_if_doesnt_exist(): option_name: " + option_name );
		var item_request = Buleys.objectStore.get( option_name );
	
		item_request.onsuccess = function(event){
			//console.log("add_setting_if_doesnt_exist(): " + event);
			//Buleys.objectId = item_request.result.author;
			//console.log("add_setting_if_doesnt_exist(): " + item_request );
			if(typeof item_request.result == 'undefined') {
				////console.log("add_or_update_setting(): doesn't exist! ", item_request.result);
				add_setting_to_settings_database( option_name, option_value );
			} else {
				////console.log("add_or_update_setting(): DOES exist", item_request.result);
				update_setting_in_settings_database( option_name, option_value );
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("add_setting_if_doesnt_exist(): Could not get object");
			//////console.log(e);
		};
	
	}
	
	function add_setting_to_settings_database( option_name, option_value ) {
	
		//////console.log("add_setting_to_settings_database(): option_name" + option_name + " option_value: " + option_value);
		new_settings_transaction();
		
		var data = {
			"option_name": option_name,
			"option_value": option_value,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_setting_to_settings_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_setting_to_settings_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function update_setting_in_settings_database( option_name, option_value ) {
	
		//////console.log("add_setting_to_settings_database(): option_name" + option_name + " option_value: " + option_value);
		new_settings_transaction();
		
		var data = {
			"option_name": option_name,
			"option_value": option_value,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_setting_to_settings_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.put(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_setting_to_settings_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

//

	function get_queues() {

		    try {

				new_queue_transaction();
     			Buleys.index = Buleys.objectStore.index("queue_name");
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					//console.log("get_queues(): Indexed on link; ", objectCursor);
					//console.log("get_queues(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							//////console.log("get_queues(): " + item);							
						});				
					}

				};
				request.onerror = function(event){
					//////console.log("get_queues(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      //console.log("get_queues(): Could not open Index, create it first");
		      //console.log(e);
		    }
    

	}

	function remove_queue( queue_name ) {
		//////console.log("remove_queue(): " + " queue_name: " + queue_name);
		new_queue_transaction();
		//
		var request = Buleys.objectStore["delete"]( queue_name );
			request.onsuccess = function(event){
			//////console.log("remove_queue(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_queue(): Could not delete object");
		};
	}  	

	function load_all_queues_into_dom( ) {
	
		new_queue_transaction();

		//console.log("load_all_queues_into_dom(): " );
		var item_request = Buleys.objectStore.getAll();
	
		item_request.onsuccess = function(event){
			if(typeof item_request.result !== 'undefined') {
				//console.log("load_all_queues_into_dom(): success ", item_request.result);
			
				if(item_request.result.length >= 0)  {
					jQuery.each(item_request.result, function(k,item) {
					//console.log("load_all_queues_into_dom(): queue, value ", k, item);
						Buleys.queues[item.queue_name] = item.queue_value;							
						//console.log("load_all_queues_into_dom(): now set ", Buleys.queues[item.queue_name]);
					});				
				}
				
			} else {
				//console.log("get_all_queues(): failed ", item_request.result);
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("add_queue_if_doesnt_exist(): Could not get object");
			//////console.log(e);
		};
	
	}

	function add_or_update_queue( queue_name, queue_value ) {
	
		new_queue_transaction();
		if( typeof queue_value == 'undefined' ) {
			queue_value = '';
		}
		////console.log("add_queue_if_doesnt_exist(): queue_name: " + queue_name );
		var item_request = Buleys.objectStore.get( queue_name );
	
		item_request.onsuccess = function(event){
			////console.log("add_queue_if_doesnt_exist(): " + event);
			//Buleys.objectId = item_request.result.author;
			////console.log("add_queue_if_doesnt_exist(): " + item_request );
			if(typeof item_request.result == 'undefined') {
				////console.log("add_queue_if_doesnt_exist(): doesn't exist! ", item_request.result);
				add_queue_to_queues_database( queue_name, queue_value );
			} else {
				////console.log("add_queue_if_doesnt_exist(): DOES exist", item_request.result);
				update_queue_in_queues_database( queue_name, queue_value );
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("add_queue_if_doesnt_exist(): Could not get object");
			//////console.log(e);
		};
	
	}
	
	function add_queue_to_queues_database( queue_name, queue_value ) {
	
		//////console.log("add_queue_to_queues_database(): queue_name" + queue_name + " queue_value: " + queue_value);
		new_queue_transaction();
		
		var data = {
			"queue_name": queue_name,
			"queue_value": queue_value,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_queue_to_queues_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_queue_to_queues_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function update_queue_in_queues_database( queue_name, queue_value ) {
	
		//////console.log("add_queue_to_queues_database(): queue_name" + queue_name + " queue_value: " + queue_value);
		new_queue_transaction();
		
		var data = {
			"queue_name": queue_name,
			"queue_value": queue_value,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_queue_to_queues_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.put(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_queue_to_queues_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	
	//current dev work
	//02.10.11
	function check_item_vote_status_for_overlay(item_url) {
	
		//////console.log("check_if_item_is_favorited(): " + item_url);
		new_votes_transaction();

		var item_request = Buleys.objectStore.get(item_url.replace(/[^a-zA-Z0-9-_]+/g,""));
	
		item_request.onsuccess = function(event){
			//////console.log("check_if_item_is_favorited(): done" + item_request);
			 checker = item_request;
			//console.log("Right here right now");
			//console.log("Right here right now");
			//console.log(event);
			//console.log(event.target.result);
			//console.log("Right here right now");
			//console.log("Right here right now");
			//Buleys.objectId = item_request.result.author;
			if(typeof event.target.result !== 'undefined') {
				//////console.log("check_if_item_is_favorited(): is favorite");
//				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + "").parent().prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + slug + '" id="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up.png"/></a><br><a href="#" class="vote_down" id="' + item_url + '" alt="' + slug + '" ><img src="/images/icons/fugue-shadowless/thumb.png"/></a></div>');
				if(event.target.result.vote_value == -1) {
					jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up-empty.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '" alt="' + slug + '" ><img src="/images/icons/fugue-shadowless/thumb.png"/></a></div>');
				
				} else if(event.target.result.vote_value == 1) {
					jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '" alt="' + slug + '" ><img src="/images/icons/fugue-shadowless/thumb-empty.png"/></a></div>');
				
				} else {
					jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up-empty.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '" alt="' + slug + '" ><img src="/images/icons/fugue-shadowless/thumb-empty.png"/></a></div>');
				}
				jQuery("#overlay_left").parent().addClass('voted');

//				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('voted');

			} else {
//				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).parent().prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + slug + '" id="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up.png"/></a><br><a href="#" class="vote_down" id="' + item_url + '" alt="' + slug + '" ><img src="/images/icons/fugue-shadowless/thumb.png"/></a></div>');
				jQuery("#overlay_left").prepend('<div class="vote_context"><a href="#" class="vote_up" alt="' + slug + '" id="overlay_upvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '"><img src="/images/icons/fugue-shadowless/thumb-up-empty.png"/></a><br><a href="#" class="vote_down" id="overlay_downvote_' + item_url.replace(/[^a-zA-Z0-9-_]+/g,"") + '" link="' + item_url + '" alt="' + slug + '" ><img src="/images/icons/fugue-shadowless/thumb-empty.png"/></a></div>');
				jQuery("#overlay_left").parent().addClass('unvoted');

//				jQuery("#overlay_" + item_url.replace(/[^a-zA-Z0-9-_]+/g,"")).addClass('unvoted');
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("check_if_item_is_favorited(): Could not get object");
			//////console.log(e);
		};

		
	
	}



//votes

	function get_vote_info( the_url, the_type, the_key ) {
	
		new_votes_transaction();
		//////console.log("get_item_vote_info(): the_url: " + the_url );
		var vote_key = the_url.replace(/[^a-zA-Z0-9-_]+/g,"") + the_type.toLowerCase() + the_key.toLowerCase();
		//////console.log("get_item_vote_info(): vote_key: " + vote_key );
		var item_request = Buleys.objectStore.get( vote_key );

	
		item_request.onsuccess = function(event){
			//////console.log("get_vote_info(): " + event);
			//Buleys.objectId = item_request.result.author;
			//////console.log("get_vote_info(): "  + item_request);
			if(typeof item_request.result == 'undefined' || item_request.result == "") {
				//////console.log("get_vote_info(): vote info NOT found");
			} else {
				//////console.log("get_vote_info(): vote info found");
				if(typeof item_request.result != 'undefined') {
				//////console.log("get_vote_info(): vote_value: " + item_request.result.vote_value);

					if( item_request.result.vote_value == 0 ) {
						jQuery("#" + vote_key).addClass("voted downvoted");
					} else if( item_request.result.vote_value == 1 ) {
						jQuery("#" + vote_key).addClass("voted upvoted");
					}
				
				}

			}
		};
	
		item_request.onerror = function(e){
			//////console.log("Could not get object");
			//////console.log(e);
		};
	
	}



	function get_votes() {

		    try {

				new_votes_transaction();
     			Buleys.index = Buleys.objectStore.index("vote_key");
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					//////console.log("get_votes(): Indexed on link; ", objectCursor);
					//////console.log("get_votes(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							//////console.log("get_votes(): " + item);							
						});				
					}

				};
				request.onerror = function(event){
					//////console.log("get_votes(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      //////console.log("get_votes(): Could not open Index, create it first");
		      //////console.log(e);
		    }
    

	}


//here
	function remove_vote( vote_key ) {
		//////console.log("remove_vote(): " + " vote_key: " + vote_key);
		new_votes_transaction();
		//
		var request = Buleys.objectStore["delete"]( vote_key );
			request.onsuccess = function(event){
			//////console.log("remove_vote(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_vote(): Could not delete object");
		};
	}  	

	function add_or_update_vote( vote_key, vote_value ) {
	//console.log("add_or_update_vote(): key: " + vote_key + " value: " + vote_value );
		
		new_votes_transaction();
		if( typeof vote_value == 'undefined' ) {
			vote_value = '';
		}
		var item_request = Buleys.objectStore.get( vote_key );
	
		item_request.onsuccess = function(event){
			//console.log("add_or_update_vote(): " + event);
			//Buleys.objectId = item_request.result.author;
			//////console.log("add_or_update_vote(): " + item_request );
			if(typeof item_request.result == 'undefined') {
				//////console.log("add_or_update_vote(): doesn't exist! ");
				add_vote_to_votes_database( vote_key, vote_value );
			} else {
				//////console.log("add_or_update_vote(): DOES exist");
				update_vote_in_votes_database( vote_key, vote_value );
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("add_setting_if_doesnt_exist(): Could not get object");
			//console.log(e);
		};		
	
	}
	
	function add_vote_to_votes_database( vote_key, vote_value ) {
	
		//////console.log("add_vote_to_votes_database(): vote_key" + vote_key + " vote_value: " + vote_value);
		new_votes_transaction();
		
		var data = {
			"vote_key": vote_key,
			"vote_value": vote_value,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_vote_to_votes_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.add(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_vote_to_votes_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function update_vote_in_votes_database( vote_key, vote_value ) {
	
		//////console.log("add_vote_to_votes_database(): vote_key" + vote_key + " vote_value: " + vote_value);
		new_votes_transaction();
		
		var data = {
			"vote_key": vote_key,
			"vote_value": vote_value,
			"modified": new Date().getTime()
		};
		
		//////console.log("add_vote_to_votes_database(): Trying to save...", data);
		var add_data_request = Buleys.objectStore.put(data);
		add_data_request.onsuccess = function(event){
			//////console.log("add_vote_to_votes_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

//topics
	function load_page_title_info(page_info) {
		if(typeof page_info.name != 'undefined' && jQuery("a .topic_name").length > 0 ) {
			jQuery("#page_meta").append("<a href='/" + page_info.type + "/" + page_info.key + "' class='topic_name'>" + page_info.name + "</a>");
		}
		if(typeof page_info.subsector != 'undefined' && jQuery("a .sector_name").length > 0) {
			jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(page_info.subsector).toLowerCase() + "' class='sector_name'>" + page_info.subsector + "</a>");
		}

		if(typeof page_info.sector != 'undefined' && jQuery("a .subsector_name").length > 0) {
			jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(page_info.sector).toLowerCase() + "' class='subsector_name'>" + page_info.sector + "</a>");
		}
	}
	
	

	function get_page_topic_info( the_type, the_key ) {
	
		new_topics_transaction();
		//////console.log("get_page_topic_info(): type: " + the_type + " key: " + the_key);
		//////console.log("get_page_topic_info(): " + the_type.toLowerCase() + "_" + the_key.toLowerCase() );
		var item_request = Buleys.objectStore.get(the_type.toLowerCase() + "_" + the_key.toLowerCase());

	
		item_request.onsuccess = function(event){
			//////console.log("get_page_topic_info(): " + event);
			//Buleys.objectId = item_request.result.author;
			//////console.log("get_page_topic_info(): "  + item_request.result);
			if(typeof item_request.result == 'undefined' || item_request.result == "") {
				//////console.log("get_page_topic_info(): topic info NOT found");
			} else {
				//////console.log("get_page_topic_info(): topic info found");
				if(typeof item_request.result.name != 'undefined') {
					jQuery("#page_meta").append("<a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a>");
					window.document.title = window.document.title.replace(/[|\s]*?Buley's/,"");
					window.document.title = window.document.title + item_request.result.name +" | Buley's";


				}
				if(typeof item_request.result.subsector != 'undefined') {
					jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
				}

				if(typeof item_request.result.sector != 'undefined') {
					jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
				}


			}
		};
	
		item_request.onerror = function(e){
			//////console.log("Could not get object");
			//////console.log(e);
		};
	
	}


	function get_topics() {

		    try {

				new_topics_transaction();
     			Buleys.index = Buleys.objectStore.index("topic_key");
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					//////console.log("get_topics(): Indexed on link; ", objectCursor);
					//////console.log("get_topics(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							//////console.log("get_topics(): " + item);							
						});				
					}

				};
				request.onerror = function(event){
					//////console.log("get_topics(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      //////console.log("get_topics(): Could not open Index, create it first");
		      //////console.log(e);
		    }
    

	}


//here
	function remove_topic( topic_key ) {
		//////console.log("remove_topic(): " + " topic_key: " + topic_key);
		new_topics_transaction();
		//
		var request = Buleys.objectStore["delete"]( topic_key );
			request.onsuccess = function(event){
			//////console.log("remove_topic(): Removed id ", request.result);
			delete Buleys.objectId;
		};
		request.onerror = function(){
			//////console.log("remove_topic(): Could not delete object");
		};
	}  	

	function add_or_update_topic( topic_key, topic ) {
	
		new_topics_transaction();
		if( typeof topic == 'undefined' ) {
			topic = {};
		}
		//////console.log("add_topic_if_doesnt_exist(): topic_key: " + topic_key );
		var item_request = Buleys.objectStore.get( topic_key );
	
		item_request.onsuccess = function(event){
			//////console.log("add_topic_if_doesnt_exist(): " + event);
			//Buleys.objectId = item_request.result.author;
			//////console.log("add_topic_if_doesnt_exist(): " + item_request.result );
			if(typeof item_request.result == 'undefined') {
				//////console.log("add_topic_if_doesnt_exist(): doesn't exist! ");
				add_topic_to_topics_database( topic_key, topic );
			} else {
				//////console.log("add_topic_if_doesnt_exist(): DOES exist");
				update_topic_in_topics_database( topic_key, topic );
			}
		};
	
		item_request.onerror = function(e){
			//////console.log("add_topic_if_doesnt_exist(): Could not get object");
			//////console.log(e);
		};
	
	}
	
	function add_topic_to_topics_database( topic_key, topic ) {
	
		//////console.log("add_topic_to_topics_database(): topic_key" + topic_key + " topic: " + topic);
		new_topics_transaction();
		
		if(typeof topic == "undefined") {
			var topic = {};
		} 
		topic.topic_key = topic_key;
		topic.modified = new Date();
		
		//////console.log("add_topic_to_topics_database(): Trying to save...", topic);
		var add_data_request = Buleys.objectStore.add(topic);
		add_data_request.onsuccess = function(event){
			//////console.log("add_topic_to_topics_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}

	function update_topic_in_topics_database( topic_key, topic ) {
	
		//////console.log("add_topic_to_topics_database(): topic_key" + topic_key + " topic: " + topic);
		new_topics_transaction();
		
		topic.topic_key = topic_key;
		topic.modified = new Date();
		
		if(typeof topic.last_updated != 'undefined') {
			topic.last_updated = new Date( parseInt(topic.last_updated) * 1000 );
		}
		if(typeof topic.updated != 'undefined') {
			topic.updated = new Date( parseInt(topic.updated) * 1000 );
		}		
		if(typeof topic.last_attempt != 'undefined') {
			topic.last_attempt = new Date(parseInt(topic.last_attempt) * 1000 );
		}
		
		//////console.log("add_topic_to_topics_database(): Trying to save...", topic);
		var add_data_request = Buleys.objectStore.put(topic);
		add_data_request.onsuccess = function(event){
			//////console.log("add_topic_to_topics_database(): Saved id ", add_data_request.result);
			Buleys.objectId = add_data_request.result;
		};
		add_data_request.onerror = function(e){
			//////console.log(e);
			//Buleys.transaction.abort();
		};
	
	}



function getURLSlug(rough) {
    var type = typeof rough;
    if (type != 'object') {
        if(rough != null && rough != "undefined" && rough != '') {
            var itemID = '';
            rough.toLowerCase();
            itemID = rough;
            
            itemID = itemID.replace(/ - /g, "_");
            itemID = itemID.replace(/ /g, "_");
            itemID = itemID.replace(/\'s/g, "");
            itemID = itemID.replace(/ - /g, "_");
            itemID = itemID.replace(/-/g, "_");
            itemID = itemID.replace('/%20/g', "_");
            itemID = itemID.replace(/&/, "and");
            itemID = itemID.replace('/%26/g', "and");
            itemID = itemID.replace('.', "");
            
            return itemID;
        }
    }
}


/*not mine*/

function minutes_ago(time) {
    
    var d = Date.parse(time);
    var dateFunc = new Date();
    var timeSince = dateFunc.getTime() - d;
    var inSeconds = timeSince / 1000;
    var inMinutes = timeSince / 1000 / 60;
    var inHours = timeSince / 1000 / 60 / 60;
    var inDays = timeSince / 1000 / 60 / 60 / 24;
    var inYears = timeSince / 1000 / 60 / 60 / 24 / 365;
    
    return inMinutes;
    
}



function cancel_confirmation(user_id) {

}


	


function request_login( email, password ) {

	password = md5(password);
	//////console.log("sending data: pass: " + password + " email: " + email);
	var data_to_send;
        data_to_send = { "method":"request_login", "secret": password, "email": email, "token": session_token};
	////////console.log("sending data: " + data_to_send.secret);
	$.post("/api/index.php", data_to_send, function(data) {
		if(data != null && typeof data.result !== 'undefined') {
			if(data.result.toLowerCase() == "failure") {
				//////console.log('fail');
				// data//
				//xxx
				send_to_console(data.message);
				//
			} else if(data.result.toLowerCase() == "success") {
				//////console.log('suc');
				send_to_console(data.message);
				//
			}
		} else {
			//////console.log("request_login(): no data"); 
		}
	}, "json");


}

//function request_registration
function request_registration(password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country) {

	password = md5(password);
	
	data_to_send = { "method":"request_registration", "secret": password, "display_name":display_name,"first_name":first_name,"last_name":last_name,"address_1":address_1,"address_2":address_2,"city":city,"state":state,"zip":zip,"country":country};

	$.post("/feedback/index.php", data_to_send, function(data) {
		if(typeof(data.request_status) !== 'undefined') {
			if(data.result.toLowerCase() == "failure") {
				if(typeof(data.message) !== 'undefined') {
					jQuery("#login_box").prepend("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_box").prepend('There was an error. Your account is not confirmed.');
				}
				close_button(jQuery("#login_box"));
			} else if(data.result.toLowerCase() == "success") {
				if(typeof(data.message) !== 'undefined') {
					jQuery("#login_box").html("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_box").html('Your account is confirmed.');
				}
				close_button(jQuery("#login_box"));
			}
		}
	}, "json");


}

function confirm_registration(secret) {

	data_to_send = { "method":"confirm_account", "secret": secret};


	$.post("/feedback/index.php", data_to_send, function(data) {
		if(typeof(data.request_status) !== 'undefined') {
			if(data.result.toLowerCase() == "failure") {
				jQuery("#login_box").html('');


				if(typeof(data.reason) !== 'undefined') {
					jQuery("#login_box").prepend("<p><small>" + data.reason + "<small></p>");
				}

				if(typeof(data.message) !== 'undefined') {
					jQuery("#login_box").prepend("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_box").prepend('There was an error.');
				}

			} else if(data.result.toLowerCase() == "success") {

				if(typeof(data.message) !== 'undefined') {
					jQuery("#login_box").html("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_box").html('Your account is confirmed and logged in.');
				}
				/*
				
				*/
				jQuery("#login_box").append('<p><strong>Password</strong>:<input id="password_once"type="password"name="password"/><br/><strong>Password</strong>(again):<input id="password_twice"type="password"name="password_confirm"/></p><p><strong>Public name</strong>:<input id="display_name"type="text"name="display_name"/></p><p id="registration_profile_info"><strong>First Name</strong>: <input id="first_name"type="text"name="first_name"  size="20"/><br/><strong>Last Name</strong>: <input id="last_name"type="text"name="last_name"  size="20"/><br/><strong>Address 1</strong>:<input id="address_1"type="text"name="address_1"/><br/><strong>Apt. #</strong> (optional): <input id="address_2"type="text"name="address_2"/><br/><strong>City</strong>: <input id="city"type="text" name="city" size="20"/><br/><strong>State</strong>: <select id="state" name="state"><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option></select>&nbsp;&nbsp;&nbsp;<strong>Zip</strong>: <input id="zip"type="text"name="zip" size="10"/><br/><strong>Country</strong>: <select id="country" name="country" size="1"><option value="AF">Afghanistan</option><option value="AX">Axland Islands</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarctica</option><option value="AG">Antigua And Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia And Herzegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet Island</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei Darussalam</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cape Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CC">Cocos (Keeling) Islands</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CG">Congo</option><option value="CD">Congo, The Democratic Republic Of The</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote DIvoire</option><option value="HR">Croatia</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvinas)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value=" Gg">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard Island And Mcdonald Islands</option><option value="VA">Holy See (Vatican City State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran, Islamic Republic Of</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IM">Isle Of Man</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JE">Jersey</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KP">Korea, Democratic People\'s Republic Of</option><option value="KR">Korea, Republic Of</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Lao People\'s Democratic Republic</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libyan Arab Jamahiriya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macao</option><option value="MK">Macedonia, The Former Yugoslav Republic Of</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia, Federated States Of</option><option value="MD">Moldova, Republic Of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestinian Territory, Occupied</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="SH">Saint Helena</option><option value="KN">Saint Kitts And Nevis</option><option value="LC">Saint Lucia</option><option value="PM">Saint Pierre And Miquelon</option><option value="VC">Saint Vincent And The Grenadines</option><option value="WS">Samoa</option><option value="SM">San Marino</option><option value="ST">Sao Tome And Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="CS">Serbia And Montenegro</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovakia</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="GS">South Georgia And The South Sandwich Islands</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SJ">Svalbard And Jan Mayen</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syrian Arab Republic</option><option value="TW">Taiwan, Province Of China</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania, United Republic Of</option><option value="TH">Thailand</option><option value="TL">Timor-Leste</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad And Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks And Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB">United Kingdom</option><option value="US" selected>United States</option><option value="UM">United States Minor Outlying Islands</option><option value="UY">Uruguay</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Viet Nam</option><option value="VG">Virgin Islands, British</option><option value="VI">Virgin Islands, U.S.</option><option value="WF">Wallis And Futuna</option><option value="EH">Western Sahara</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select><br/></p>');

				//request_login_buttons(jQuery("#login_box"));
				request_registration_confirmation_buttons( jQuery("#login_box") );
				
			} else {
				jQuery("#login_box").prepend('There was an error.');
			}
		}
	}, "json");

}


function send_confirmation(email, page, context, resend) {

	if(typeof(page) == undefined) { page = ""; }
	if(typeof(context) == undefined) { context = ""; }
	if(typeof(resend) == undefined) { resend = false; }
	
	jQuery("body").append("<div id='pending_email' style='display:none;'>" + email + "</div>");
	
	var data_to_send;
        data_to_send = {};

	if(resend) {
		data_to_send = { "method":"account_confirmation_resend", "email":email, "page": slug, "context":context};
	} else {
		data_to_send = { "method":"account_confirmation","email":email, "page": slug, "context":context};
	}

	$.post("/feedback/index.php", data_to_send, function(data) {
		if(typeof(data.result) !== 'undefined') {
			if(data.result.toLowerCase() == "failure") {
				jQuery("#login_box").html('');
				if(typeof(data.reason) !== 'undefined') {
					if(data.reason.toLowerCase() == "account_pending") {
						pending_confirmation_buttons(jQuery( "#login_box" ));
					} else {
						ready_to_close_button(jQuery( "#login_box" ));
					}
				}
				if(typeof(data.message) !== 'undefined') {
					jQuery("#login_box").append("<p>" + data.message + "</p>");
				}

			} else {
				pending_secret_confirmation_buttons( jQuery( "#login_box" ) );
				jQuery("#login_box").html('Thank you. Buley\'s has sent an email to ' + $('#registration_email').val() + '. Please click the verification link in that email or paste its "secret" into the box below:<br/><br/><strong>Secret</strong>: <input id="confirmation_hash" type="text" name="confirmation_hash" />');
			}
		}
	}, "json");
}

function account_login(email, password) {
	var secret = md5(password);
	data_to_send = { "method":"email_login", "email":email, "secret":secret};
	//jQuery("#user_message").fadeOut('slow');
	$.post("/feedback/index.php", data_to_send, function(data) {
		alert(data.result);
		if(typeof data.result  !== 'undefined') {
			if(data.result.toLowerCase() == "failure") {
				
				if(typeof data.message !== 'undefined') {
					//miricle sauce
					//jQuery("<p id='user_message'>" + data.message + "</p>").hide().prependTo("#login_box").fadeIn('slow');
					send_to_console("<p>" + data.message + "</p>");
					
				} else {
					//jQuery("<p id='user_message'>Incorrect email or password.</p>").hide().prependTo("#login_box").fadeIn('slow');
					
				}
			
			
			} else if(data.result.toLowerCase() == "success") {
				jQuery("#login_box").remove();
				if(typeof(data.message) !== 'undefined' && data.message != null && data.message != '') {
					send_to_console("<p>" + data.message + "</p>");
					//jQuery("<p id='user_message'>" + data.message + "</p>").hide().prependTo("#login_box").fadeIn('slow');
				} else {
					send_to_console("<p>Logged in successfully.</p>");
					//jQuery('<p id="user_message">Logged in successfully.</p>').hide().prependTo("#login_box").fadeIn('slow');
				}
				jQuery("#register").fadeOut('fast');
				jQuery("#login").fadeOut('fast');
				jQuery("#logout").fadeIn('fast');
				close_button(jQuery("#login_box"));
			}
		}
	}, "json");
}

function account_logout() {

	data_to_send = { "method":"logout"};

	$.post("/feedback/index.php", data_to_send, function(data) {
		if(typeof(data.result) !== 'undefined') {
			if(data.result.toLowerCase() == "failure") {
				
				if(typeof(data.message) !== 'undefined') {
					jQuery("#login_box").append("<p>" + data.message + "</p>");
				} else {
					jQuery("#login_box").append("<p>Incorrect email or password.</p>");
				}
			
			} else if(data.result.toLowerCase() == "success") {
				jQuery("#login").fadeIn('fast');
				jQuery("#logout").fadeOut('fast');
			}
		}
	}, "json");
}


function submit_registration() {
	
	if($('#password_once').val() == $('#password_twice').val()) {
		var password = $('#password_once').val();
		var first_name = $('#first_name').val();
		var display_name = $('#display_name').val();
		var last_name = $('#last_name').val();
		var address_1 = $('#address_1').val();
		var address_2 = $('#address_2').val();
		var city = $('#city').val();
		var state = $('#state').val();
		var zip = $('#zip').val();
		var country = $('#country').val();
		
		request_registration( password, display_name, first_name, last_name, address_1, address_2, city, state, zip, country );
	} else {
		alert('passwords don\'t match');
	}

}


//secret confirmation:
// confirm/dismiss
//confirm_registration($('#confirmation_hash').val());
/*$(this).dialog("close");
			$("#register").fadeIn('slow');

*/

//pending confirmation:
//cancel/resent/dismiss
//$(this).dialog("close");
/* send_confirmation(jQuery("#pending_email").html(), "", "", true);
			jQuery("#pending_email").remove(); */
/* $(this).dialog("close");
			$("#register").fadeIn('slow'); */


//login prompt
// dismis/login
/* $(this).dialog("close");
			$("#register").fadeIn('slow'); */
/* if($('#login_email').val() != '' && $('#login_password').val() != '') {
				account_login($('#login_email').val(),$('#login_password').val());
			}*/			


function md5 (str) {

	str = str + "Buleys";

    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // + namespaced by: Michael White (http://getsprink.com)
    // +    tweaked by: Jack
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: md5('Kevin van Zonneveld');
    // *     returns 1: '6e658d4bfcb59cc13f96c14450ac40b9'

    var xl;

    var rotateLeft = function (lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    };

    var addUnsigned = function (lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    };

    var _F = function (x,y,z) { return (x & y) | ((~x) & z); };
    var _G = function (x,y,z) { return (x & z) | (y & (~z)); };
    var _H = function (x,y,z) { return (x ^ y ^ z); };
    var _I = function (x,y,z) { return (y ^ (x | (~z))); };

    var _FF = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _GG = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _HH = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var _II = function (a,b,c,d,x,s,ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    };

    var convertToWordArray = function (str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=new Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    var wordToHex = function (lValue) {
        var wordToHexValue="",wordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            wordToHexValue_temp = "0" + lByte.toString(16);
            wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length-2,2);
        }
        return wordToHexValue;
    };

    var x=[],
        k,AA,BB,CC,DD,a,b,c,d,
        S11=7, S12=12, S13=17, S14=22,
        S21=5, S22=9 , S23=14, S24=20,
        S31=4, S32=11, S33=16, S34=23,
        S41=6, S42=10, S43=15, S44=21;

    str = this.utf8_encode(str);
    x = convertToWordArray(str);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    
    xl = x.length;
    for (k=0;k<xl;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=addUnsigned(a,AA);
        b=addUnsigned(b,BB);
        c=addUnsigned(c,CC);
        d=addUnsigned(d,DD);
    }

    var temp = wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d);

    return temp.toLowerCase();
}

function utf8_encode ( argString ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n+1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}



//Notifications

// check for notifications support
// you can omit the 'window' keyword
if (window.webkitNotifications) {
  ////console.log("Notifications are supported!");
}
else {
  ////console.log("Notifications are not supported for this Browser/OS version yet.");
}


function createNotificationInstance(options) {
  if (options.notificationType == 'simple') {
    return window.webkitNotifications.createNotification(
        'icon.png', 'Notification Title', 'Notification content...');
  } else if (options.notificationType == 'html') {
    return window.webkitNotifications.createHTMLNotification('http://someurl.com');
  }
}

function send_notification_to_desktop() {

  if (window.webkitNotifications.checkPermission() == 0) { // 0 is PERMISSION_ALLOWED
    // function defined in step 2
    notification_test = createNotificationInstance({notificationType: 'html'});
    notification_test.ondisplay = function() { //////console.log("displayed")
      };
    notification_test.onclose = function() { //////console.log("closed")
     };
    notification_test.show();
  } else {
    window.webkitNotifications.requestPermission();
  }
  
  
}

$('#show_button').live('click', function (e) {
    send_notification_to_desktop();
});


/*
    var worker = new Worker("worker.js");

    worker.onmessage = function(event) {
      document.getElementById("body").textContent = event.data;
      ////console.log("Got: " + event.data + "\n");
    };

    worker.onerror = function(error) {
      ////console.log("Worker error: " + error.message + "\n");
      throw error;
    };

    worker.postMessage("5");
*/


	function get_follows() {
		    try {

				new_follows_transaction();
     			Buleys.index = Buleys.objectStore;
      
				var cursorRequest = Buleys.index.getAll();
				cursorRequest.onsuccess = function(event){
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
					  return;
					}
					
					//console.log("get_follows(): Indexed on: ", objectCursor);
					//console.log("get_follows(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
							//console.log("get_follows(): " + item.key);	
							parse_single_topic(item.key);
							//typeof category.key !== 'undefined' || category.key !== null						
						});				
					}

				};
				request.onerror = function(event){
					//console.log("get_follows(): Could not open Object Store", event);
				};
      
		    }
		    catch (e) {
		      //console.log("get_follows(): Could not open Index, create it first");
		      //console.log(e);
		    }
    

	}

 $('html').bind('mousemove', function(e){
	Buleys.mouse.mouse_x = e.pageX;
	Buleys.mouse.mouse_y= e.pageY;
 });
 
function getKeys(obj){
   var keys = [];
   if(typeof obj !== "undefined") {
	   $.each(obj, function (key,obj) {
	      keys.push(key);
	   });
   	return keys.length;
   } else  { 
   	return 0;
   }
}

function do_work() {
	if(Buleys.queues.pending_crawls.length > 0) {
		do_pending_crawl();
	} else {
		get_follows();
	}

	//populate inbox
	var length_of_new = 0;
		length_of_new = getKeys(Buleys.queues.new_items);
		
		if( length_of_new > 0 ) {
			
			var topic_id = type+"_"+slug;
			////console.log("deleting: ", Buleys.queues.new_items[topic_id]);
			if(typeof Buleys.queues.new_items[topic_id] !== "undefined") {
				delete Buleys.queues.new_items[topic_id];
			}

			var length_post_delete = getKeys(Buleys.queues.new_items);
			
			if( length_post_delete > 0 ) {
	
			
				////console.log("do_work(): checking for new items: ",Buleys.queues.new_items,length_of_new);
				if( typeof jQuery("#minimize_inbox") !== "undefined" && length_of_new > 0 ) {
					jQuery("#get_inbox img").attr('src',"http://buleys.com/images/icons/fugue-shadowless/inbox-document.png").parent().parent().removeClass('empty_inbox').addClass('waiting_inbox');
				}
			
			} else {
			
				jQuery("#get_inbox img").attr('src',"http://buleys.com/images/icons/fugue-shadowless/inbox.png").parent().parent().addClass('empty_inbox').removeClass('waiting_inbox');

			
			}
	
		save_queues();
		save_settings();
			
	}	
	
	
	//do timeout increase/decrease
	
	if(Buleys.mouse.mouse_y_snapshot === Buleys.mouse.mouse_y && Buleys.mouse.mouse_x_snapshot === Buleys.mouse.mouse_x) {
		if(Buleys.settings.crawl_speed >= Buleys.settings.crawl_min) { 
			Buleys.settings.crawl_speed = Buleys.settings.crawl_speed * Buleys.settings.crawl_increment;
		} else {
			Buleys.settings.crawl_speed = Buleys.settings.crawl_min;
		}
	} else {
		if(Buleys.settings.crawl_speed <= Buleys.settings.crawl_max) { 
			Buleys.settings.crawl_speed = Buleys.settings.crawl_speed * Buleys.settings.crawl_deincrement;
		} else {
			Buleys.settings.crawl_speed = Buleys.settings.crawl_max;
		}

		Buleys.mouse.mouse_y_snapshot = Buleys.mouse.mouse_y;
		Buleys.mouse.mouse_x_snapshot = Buleys.mouse.mouse_x;
	}
		if(jQuery(".unseen").length > 0) {
			window.document.title = window.document.title.replace(/[|\s]*?Buley's/,"");
			window.document.title = window.document.title.replace(/\(.*?\)[|\s]*?/g,"") + " (" + jQuery(".unseen").length +") | Buley's";
		} else {
			window.document.title = window.document.title.replace(/[\s]?\(.*?\)/g,"");
		}	
	setTimeout('do_work()',Buleys.settings.crawl_speed);	

}

function do_pending_crawl() {

	var topic_slug = Buleys.queues.pending_crawls.splice(0, 1);

	var split_string = topic_slug[0].split("_", 1);
	//console.log("do_pending_crawl() topic_slug, split_string: ",topic_slug,split_string);	
	var type_to_get = split_string[0];
	var company_to_get = topic_slug[0].replace( (split_string[0] + "_"), "" );
	////console.log("do_pending_crawl() result: ",type_to_get,company_to_get);	

	

	var the_url;
		the_url = "http://static.buleys.com/js/collections/" + type_to_get + "/" + company_to_get + ".js";

		$.ajax({
			//url: "/feedback/index.php",
			url: the_url,
			dataType: 'jsonp',
			jsonpCallback: 'load_collection',
			error: function() {
				$("#index").html("<li class='item'>No results.</li>");
			},
			success: function(data){
				
				//console.log( data.items, type_to_get, company_to_get );
				add_items( data.items, type_to_get, company_to_get );
				
				

			}
		});

	
	}
	
	
function parse_single_topic(topic_slug) {

	var split_string = topic_slug.split("_");
	var type_to_get = split_string[0];
	var company_to_get = split_string[1];
	////console.log("parse_single_topic() result: ",type_to_get,company_to_get);	

	var item = Buleys.queues.pending_crawls.slice(0, 1);
	Buleys.queues.pending_crawls.push(topic_slug);
	////console.log("parse_single_topic(): pending_crawl added: ", Buleys.queues.pending_crawls);
	

}


function notify_user_of_new_items(number, thetype, thecompany) {
alert(number + " " + thetype + " " + thecompany);
////console.log("notify_user_of_new_items(): " + number + " " + thetype + " " + thecompany);

if( (type === thetype && thecompany === slug) || type == "home" || typeof type === "undefined" ) {
	flash_console("<p>" + number + " new items added to " + thetype + " " + thecompany + " </p>");
}

}

function flash_console(message) {

	send_to_console(message);
	
		jQuery("#console_wrapper").stop(true).animate({
			opacity: 1,
			
			
		}, 500);

		jQuery("#console_wrapper").stop(true).animate({
			opacity: 0,
			
			
		}, 500);


}



function load_settings_into_dom() {

				new_settings_transaction();
			//console.log("load_settings_into_dom() to begin", objectStore);
     			Buleys.index = Buleys.objectStore.index();
 			////console.log("load_settings_into_dom() index: ",Buleys.index);
    
				var cursorRequest = Buleys.objectStore.getAll();
				cursorRequest.onsuccess = function(event){

					new_settings_transaction();
					//console.log("load_settings_into_dom(): cursorRequest ", cursorRequest);
					var objectCursor = cursorRequest.result;
					if (!objectCursor) {
						//console.log("load_settings_into_dom(): no objectCursor, bailing");
					  return;
					}
					
					//console.log("load_settings_into_dom(): Indexed on link; ", objectCursor);
					//console.log("load_settings_into_dom(): cursor: " + objectCursor.length);
					
					if(objectCursor.length >= 0)  {
						jQuery.each(objectCursor, function(k,item) {
						//console.log("load_settings_into_dom(): setting, value ", k, item);
							Buleys.settings[k] = item;							
							//console.log("load_settings_into_dom(): new setting ", Buleys.settings[k]);
						});				
					}

				};
				request.onerror = function(event){
					//console.log("load_settings_into_dom(): Could not open Object Store", event);
				};
      
		   
}      



function add_topics_to_mini_inbox() {

		//console.log("add_topics_to_mini_inbox(): new items, limit ", Buleys.queues.new_items, Buleys.settings.mini_inbox_topic_count);

		jQuery("#mini_inbox_list").html('');
		var item_count = 0;
		if(getKeys(Buleys.queues.new_items) > 0) {
		$.each(Buleys.queues.new_items, function(topic_id, count) {
	   		if(item_count <= Buleys.settings.mini_inbox_topic_count) {
	   			//add item to inbox
				//console.log("add_topics_to_mini_inbox(): ",topic_id, count);
	   			add_topic_to_mini_inbox(topic_id, count);
	   			item_count++;
	   		 
	   		} else {
				//console.log("add_topics_to_mini_inbox(): too many ",topic_id, count);
	   		}
		});
		} else {
			jQuery("#mini_inbox_list").html('<li>No new items</li>');
		}
		       
		        
		        
}	


function add_topic_to_mini_inbox(topic_id, count) {

		new_topics_transaction();
		////console.log("get_page_topic_info(): type: " + the_type + " key: " + the_key);
		////console.log("get_page_topic_info(): " + the_type.toLowerCase() + "_" + the_key.toLowerCase() );
		var item_request = Buleys.objectStore.get(topic_id);
	
		item_request.onsuccess = function(event){
			////console.log("get_page_topic_info(): " + event);
			//Buleys.objectId = item_request.result.author;
			////console.log("get_page_topic_info(): "  + item_request.result);
			if(typeof item_request.result == 'undefined' || item_request.result == "") {
				//console.log("get_page_topic_info(): topic info NOT found");
	var split_string = topic_id.split("_", 1);
	//console.log("add_topic_to_mini_inbox() topic_slug, split_string: ",topic_id,split_string);	
	var type_to_get = split_string[0];
	var company_to_get = topic_id.replace( (split_string[0] + "_"), "" );

					jQuery("#mini_inbox_list").append("<li><a href='/" + type_to_get + "/" + company_to_get + "' class='topic_name'>" + topic_id + "</a> (" + count + ")</li>");
				
			} else {
				//console.log("get_page_topic_info(): topic info found");
				if(typeof item_request.result.name != 'undefined') {
					jQuery("#mini_inbox_list").append("<li><a href='/" + item_request.result.type + "/" + item_request.result.key + "' class='topic_name'>" + item_request.result.name + "</a> (" + count + ")</li>");
				}
				/*
				if(typeof item_request.result.subsector != 'undefined') {
					jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.subsector).toLowerCase() + "' class='sector_name'>" + item_request.result.subsector + "</a>");
				}

				if(typeof item_request.result.sector != 'undefined') {
					jQuery("#page_meta").append("<a href='/sector/" + getURLSlug(item_request.result.sector).toLowerCase() + "' class='subsector_name'>" + item_request.result.sector + "</a>");
				}
				*/

	
			}
		};
	
		item_request.onerror = function(e){
			////console.log("Could not get object");
			////console.log(e);
		};
	
	
}


function save_queues() {
		//do setting update for pending
		add_or_update_queue("new_items", Buleys.queues.new_items);
		add_or_update_queue("pending_crawls", Buleys.queues.pending_crawls);

}

function save_settings() {
		//do setting update for pending
		add_or_update_setting("profile", Buleys.profile);

}


/*
//via http://flexknowlogy.learningfield.org/2008/06/26/setting-font-size-proportional-to-window-size/
var font_percent = .014;

function runit(){

  msg='';
  msg=document.body.clientWidth;
  	var font_math = Math.round(font_percent*msg*1);
  	////console.log("runit(): ",font_math);
    jQuery("body").css("font-size",font_math);
}

var nn4_prev_width, nn4_prev_height, is_nn4 = false;
window.onload=function(){addWinResizeListener(runit);runit();}

function addWinResizeListener(fn){
  if(window.addEventListener){
    window.addEventListener('resize', fn, false);
  }else if(window.attachEvent){
    window.attachEvent('onresize', fn);
  }else if(document.layers && typeof(window.innerWidth)!='undefined'){
    nn4_prev_width=window.innerWidth;
    nn4_prev_height=window.innerHeight;
    is_nn4=true;
    setTimeout("nn_resize()", 500);
  }else{
    window.onresize=fn;
  }
}

function nn_resize(){
  if(window.innerWidth != nn4_prev_width || window.innerHeight != nn4_prev_height){
    runit();
  }else {
    setTimeout("nn_resize()", 500);
  }
}
*/


// new 
	function get_favorites(type_filter, slug_filter, begin_timeframe, end_timeframe) {
	
		//console.log("get_favorites(): type: " + type + " slug: " + slug);
	
		var begin_date = 0;
		if(typeof begin_timeframe == "undefined") { 
			begin_date =  0;//begin_date - 60*60*24*14*1000;
		} else {
			begin_date = parseInt( begin_timeframe );
		}
		
		var end_date = 0;
		if(typeof end_timeframe == "undefined") { 
			end_date =  new Date().getTime();
		} else {
			end_date = parseInt( end_timeframe );
		}
			
			
		new_categories_transaction();
		//console.log("get_items objectStore",slug_filter,Buleys.objectStore);
			Buleys.index = Buleys.objectStore.index("slug");
		var cursorRequest = Buleys.index.getAll(slug_filter);
		//console.log("get_items cursor_request",cursorRequest);
		cursorRequest.onsuccess = function(event){
			//console.log("get_items(): event; ", event);
			var objectCursor = cursorRequest.result;
			if (!objectCursor) {
			  return;
			}

			//console.log("get_items(): Indexed on link; ", objectCursor);

			if(objectCursor.length > 1)  {
				jQuery.each(objectCursor, function(k,item) {
				
				
					//console.log("get_items(): item: ", item.link);
					
					//console.log("get_item(): check_if_item_is_favorite(): ", item.link);
					
					new_favorite_transaction();
			
					var item_request_2 = Buleys.objectStore.get(item.link);
				
					item_request_2.onsuccess = function(event){
						
						//console.log("get_item(): check_if_item_is_favorite(): done", item_request_2.result);
						
						new_item_transaction();

						if(typeof item_request_2.result !== 'undefined') {
							var item_request = Buleys.objectStore.get( item.link );
						
							item_request.onsuccess = function(event){
								//xx
								if(typeof item_request.result !== 'undefined') {
									//console.log("get_fav() value", item_request.result.value);
										//console.log("get_favorites(): check_if_item_is_favorite(): is favorite1", item_request.result);
									if(typeof item_request.result.link !== 'undefined') {
										//console.log("get_favorites(): check_if_item_is_favorite(): is favorite2", item_request.result.value);
										
										if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
											get_item_raw(item_request.result.link);
										}			
						
									} else {
										//console.log("get_favorites(): check_if_item_is_favorite(): is NOT favorite");
									}
								}
								//xx
							};
						}
						
					};
				
					item_request_2.onerror = function(e){
						////////console.log("get_item(): check_if_item_is_archived(): Could not get object");
						////////console.log(e);
										
							if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
								add_item_to_results( item );
								check_if_item_is_favorited(item.link);				
								check_if_item_is_read(item.link);
								check_if_item_is_seen(item.link);
							}
			
					};	
					
					
					//get_item( item.link );
					
					
					
				});				
				//objectCursor["continue"]();
			} else {
				get_item( objectCursor.link );
			}
		};
		cursorRequest.onerror = function(event){
			//console.log("get_items(): Could not open Object Store", event);
		};


			/*
			
		
		Buleys.keyRange = new IDBKeyRange.bound(begin_date, end_date, true, false);
		//console.log("get_favorites(): Range Defined", Buleys.keyRange);
		
		Buleys.onCursor = function(callback){
			new_favorite_transaction();
			//console.log("get_favorites(): callback objectStore",callback,Buleys.objectStore);
			Buleys.index = Buleys.objectStore.index("modified");
			var favorite_item_request = Buleys.index.openCursor(Buleys.keyRange);
			
			favorite_item_request.onsuccess = function(event){

				//console.log("get_favorites(): The event: ",event);
				//console.log("get_favorites(): The request: ",favorite_item_request);
				
				if(typeof favorite_item_request.result !== "undefined") {
					//console.log("get_favorites(): The request result: ",favorite_item_request.result);
					//console.log("get_favorites(): The request result value: ",favorite_item_request.result.value);
					Buleys.cursor = favorite_item_request.result;
					//console.log("get_favorites(): The cursor: ",Buleys.cursor);
					
					//console.log("get_favorites(): slugs: ",slug_filter,Buleys.cursor.value.topic_slug);
					//console.log("get_favorites(): types: ",type_filter,Buleys.cursor.value.topic_type);
					
					if (typeof type_filter !== 'undefined' && typeof slug_filter !== 'undefined' && type_filter == Buleys.cursor.value.topic_type && slug_filter == Buleys.cursor.value.topic_slug) { 
					//console.log("get_favorites(): get_item: ",Buleys.cursor.value.item_link);
						get_item( Buleys.cursor.value.item_link );
						
					} else if (typeof type !== 'undefined' && type_filter == "favorites") {
					//console.log("get_favorites(): get_item: ",Buleys.cursor.value.item_link);
						get_item( Buleys.cursor.value.item_link );
					
					//no slug filter, no type filter
					} else if (typeof type_filter == 'undefined' && slug_filter == 'undefined') {
					//console.log("get_favorites(): get_item: ",Buleys.cursor.value.item_link);
						get_item( Buleys.cursor.value.item_link );
					
					}  else {
						//console.log("get_favorites() didn't match the filter", type_filter, slug_filter);
					}

					Buleys.cursor["continue"]();
				}
			};
							    
			favorite_item_request.onerror = function(event){
				//console.log("get_favorites(): Could not open cursor", Buleys.cursor);
				//console.log(e);
			};
			
			
		Buleys.onCursor(function(){
			//console.log("Cursor Created", Buleys.cursor);
		});
		
		
		};
			*/
			
		
	}
	
	
	//
	function get_favorite( favorite_slug ) {
		////////console.log("get_favorite(): adding: " + favorite_slug);
		
		if(typeof favorite_slug !== 'undefined') {

			new_favorite_transaction();
			var favorite_request_1 = Buleys.objectStore.get(favorite_slug);
		
			favorite_request_1.onsuccess = function(event){
				////////console.log("get_favorite(): 1: done" + favorite_request_1);
				////////console.log(event.result);
				//Buleys.objectId = favorite_request.result.author;
				if(typeof favorite_request_1.result != 'undefined') {
	
	
					//check for archival
					//xxx
					////////console.log("get_favorite(): check_if_favorite_is_archived: " + favorite_slug);
			
			new_archived_transaction();
	
			var favorite_request_2 = Buleys.objectStore.get(favorite_slug);
		
			favorite_request_2.onsuccess = function(event){
				////////console.log("get_favorite(): check_if_favorite_is_archived(): done" + favorite_request_2.result);
				if(typeof favorite_request_2.result !== 'undefined') {
					////////console.log("check_if_favorite_is_archived(): is archived" + event.result);
	
	
				} else {
					////////console.log("get_favorite(): check_if_favorite_is_archived: is NOT archived");
	
									
					if(jQuery("#" + favorite_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
						add_favorite_to_results( favorite_request_1.result );
						check_if_favorite_is_favorited(favorite_request_1.result.link);				
						check_if_favorite_is_read(favorite_request_1.result.link);
						check_if_favorite_is_seen(favorite_request_1.result.link);
					}
					
				}
			};
		
			favorite_request_2.onerror = function(e){
				////////console.log("get_favorite(): check_if_favorite_is_archived(): Could not get object");
				////////console.log(e);
								
					if(jQuery("#" + favorite_request_1.result.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
						add_favorite_to_results( favorite_request_1.result );
						check_if_favorite_is_favorited(favorite_request_1.result.link);				
						check_if_favorite_is_read(favorite_request_1.result.link);
						check_if_favorite_is_seen(favorite_request_1.result.link);
					}
	
			};
	
	
					//end xxx
	
					
	
	
				}
			};
		
			favorite_request_1.onerror = function(e){
				//////console.log("get_favorite(): Could not get object");
				////////console.log(e);
		
			};
		
		}
	
	}

	function get_favorite_for_console( favorite_slug ) {
		
		new_favorite_transaction();
		////////console.log("get_favorite_for_console: " + favorite_slug);
		
		//////////console.log(favorite_slug);
		var favorite_request = Buleys.objectStore.get(favorite_slug);
	
		favorite_request.onsuccess = function(event){
			//////////console.log(typeof favorite_request.result.id);
			//Buleys.objectId = favorite_request.result.author;
			if(typeof favorite_request.result != 'undefined' && typeof favorite_request.result.id == 'string') {
				var html_snippit = "<div id='console_" + favorite_request.result.id.replace(/[^a-zA-Z0-9-_]+/g,"") + "'>";
				html_snippit = html_snippit + "<h3><a href='" + favorite_request.result.id + "'>" + favorite_request.result.title + "</a></h3>";
				html_snippit = html_snippit + "<p>" + favorite_request.result.author + "</p>";
				html_snippit = html_snippit + "</div>";
				
				send_to_console(html_snippit);
			}
		};
	
		favorite_request.onerror = function(e){
			////////console.log("Error: " + e);
			//////////console.log(e);
		};
	
	}

	function get_favorite_for_overlay( favorited_url ) {
		
		new_item_transaction();
		////////console.log("get_favorite_for_overlay: " + favorite_slug);
		
		//////////console.log(favorite_slug);
		var favorite_request = Buleys.objectStore.get(( favorited_url ));
	
		favorite_request.onsuccess = function(event){
			////////console.log("get_favorite_for_overlay(): type of result: " + typeof favorite_request.result.link);
			//Buleys.objectId = favorite_request.result.author;
			if(typeof favorite_request.result != 'undefined' && typeof favorite_request.result.link == 'string') {

			var html_snippit = '<div id="overlay_right"><div class="sidebar_close_link"><a href="#" class="close_sidebar_link" id="' + favorite_slug + '"><img src="/images/icons/fugue-shadowless/cross-button.png"></a></div>' + "<h3 id='overlay_" + favorite_slug.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + favorite_request.result.link + "'>" + favorite_request.result.title + "</a></h3></div><div id='overlay_left'></div><div id='overlay_controls'><a href='" + favorite_slug + "' class='favorite_favorite'>Favorite</a>&nbsp;<a href='" + favorite_slug + "' class='unfavorite_favorite'>Unfavorite</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_read'>Mark as read</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_unread'>Mark as unread</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_seen'>Mark as seen</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + favorite_slug + "' class='archive_favorite'>Archive</a>&nbsp;<a href='" + favorite_slug + "' class='delete_favorite'>Delete</a>&nbsp;<a href='" + favorite_slug + "' class='unarchive_favorite'>Unarchive</a>&nbsp;<a href='" + favorite_slug + "' class='vote_favorite_up'>Vote up</a>&nbsp;<a href='" + favorite_slug + "' class='vote_favorite_down'>Vote down</a>&nbsp;<a href='" + favorite_slug + "' class='close_favorite_preview'>Close preview</a></div>";
			
			//<div id='overlay_controls'><a href='" + favorite_slug + "' class='favorite_favorite'>Favorite</a>&nbsp;<a href='" + favorite_slug + "' class='unfavorite_favorite'>Unfavorite</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_read'>Mark as read</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_unread'>Mark as unread</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_seen'>Mark as seen</a>&nbsp;<a href='" + favorite_slug + "' class='mark_favorite_as_unseen'>Mark as unseen</a>&nbsp;<a href='" + favorite_slug + "' class='archive_favorite'>Archive</a>&nbsp;<a href='" + favorite_slug + "' class='delete_favorite'>Delete</a>&nbsp;<a href='" + favorite_slug + "' class='unarchive_favorite'>Unarchive</a>&nbsp;<a href='" + favorite_slug + "' class='vote_favorite_up'>Vote up</a>&nbsp;<a href='" + favorite_slug + "' class='vote_favorite_down'>Vote down</a>&nbsp;<a href='" + favorite_slug + "' class='close_favorite_preview'>Close preview</a></div>
				if( typeof favorite_request.result.author !== 'undefined' &&  favorite_request.result.author.length > 0 ) { 
					//html_snippit = html_snippit + "<p>" + favorite_request.result.author + "</p>";
				}
				////////console.log("get_favorite_for_overlay(): sending to overlay: " + html_snippit);
				send_to_overlay(html_snippit);
			}
		};
	
		favorite_request.onerror = function(e){
			////////console.log("Error: " + e);
			//////////console.log(e);
		};
	
	}


				
	function add_favorite_to_results(item) {

				//////console.log("add_item_to_results(): ", item);
					var id = item.link.replace(/[^a-zA-Z0-9-_]+/g,"");
					////////console.log("add_item_to_results(): " + jQuery("#" + id).length );
					if( !( jQuery("#" + id ).length ) ) {
					
					
						jQuery("<li class='item' modified= '" + item.modified + "'  index-date= '" + item.index_date + "' published-date= '" + item.published_date + "' id='" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"") + "'><a href='" + item.link + "'>" + item.title + "</a><a class='examine_item' href='http://buleys.com/images/icons/fugue-shadowless/magnifier.png'></a></li>").hide().prependTo("#results").fadeIn('slow');
						
						
						
					} else {
						////////console.log("add_item_to_results(): duplicate!");
						//should report the dupe
						//https://www.pivotaltracker.com/story/show/9307085 in pivotal
					}
	}
	


//

// new 
	function get_archived(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
		//console.log("get_archived(): type: " + type + " slug: " + slug);
		
		if(typeof make_inverse == "undefined") {
			make_inverse = false;
		}
	
		var begin_date = 0;
		if(typeof begin_timeframe == "undefined" || begin_timeframe == null) { 
			begin_date =  0;//begin_date - 60*60*24*14*1000;
		} else {
			begin_date = parseInt( begin_timeframe );
		}
		
		var end_date = 0;
		if(typeof end_timeframe == "undefined" || end_timeframe == null) { 
			end_date =  new Date().getTime();
		} else {
			end_date = parseInt( end_timeframe );
		}
			
			
		new_categories_transaction();
		//console.log("get_archived objectStore",slug_filter,Buleys.objectStore);
			Buleys.index = Buleys.objectStore.index("slug");
		var cursorRequest = Buleys.index.getAll(slug_filter);
		//console.log("get_archived cursor_request",cursorRequest);
		cursorRequest.onsuccess = function(event){
			//console.log("get_archived(): event; ", event);
			var objectCursor = cursorRequest.result;
			if (!objectCursor) {
			  return;
			}

			//console.log("get_archived(): Indexed on link; ", objectCursor);

			if(objectCursor.length > 1)  {
				jQuery.each(objectCursor, function(k,item) {
				
				
					//console.log("get_archived(): item: ", item.link);
					
					//console.log("get_archived(): check_if_item_is_favorite(): ", item.link);
					
					new_archived_transaction();
			
					var item_request_2 = Buleys.objectStore.get(item.link);
					item_request_2.onsuccess = function(event){
						
						if(typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
							//console.log("get_archived(): check_if_item_is_archived(): done", item_request_2.result);
							
							new_item_transaction();

							var item_request = Buleys.objectStore.get( item_request_2.result.link );
						
							item_request.onsuccess = function(event){
								//xx
								if(typeof item_request.result !== 'undefined') {
									//console.log("get_fav() value", item_request.result.value);
										//console.log("get_archived(): check_if_item_is_favorite(): is favorite1", item_request.result);
									if(typeof item_request.result.link !== 'undefined') {
										//console.log("get_archived(): check_if_item_is_favorite(): is favorite2", item_request.result.value);
										
										if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
											get_item_raw(item_request.result.link);
										}			
						
									} else {
										//console.log("get_archived(): check_if_item_is_favorite(): is NOT favorite");
									}
								}
								//xx
							};
						} else if ( make_inverse == true ) {

							new_item_transaction();

							var item_request = Buleys.objectStore.get( item.link );
						
							item_request.onsuccess = function(event){
								//xx
								if(typeof item_request.result !== 'undefined') {
									//console.log("get_fav() value", item_request.result.value);
										//console.log("get_archived(): get_item(): is favorite1", item_request.result);
									if(typeof item_request.result !== 'undefined') {
										//console.log("get_archived(): get_item(): is favorite2", item_request.result.value);
										
										if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
											get_item_raw(item_request.result.link);
										}			
						
									} else {
										//console.log("get_archived(): get_item(): is NOT favorite");
									}
								}
								//xx
							};
						
						}
						
					};
					
					
					
					
					//get_item( item.link );
					
					
					
				});				
				//objectCursor["continue"]();
			} else {
				get_item( objectCursor.link );
			}
		};
		cursorRequest.onerror = function(event){
			//console.log("get_items(): Could not open Object Store", event);
		};

			
		
	}



// new 
	function get_deleted(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
		//console.log("get_deleted(): type: " + type + " slug: " + slug);
		
		if(typeof make_inverse == "undefined") {
			make_inverse = false;
		}
	
		var begin_date = 0;
		if(typeof begin_timeframe == "undefined" || begin_timeframe == null) { 
			begin_date =  0;//begin_date - 60*60*24*14*1000;
		} else {
			begin_date = parseInt( begin_timeframe );
		}
		
		var end_date = 0;
		if(typeof end_timeframe == "undefined" || end_timeframe == null) { 
			end_date =  new Date().getTime();
		} else {
			end_date = parseInt( end_timeframe );
		}
			
		new_categories_transaction();
		//console.log("get_deleted objectStore",slug_filter,Buleys.objectStore);
			Buleys.index = Buleys.objectStore.index("slug");
		var cursorRequest = Buleys.index.getAll(slug_filter);
		//console.log("get_deleted cursor_request",cursorRequest);
		cursorRequest.onsuccess = function(event){
			//console.log("get_deleted(): event; ", event);
			var objectCursor = cursorRequest.result;
			if (!objectCursor) {
			  return;
			}

			//console.log("get_deleted(): Indexed on link; ", objectCursor);

			if(objectCursor.length > 1)  {
				jQuery.each(objectCursor, function(k,item) {
				
				
					//console.log("get_deleted(): item: ", item.link);
					
					//console.log("get_deleted(): check_if_item_is_deleted: ", item.link);
					
					new_deleted_transaction();
			
					var item_request_2 = Buleys.objectStore.get(item.link);
					item_request_2.onsuccess = function(event){
						
						if(typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
							//console.log("get_deleted(): check_if_item_is_deleted: done", item_request_2.result);
							
							new_item_transaction();

							var item_request = Buleys.objectStore.get( item_request_2.result.link );
						 
							item_request.onsuccess = function(event){
								//xx
								if(typeof item_request.result !== 'undefined' && make_inverse !== true) {
									//console.log("get_fav() value", item_request.result.value);
								
										if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
											get_item_raw_no_trash(item_request.result.link);
										}			
						
								}
								
							};
						} else if ( typeof item_request_2.result == 'undefined' && make_inverse == true ) {

							new_item_transaction();

							var item_request = Buleys.objectStore.get( item.link );
						
							item_request.onsuccess = function(event){
								//xx
								if(typeof item_request.result !== 'undefined') {
									//console.log("get_fav() value", item_request.result.value);
										//console.log("get_deleted(): get_item(): is favorite1", item_request.result);
									if(typeof item_request.result !== 'undefined') {
										//console.log("get_deleted(): get_item(): is favorite2", item_request.result.value);
										
										if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
											get_item_raw(item_request.result.link);
										}			
						
									} else {
										//console.log("get_deleted(): get_item(): is NOT favorite");
									}
								}
								//xx
							};
						
						}
						
					};
					
					
					
					
					//get_item( item.link );
					
					
					
				});				
				//objectCursor["continue"]();
			} else {
				get_item( objectCursor.link );
			}
		};
		cursorRequest.onerror = function(event){
			//console.log("get_items(): Could not open Object Store", event);
		};

			
		
	}


// new 
	function get_read(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
		//console.log("get_read(): type: " + type + " slug: " + slug);
		
		if(typeof make_inverse == "undefined") {
			make_inverse = false;
		}
	
		var begin_date = 0;
		if(typeof begin_timeframe == "undefined" || begin_timeframe == null) { 
			begin_date =  0;//begin_date - 60*60*24*14*1000;
		} else {
			begin_date = parseInt( begin_timeframe );
		}
		
		var end_date = 0;
		if(typeof end_timeframe == "undefined" || end_timeframe == null) { 
			end_date =  new Date().getTime();
		} else {
			end_date = parseInt( end_timeframe );
		}
			
		new_categories_transaction();
		//console.log("get_read objectStore",slug_filter,Buleys.objectStore);
			Buleys.index = Buleys.objectStore.index("slug");
		var cursorRequest = Buleys.index.getAll(slug_filter);
		//console.log("get_read cursor_request",cursorRequest);
		cursorRequest.onsuccess = function(event){
			//console.log("get_read(): event; ", event);
			var objectCursor = cursorRequest.result;
			if (!objectCursor) {
			  return;
			}

			//console.log("get_read(): Indexed on link; ", objectCursor);

			if(objectCursor.length > 1)  {
				jQuery.each(objectCursor, function(k,item) {
				
				
					//console.log("get_read(): item: ", item.link);
					
					//console.log("get_read(): check_if_item_is_read: ", item.link);
					
					new_status_transaction();
			
					var item_request_2 = Buleys.objectStore.get(item.link);
					item_request_2.onsuccess = function(event){
						
						if(typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
							//console.log("get_read(): check_if_item_is_read: done", item_request_2.result);
							
							if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
								get_item_raw(item_request_2.result.link);
							}			
			
						} else if ( typeof item_request_2.result == 'undefined' && make_inverse == true ) {

				
							if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
								get_item_raw(item.link);
							}			
												
						}
						
					};
					
					
					
					
					//get_item( item.link );
					
					
					
				});				
				//objectCursor["continue"]();
			} else {
				get_item( objectCursor.link );
			}
		};
		cursorRequest.onerror = function(event){
			//console.log("get_items(): Could not open Object Store", event);
		};

			
		
	}


// new 
	function get_seen(type_filter, slug_filter, begin_timeframe, end_timeframe, make_inverse) {
	
		//console.log("get_seen(): type: " + type + " slug: " + slug);
		
		if(typeof make_inverse == "undefined") {
			make_inverse = false;
		}
	
		var begin_date = 0;
		if(typeof begin_timeframe == "undefined" || begin_timeframe == null) { 
			begin_date =  0;//begin_date - 60*60*24*14*1000;
		} else {
			begin_date = parseInt( begin_timeframe );
		}
		
		var end_date = 0;
		if(typeof end_timeframe == "undefined" || end_timeframe == null) { 
			end_date =  new Date().getTime();
		} else {
			end_date = parseInt( end_timeframe );
		}
			
		new_categories_transaction();
		//console.log("get_seen objectStore",slug_filter,Buleys.objectStore);
			Buleys.index = Buleys.objectStore.index("slug");
		var cursorRequest = Buleys.index.getAll(slug_filter);
		//console.log("get_seen cursor_request",cursorRequest);
		cursorRequest.onsuccess = function(event){
			//console.log("get_seen(): event; ", event);
			var objectCursor = cursorRequest.result;
			if (!objectCursor) {
			  return;
			}

			//console.log("get_seen(): Indexed on link; ", objectCursor);

			if(objectCursor.length > 1)  {
				jQuery.each(objectCursor, function(k,item) {
				
				
					//console.log("get_seen(): item: ", item.link);
					
					//console.log("get_seen(): check_if_item_is_seen: ", item.link);
					
					new_seen_transaction();
			
					var item_request_2 = Buleys.objectStore.get(item.link);
					item_request_2.onsuccess = function(event){
						if(typeof item_request_2.result !== 'undefined' && make_inverse !== true) {
							//console.log("get_seen(): check_if_item_is_seen: item is seen done", item_request_2.result);
							
							if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
								get_item(item_request_2.result.link);
							}			
			
							
						} else if ( typeof item_request_2.result == 'undefined' && make_inverse == true ) {

							//console.log("get_seen(): get_item(): is unseen2", item_request_2.result);
										
										if(jQuery("#" + item.link.replace(/[^a-zA-Z0-9-_]+/g,"")).length <= 0) {
											get_item(item.link);
										}			
						
							
						
						}
						
					};
					
					
					
					
					//get_item( item.link );
					
					
					
				});				
				//objectCursor["continue"]();
			} else {
				get_item( objectCursor.link );
			}
		};
		cursorRequest.onerror = function(event){
			//console.log("get_items(): Could not open Object Store", event);
		};

			
		
	}

	function get_account() {
	
	console.log("get_account(): ");
	
	}

	function get_registration() {
	
	console.log("get_registration(): ");
	
	}

	function get_confirmation() {
	
	console.log("get_confirmation(): ");
	
	}

</script>

</head>
<style>

#main a { 
color:#000;
}
#main a:visited { 
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
	right:6%;
	position:absolute;
	margin:4.5% 1% 0 1%;
	clear:right;
	width:50%;
}
#console_wrapper {
	left:8%;
	width:45%;
	bottom:5%;
	background:url('/images/20percenttransparency.png') repeat;
	z-index: 10000;
	position: fixed;
	clear:left;
}
#console {
	float:left;
	margin:0 5px 0 5px;
	padding:10px;
}
#console_controls {
	clear:both;
	float:right;
	margin:10px;
}
#console_controls a, #console_controls a:visited {
	color:#000;
}

#console_close_button {
	padding: 0 20px 20px 20px;
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

#login_box {
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

#login_box a {
	color:#fff;
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
	bottom:0;
	right:0;
	position: fixed;
	z-index:5000;
	padding:2%;
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
	float:right;
	padding: 0 10px 10px 10px;
}

#header {
position: fixed;
top:0;
right:0;
left:0;
padding:1% 1% 0% 1%;
z-index: 10000;
background:url('/images/5percenttransparency.png') repeat;
color:#000;
border-bottom:1% solid #111;

}
a.logo {
color:#000;
text-decoration: none;
font-size:150%;
margin:-.25% 1% 1% 1%;
text-transform: uppercase;
font-weight: 100#;
text-shadow: #000 0 1% 0;
float:left;
border:1px solid #000;
padding:.25% .5% 0 .5%;
}
#page_meta {
font-size:125%;
padding-top:3px;
float:left;
}
#page_meta a {
color:#000;
}
#page_meta a:visited {
color:#000;
}
#main li a {
	color:#000;
}
#main li.seen a {
	color:#333;
}
#main li.read a {
	color:#222;
}
#main li.favorited a {
	color:#111;
}

#result_controls { 
	display: none;
}

#main li.selected {
	background:url('/images/5percenttransparency.png') repeat;
	color:#000;
	margin:0px;
	width:96%;

}

#main li.cursor {
border-left:10px solid #a60000;

}

#mini_inbox_box {
	top:40%;
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

#mini_inbox_box a {
	color:#fff;
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
	<div id='header'><a href="#" class="logo">Buley's</a><div id='page_meta'></div></div>
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
		<ul id='results'></ul>
	</div>
	<div id='overlay'></div>
	<div id='login_box'>
		<a href="#" id="dologin" class="getloginform"><img src="http://buleys.com/images/icons/fugue-shadowless/door-open-out.png"></a>
	</div>
	<div id='mini_inbox_box' class='empty_inbox'>
		<a href="#" id="get_inbox" class="getinbox empty_inbox"><img src="http://buleys.com/images/icons/fugue-shadowless/inbox.png"></a>
	</div>
	<div id='help_box'>
		<a href="#" id="dogethelpbox" class="getinbox"><img src="http://buleys.com/images/icons/fugue-shadowless/question.png"></a>
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
<script type="text/javascript" src="/js/md5.js"></script>
<script type="text/javascript" src="/js/isotope.js"></script>

</html>