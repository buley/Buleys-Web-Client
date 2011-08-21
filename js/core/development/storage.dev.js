
	function set_local_storage( set_key, set_value ) {
	jQuery(document).trigger('set_local_storage');

	    return Buleys.store.setItem(set_key, set_value);
	}
	
	function get_local_storage( get_key ) {
	jQuery(document).trigger('get_local_storage');

	    return Buleys.store.getItem(get_key);
	}
	
	
	function open_database(  ) {
	jQuery(document).trigger('open_database');

	
	    var database_open_request = window.indexedDB.open("Buleys-318", "www.buleys.com");
	    database_open_request.onsuccess = function ( event ) {

	        console.log("!!!", database_open_request.result);
	        database_is_open(database_open_request.result);
	    };
	
	    database_open_request.onerror = function ( e ) {

	
	    };
	
	
	}
	
	
	function database_is_open( open_result ) {
	jQuery(document).trigger('database_is_open');

	    Buleys.db = open_result;
	    console.log("open!", Buleys.db, Buleys.session.database_is_open);

		Buleys.session.database_is_open = true;
		load_current_page();

	
	
	/*
	      var $container = $('#results');
	
	      $container.isotope({
	        itemSelector : 'li',
	        getSortData : {
	          published : function( $elem ) {
	            return parseInt( $elem.attr('published-date') );
	          },
	          modified : function( $elem ) {
	            return parseInt( $elem.attr('modified') );
	          },
	          name : function (  $elem  ) {

	            return $elem.text();
	          }
	        }
	      });*/
	
	
	
	
	}
	
	
	
