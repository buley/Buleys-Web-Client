Buleys.socket = io.connect('http://localhost:8080');

Buleys.socket.on('connect',function() {
	socket_login();
});

Buleys.socket.on('disconnect',function() {

});

Buleys.socket.on( 'data', function( data ) {
	data= jQuery.parseJSON( data );
	console.log( 'topic',data.topic );
	console.log( 'score', data.score );
	console.log( 'mess', data.data );
});


function socket_login() {
	var oauth_access_token = get_local_storage( 'twitter_oauth_access_token' );
	var oauth_access_secret = get_local_storage( 'twitter_oauth_access_token_secret' );

	Buleys.socket.emit( 'connect', { 'topics': [ 'none', 'company_amzn', 'company_msft', 'company_goog', 'company_aapl' ], 'twitter_enabled': true, 'twitter_access_token': oauth_access_token, 'twitter_access_token_secret': oauth_access_secret } );
	
}
