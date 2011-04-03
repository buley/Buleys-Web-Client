	
	//Declare a new object child of the Buleys.settings DOM
	//this will be collected by the automatic saving cronjob

	//Buleys.settings is declared in loader.js
	
	function temporarily_disable_hotkeys() {

	} 
	
	function disable_hotkeys() {
		Buleys.settings.hotkeys.disabled = true;
	}
	
	function enable_hotkeys() {
		delete Buleys.settings.hotkeys.disabled;
	}


    $('#show_commands').live('click', function (event) {
        event.preventDefault();

        $('#result_controls').show();
    });


    $('#hide_commands').live('click', function (event) {
        event.preventDefault();
        $('#result_controls').hide();
    });


    $('#show_button').live('click', function (e) {
        send_notification_to_desktop();
    });

	
    $('html').live('keyup', function (e) {

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
	                $('#view_index').click();
	            } else {
	                $('#close_item_preview').click();
	            }
	
	
	        } else if (e.keyCode == 76) {
	
	            if (Buleys.shortcuts.s_depressed) {} else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_home').click();
	            } else {
	                $('#preview_item').click();
	
	                if (jQuery('.cursor').length > 0) {
	                    //alert(jQuery('.cursor').text());
	                }
	
	            }
	
	
	        } else if (e.keyCode == 78) {
	            $('#preview_item').click();
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
	            $('#close_all').click();
	
	
	        } else if (e.keyCode == 77) {
	            jQuery('.cursor').removeClass('cursor');
	
	
	        } else if (e.keyCode == 219) {
	            $('#preview_item').click();
	
	        } else if (e.keyCode == 221) {
	            $('#close_item_preview').click();
	
	
	        } else if (e.keyCode == 89) {
	            $('#show_commands').click();
	
	
	        } else if (e.keyCode == 85) {
	            $('#hide_commands').click();
	
	
	        } else if (e.keyCode == 65) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_all').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#select_none').click();
	            } else {}
	
	
	        } else if (e.keyCode == 82) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_unread').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_unread').click();
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_unread').click();
	            } else {
	                $('#mark_unread').click();
	            }
	
	
	        } else if (e.keyCode == 13) {
	
	
	
	        } else if (e.keyCode == 73) {
	            $('#select').click();
	
	        } else if (e.keyCode == 79) {
	            $('#deselect').click();
	
	        } else if (e.keyCode == 69) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_read').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_read').click();
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_read').click();
	            } else {
	                $('#mark_read').click();
	            }
	
	        } else if (e.keyCode == 88) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_none').click();
	            } else if (Buleys.shortcuts.d_depressed) {} else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_trash').click();
	            } else {
	                $('#delete').click();
	            }
	
	
	        } else if (e.keyCode == 67) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_archived').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_archived').click();
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_archive').click();
	            } else {
	                $('#archive').click();
	            }
	
	        } else if (e.keyCode == 86) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_unarchived').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_unarchived').click();
	            } else {
	                $('#unarchive').click();
	            }
	
	        } else if (e.keyCode == 70) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_favorites').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_favorites').click();
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_favorites').click();
	            } else {
	                $('#favorite').click();
	            }
	
	        } else if (e.keyCode == 71) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_unfavorite').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_unfavorite').click();
	            } else {
	                $('#unfavorite').click();
	            }
	
	        } else if (e.keyCode == 81) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_seen').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_seen').click();
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_seen').click();
	            } else {
	                $('#mark_seen').click();
	            }
	
	        } else if (e.keyCode == 87) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_unseen').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	                $('#deselect_unseen').click();
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_unseen').click();
	            } else {
	                $('#mark_unseen').click();
	            }
	
	        } else if (e.keyCode == 90) {
	
	            if (Buleys.shortcuts.s_depressed) {
	                $('#select_inverse').click();
	            } else if (Buleys.shortcuts.d_depressed) {
	            
	            } else if (Buleys.shortcuts.shift_depressed) {
	                $('#view_index').click();
	            } else {
	                $('#refresh').click();
	            }
	
	        } else if (e.keyCode == 73) {
	            $('#deselect').click();
	
	        } else if (e.keyCode == 79) {
	
	            $('#select').click();
	        }
			
		}

    });


    $('html').live('keydown', function (e) {

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

