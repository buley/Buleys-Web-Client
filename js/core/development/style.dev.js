	function getURLSlug(rough) {
	    var type = typeof rough;
	    if (type != 'object') {
	        if (rough != null && rough != "undefined" && rough != '') {
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
	