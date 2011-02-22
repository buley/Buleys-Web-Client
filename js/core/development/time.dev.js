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
	