<?php
// Loop through each file
$contents = '';
shell_exec("java -jar compiler.jar --js=./../loader.dev.js --js_output_file=./../loader.js");
foreach (glob("./../core/development/dependencies/indb/*.dev.js") as $filename) {
	$filename = str_replace("./../core/development/dependencies/indb/","",$filename);
	// Include file so we can grab hooks
	shell_exec("java -jar compiler.jar --js=./../core/development/dependencies/indb/" . $filename . " --js_output_file=./../core/dependencies/indb/" . str_replace(".dev","",$filename));
}
foreach (glob("./../core/development/*.dev.js") as $filename) {
	$filename = str_replace("./../core/development/","",$filename);
	if($filename != "loader.js") {
		// Include file so we can grab hooks
		shell_exec("java -jar compiler.jar --js=./../core/development/" . $filename . " --js_output_file=./../core/" . str_replace(".dev","",$filename));
	}
}
?>
