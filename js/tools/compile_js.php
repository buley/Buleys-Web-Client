<?php
// Loop through each file
$contents = '';
shell_exec("java -jar compiler.jar --js=./../loader.dev.js --js_output_file=./../loader.js");
foreach (glob("./../core/development/*.dev.js") as $filename) {
	$filename = str_replace("./../core/development/","",$filename);
	if($filename != "loader.js") {
		// Include file so we can grab hooks
		shell_exec("java -jar compiler.jar --js=./../core/development/" . $filename . " --js_output_file=./../core/" . str_replace(".dev","",$filename));
	}
}
foreach (glob("./../utilities/development/*.dev.js") as $filename) {
	$filename = str_replace("./../utilities/development/","",$filename);
	if($filename != "loader.js") {
		// Include file so we can grab hooks
		shell_exec("java -jar compiler.jar --js=./../utilities/development/" . $filename . " --js_output_file=./../utilities/" . str_replace(".dev","",$filename));
	}
}
?>