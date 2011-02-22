<?php
header("Content-type: text/javascript");
// Loop through each file
$contents = '';
$contents = file_get_contents("loader.js");
foreach (glob("core/development/*.js") as $filename) {
	if($filename != "loader.js") {
		// Include file so we can grab hooks
		$contents .= file_get_contents($filename);
	}
}
echo $contents;
?>
