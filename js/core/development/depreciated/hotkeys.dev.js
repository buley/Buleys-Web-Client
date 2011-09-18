	
	//Declare a new object child of the Buleys.settings DOM
	//this will be collected by the automatic saving cronjob

	//Buleys.settings is declared in loader.js
	
	function temporarily_disable_hotkeys(  ) {
	jQuery(document).trigger('temporarily_disable_hotkeys');


	} 
	
	function disable_hotkeys(  ) {
	jQuery(document).trigger('disable_hotkeys');

		console.log( "Disabling hotkeys" );
		console.log( Buleys.settings );
		Buleys.settings.hotkeys.disabled = true;
	}
	
	function enable_hotkeys(  ) {
	jQuery(document).trigger('enable_hotkeys');

		delete Buleys.settings.hotkeys.disabled;
	}


    $(document).bind('show_commands', function ( event ) {

        event.preventDefault();

        $('#result_controls').show();
    });


    $(document).bind('hide_commands', function ( event ) {

        event.preventDefault();
        $('#result_controls').hide();
    });


    $(document).bind('show_button', function ( e ) {

        send_notification_to_desktop();
    });

	
    $('html').live('keyup', function ( e ) {

	console.log('disabled?');
	console.log( Buleys.settings.hotkeys.disabled );
		if( (  typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" && typeof Buleys.settings.hotkeys.disabled === "undefined" ) || ( typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" ) && ( typeof Buleys.settings.hotkeys.disabled !== "undefined" && Buleys.settings.hotkeys.disabled !== true ) ) {
			//
	
	
	        if (e.keyCode == 68) {
	            Buleys.shortcuts.d_depressed = false;
	
	        } else if (e.keyCode == 83) {
	            Buleys.shortcuts.s_depressed = false;
	
	        } else if (e.keyCode == 16) {
	            Buleys.shortcuts.shift_depressed = false;
	
	
	
	
	
	        } else if (e.keyCode == 72) {
	
	            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_index');
	            } else {
	                $(document).trigger('close_item_preview');
	            }
	
	
	        } else if (e.keyCode == 76) {
	
	            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_home');
	            } else {
	                $(document).trigger('preview_item');
	
	                if (jQuery('.cursor').length > 0) {
	                    //alert(jQuery('.cursor').text());
	                }
	
	            }
	
	
	        } else if (e.keyCode == 78) {
	            $(document).trigger('preview_item');
	            if (jQuery('.selected').length > 0) {
	                jQuery('#results li.selected:first').addClass('cursor');
	            } else {
	                jQuery('#results li:first').addClass('cursor');
	            }
	
	
	        } else if (e.keyCode == 74) {
	
	            if (jQuery('.cursor').next().length > 0) {
	                jQuery('.cursor').removeClass('cursor').next().addClass('cursor');
	            } else {
	                jQuery('.cursor').removeClass('cursor');
	                jQuery('#results li:first').addClass('cursor');
	            }
	
	        } else if (e.keyCode == 75) {
	
	            if (jQuery('.cursor').prev().length > 0) {
	                jQuery('.cursor').removeClass('cursor').prev().addClass('cursor');
	            } else {
	                jQuery('.cursor').removeClass('cursor');
	                jQuery('#results li:last').addClass('cursor');
	            }
	
	
	        } else if (e.keyCode == 27) {
	            jQuery('.cursor').removeClass('cursor');
	            $(document).trigger('close_all');
	
	
	        } else if (e.keyCode == 77) {
	            jQuery('.cursor').removeClass('cursor');
	
	
	        } else if (e.keyCode == 219) {
	            $(document).trigger('preview_item');
	
	        } else if (e.keyCode == 221) {
	            $(document).trigger('close_item_preview');
	
	
	        } else if (e.keyCode == 89) {
	            $(document).trigger('show_commands');
	
	
	        } else if (e.keyCode == 85) {
	            $(document).trigger('hide_commands');
	
	
	        } else if (e.keyCode == 65) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_all');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('select_none');
	            } else {}
	
	
	        } else if (e.keyCode == 82) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unread');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unread');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_unread');
	            } else {
	                $(document).trigger('mark_unread');
	            }
	
	
	        } else if (e.keyCode == 13) {
	
	
	
	        } else if (e.keyCode == 73) {
	            $(document).trigger('select');
	
	        } else if (e.keyCode == 79) {
	            $(document).trigger('deselect');
	
	        } else if (e.keyCode == 69) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_read');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_read');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_read');
	            } else {
	                $(document).trigger('mark_read');
	            }
	        	
		} else if (e.keyCode == 88) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_none');
	            } else if (Buleys.shortcuts.d_depressed) {
		    } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_trash');
	            } else {
	                $(document).trigger('delete');
	            }
	
	
	        } else if (e.keyCode == 67) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_archived');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_archived');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_archive');
	            } else {
	                $(document).trigger('archive');
	            }
	
	        } else if (e.keyCode == 86) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unarchived');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unarchived');
	            } else {
	                $(document).trigger('unarchive');
	            }
	
	        } else if (e.keyCode == 70) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_favorites');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_favorites');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_favorites');
	            } else {
	                $(document).trigger('favorite');
	            }
	
	        } else if (e.keyCode == 71) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unfavorite');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unfavorite');
	            } else {
	                $(document).trigger('unfavorite');
	            }
	
	        } else if (e.keyCode == 81) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_seen');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_seen');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_seen');
	            } else {
	                $(document).trigger('mark_seen');
	            }
	
	        } else if (e.keyCode == 87) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_unseen');
	            } else if (Buleys.shortcuts.d_depressed) {
	                $(document).trigger('deselect_unseen');
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_unseen');
	            } else {
	                $(document).trigger('mark_unseen');
	            }
	
	        } else if (e.keyCode == 90) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $(document).trigger('select_inverse');
	            } else if (Buleys.shortcuts.d_depressed) {
	            
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $(document).trigger('view_index');
	            } else {
	                $(document).trigger('undelete');
	            }
	
	        } else if (e.keyCode == 73) {
	            $(document).trigger('deselect');
	
	        } else if (e.keyCode == 79) {
	
	            $(document).trigger('select');
	        }
			
		}

    });


    $('html').live('keydown', function ( e ) {


		if( ( typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" && typeof Buleys.settings.hotkeys.disabled === "undefined" ) || ( typeof Buleys.settings !== "undefined" &&  typeof Buleys.settings.hotkeys !== "undefined" ) && ( typeof Buleys.settings.hotkeys.disabled !== "undefined" && Buleys.settings.hotkeys.disabled !== true ) ) {

	        if (e.keyCode == 68) {
	            Buleys.shortcuts.d_depressed = true;
	
	        } else if (e.keyCode == 83) {
	            Buleys.shortcuts.s_depressed = true;
	
	        } else if (e.keyCode == 16) {
	            Buleys.shortcuts.shift_depressed = true;

        	}

		}

    });

