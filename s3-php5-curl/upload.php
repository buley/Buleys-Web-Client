<?php
include_once('/home/taylor/public_html/buleys.com/public/s3-php5-curl/S3.php');

$authorization = true; //$API->authorize($token);
// $uploaderIP = $Database->getSessionIP($token);

if($authorization) {
//$bucketID = md5($authorization);
//echo "here's the bucket: $bucketID";
//echo shell_exec('whoami');

// $bucketID = $shortIDInfo['ID'];
//$bucketDetails = $Database->getDropboxDetails($authorization);
$bucketID = "buley";
$uploadName = "/json/";
$uploadType = "application/json";
$uploadName = ''; //HERE
$upload_data = $_FILES['Filedata'];
$uploadName = $upload_data['name'];
$uploadType = $upload_data['type'];
$uploadSize = $upload_data['size'];
$tmp_path = $upload_data['tmp_name'];

echo $url = "https://" . $bucketID . ".s3.amazonaws.com/". $uploadName;

/*
print_r($_REQUEST);
$tmp_path = "/tmp/skylocker/s3/" . md5($filename); 

$fh = fopen($tmp_path, 'w') or die("error opening file");
fwrite($fh, $upload_data);
fclose($fh);
*/


$s3 = new S3('1CNE7C1PC0DAR94PK7G2', '3WLZXsa2w/vcX3xqjRkgTmLKEkF8b/oG1aoESUYc');

// $ownerID = $bucketDetails['ownerID'];
// $accessURL = $url;
// $authenticatedURL = $s3->getAuthenticatedURL($bucketID, $url, (10*10*10*10*10*10), false, true);
// $virusReportID = '';
//move the file
$fileHeaders = array(
        "Content-Type" => "$uploadType",
        "Content-Disposition" => "attachment; filename=$uploadName"
    );
	
if ($put = $s3->putObject(S3::inputFile($tmp_path), $bucketID, $uploadName, S3::ACL_PRIVATE, array(), $fileHeaders)) {
		$Database->insertUpload($ownerID, $bucketID, $uploadName, $uploadSize, $accessURL, $authenticatedURL, $uploaderIP, $virusReportID);
	} else{
}

}


?>