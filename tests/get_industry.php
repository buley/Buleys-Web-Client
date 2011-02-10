<?php


// Get database credentials
	include('/home/web/public_html/buleys.com/private/databaseCredentials.php');
	
	// Set up some variables
	$overallArray = array();
	$companyArray = array();

	$company_to_get0Count = 0;
	$CompanyTagCount = 0;
	$totalTagCount  = 0;
	$CompanyTagCount = 0;
	
	
	// Here we pull a list of companies, the oldest first
	// Set up query to get the companies to update
	$query_to_get_companies_to_update = "SELECT * FROM `companies` WHERE retired != 1 AND checked = '';";
	// Run query
	// Connect to MySQL and select database 
	$connectFirst = mysql_connect($host, $user, $pass);
	mysql_select_db($db) or die(mysql_error());
	$result_of_company_list_to_update = mysql_query($query_to_get_companies_to_update) or die('Update company failed.' . mysql_error());
	mysql_close($connectFirst);
	// Loop through the list of companies to get
	while($company_to_get = mysql_fetch_array($result_of_company_list_to_update)) {



$ticker = $company_to_get['symbol'];


$page = file_get_contents("http://finance.yahoo.com/q/in?s={$ticker}+Industry");
$matches = array();

preg_match_all('/Sector:<\/th>.*?a href=".*?">(.*?)<\/a><\/td>/', $page, $matches);

$sector = $matches[1][0];

preg_match_all('/Industry:<\/th>.*?a href=".*?">(.*?)<\/a><\/td>/', $page, $matches);

$subsector = $matches[1][0];

$sector = str_replace("&amp;", "&", $sector);
$subsector = str_replace("&amp;", "&", $subsector);

$query_to_run_2='';
if(!empty($sector) || !empty($subsector)) {

echo $query_to_run_2= "UPDATE `aggregator`.`companies` SET `sector` = '" . $sector . "', `subsector`='" . $subsector . "',`checked` = '" . mktime() . "' WHERE `companies`.`symbol` = '{$ticker}' LIMIT 1";
} else {
$query_to_run_2= "UPDATE `aggregator`.`companies` SET `retired` = 1,`checked` = '" . mktime() . "' WHERE `companies`.`symbol` = '{$ticker}' LIMIT 1";
}
echo $query_to_run_2 . "\n";

		// Connect to MySQL, select db, query/cache then close connection
		$connectionForQueryOrCache = mysql_connect($host, $user, $pass);
		mysql_select_db($db) or die(mysql_error());
		$query_to_run_2_result_array = mysql_query($query_to_run_2, $connectionForQueryOrCache);
		mysql_close($connectionForQueryOrCache);
		sleep(1);

}

?>