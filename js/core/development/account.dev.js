/* Account.js */

Buleys = Buleys || {};
Buleys.account = Buleys.account || {};
Buleys.account.dialog = Buleys.account.dialog || {};

Buleys.alerts = Buleys.alerts || {};
Buleys.alerts.templates = Buleys.alerts.templates || {};
Buleys.alerts.trigger = Buleys.alerts.trigger || {};

Buleys.language = Buleys.language || {};
Buleys.language.template = Buleys.language.template || {};
Buleys.language.text = Buleys.language.text || {};

Buleys.account.twitter = Buleys.account.twitter || {};
Buleys.account.facebook = Buleys.account.facebook || {};
Buleys.account.google = Buleys.account.foursquare || {};
Buleys.account.foursquare = Buleys.account.foursquare || {};

Buleys.language.template.generic_login = function( service, url ) { 
	return '<p>You are about to ask ' + service + ' to connect Reporters & Company to your account. You will be forwarded to the URL below.</p><p><code>' + url + '</code></p><p>Before coming back to Reporters & Co., you will be asked whether you want to allow ' + service + ' to let Reporters & Co. interact with it on your behalf. Are you sure you want to proceed?</p>';
}

/* Twitter */

Buleys.account.twitter.login = function( url ) {

	var on_success = function() {
		window.location = url;
	};

	var on_error = function() {
		Buleys.account.dialog.close();
	};

	var buttons = [ { text: 'OK', callback: on_success }, { text: 'Cancel', callback: on_error } ];
 
	Buleys.alerts.trigger.info( Buleys.language.template.generic_login( 'Twitter', url ), buttons );

};

/* Facebook */

/* Google */

/* Foursquare */

/* Utils */

Buleys.account.redirect = function( service, url ) {

};

/* 
 * Depends on Buleys.utilties.random
 */
Buleys.alerts.trigger.info = function( alert_text, buttons ) {

	var alert = Buleys.alerts.templates.info( alert_text, buttons );
	var html = alert.html;
	var actions = alert.actions;

	// Attach button events
	for( button in actions ) {
		jQuery( '#' + button.id ).bind( 'click', button.callback );
	}

	// Add a hidden div w/alert contents
	var div = document.createElement("div");
	div.id = Buleys.utilities.random( 12, 'string' );
	div.style = 'display:none;';
	div.innerHTML = alert_text;

	var body = document.getElementsByTagName( "body" )[ 0 ];
	body.appendChild( div );

	jQuery( '#' + div.id ).alert();
	
	// Activate Bootstrap modal dialog	
	$( '#' + div.id ).modal( { closeOnEscape: true } );

	jQuery( '#' + div.id ).modal( 'show' );

	jQuery( '#' + div.id ).bind( 'shown', function () {
		//TODO: Google Analytics
	});


}

Buleys.alerts.templates.info = function( modal_id, alert_text, buttons ) {
	var actions = [];
	var html = '<div class="alert-message block-message info" data-controls-modal="' + modal_id + '"><a class="close" href="#">×</a><p>' + alert_text + '</p><div class="alert-actions">';

	for( var button in buttons ) {
		var id = Buleys.utilities.random( 12, 'string' );	
		actions.push( { 'id': id, 'callback': button.callback } );
		html += '<a class="btn small" href="#" id="' + id + '">' + button.text + '</a>';
	}

	html += '</div></div>';
	
	return { 'html': html, 'actions': actions };

};

