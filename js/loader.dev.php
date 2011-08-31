<?php
header("Content-type: text/javascript");
// Loop through each file
$contents = '';

//InDB dependency
foreach (glob("core/development/dependencies/indb/*.js") as $filename) {
	$contents .= file_get_contents($filename);
}
$contents .= file_get_contents("loader.dev.js");
foreach (glob("core/development/*.js") as $filename) {
	if($filename != "loader.dev.js") {
		// Include file so we can grab hooks
		$contents .= file_get_contents($filename);
	}
}
echo $contents;
?>
