<?php



$column_family_string_to_parse = "
-> Items
-> Sources
-> Categories
-> Entities
-> Facts
-> Sectors
-> Industries
-> Places
-> Companies
-> People
-> Anniversary
-> City
-> Company
-> Continent
-> Country
-> Currency
-> EmailAddress
-> EntertainmentAwardEvent
-> Facility
-> FaxNumber
-> Holiday
-> IndustryTerm
-> MarketIndex
-> MedicalCondition
-> MedicalTreatment
-> Movie
-> MusicAlbum
-> MusicGroup
-> NaturalFeature
-> OperatingSystem
-> Organization
-> Person
-> PhoneNumber
-> PoliticalEvent
-> Position
-> Product
-> ProgrammingLanguage
-> ProvinceOrState
-> PublishedMedium
-> RadioProgram
-> RadioStation
-> Region
-> SportsEvent
-> SportsGame
-> SportsLeague
-> Technology
-> TVShow
-> TVStation
-> URL
-> Acquisition
-> Alliance
-> AnalystEarningsEstimate
-> AnalystRecommendation
-> Arrest
-> Bankruptcy
-> BonusSharesIssuance
-> BusinessRelation
-> Buybacks
-> CompanyAccountingChange
-> CompanyAffiliates
-> CompanyCompetitor
-> CompanyCustomer
-> CompanyEarningsAnnouncement
-> CompanyEarningsGuidance
-> CompanyEmployeesNumber
-> CompanyExpansion
-> CompanyForceMajeure
-> CompanyFounded
-> CompanyInvestment
-> CompanyLaborIssues
-> CompanyLayoffs
-> CompanyLegalIssues
-> CompanyListingChange
-> CompanyLocation
-> CompanyMeeting
-> CompanyNameChange
-> CompanyProduct
-> CompanyReorganization
-> CompanyRestatement
-> CompanyTechnology
-> CompanyTicker
-> CompanyUsingProduct
-> ConferenceCall
-> Conviction
-> CreditRating
-> DebtFinancing
-> DelayedFiling
-> DiplomaticRelations
-> Dividend
-> EmploymentChange
-> EmploymentRelation
-> EnvironmentalIssue
-> Extinction
-> FamilyRelation
-> FDAPhase
-> Indictment
-> IPO
-> JointVenture
-> ManMadeDisaster
-> Merger
-> MovieRelease
-> MusicAlbumRelease
-> NaturalDisaster
-> PatentFiling
-> PatentIssuance
-> PersonAttributes
-> PersonCareer
-> PersonCommunication
-> PersonEducation
-> PersonEmailAddress
-> PersonRelation
-> PersonTravel
-> PoliticalEndorsement
-> PoliticalRelationship
-> PollsResult
-> ProductIssues
-> ProductRecall
-> ProductRelease
-> Quotation
-> SecondaryIssuance
-> StockSplit
-> Trial
-> VotingResult";

$exploded_items = explode("
-> ", $column_family_string_to_parse);

$super_column_family_names = array();


$column_family_names = array();
foreach ($exploded_items as $item_key=>$item_value) {
	$column_family_names[$item_key] = str_replace("-> ", "", $item_value);
}

//print_r($column_family_names);

//<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="ItemsByTagNameAndDate"/> 
/*
Get {Internet Information Providers} details: Categories -> CategoryType (Industries) -> Category (Industry) -> {detail-1:detail}, {...}
Get all items in {Internet Information Providers}: CategorySubtypeItemsByCategorySubtypeAndTime -> Industry -> {URI-1:XXX}, {...}
Get latest items in {Internet Information Providers}: IndustryItemsByIndustryAndTime -> Industry -> {URI-1:XXX}, {...}
Get all Industry items
Get latest Industry items
*/
/*
echo '<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="Items"/>' . "\n";
echo '<ColumnFamily CompareWith="LongType" Name="ItemsByTime"/>' . "\n";
echo '<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="Sources"/>' . "\n";
echo '<ColumnFamily CompareWith="LongType" Name="SourcesByTime"/>' . "\n";
echo '<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="Categories"/>' . "\n";
echo '<ColumnFamily CompareWith="LongType" Name="CategoriesByTime"/>' . "\n";
echo '<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="Entities"/>' . "\n";
echo '<ColumnFamily CompareWith="LongType" Name="EntitiesByTime"/>' . "\n";
echo '<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="Facts"/>' . "\n";
echo '<ColumnFamily CompareWith="LongType" Name="FactsByTime"/>' . "\n";
*/
/*
echo '<Keyspaces>
	<Keyspace Name="Aggregator">
';
*/
//$Companies = new CassandraCF('Aggregator','Companies');
foreach($column_family_names as $cf_key=>$cf_val) {
	if(!empty($cf_val)) {
		//echo '<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="UTF8Type" Name="' . $cf_val . '"/>\n';
		//echo '		<ColumnFamily CompareWith="UTF8Type" Name="' . $cf_val . '"/>' . "\n";
		//echo '		<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="LongType" Name="' . $cf_val . 'ByTime"/>' . "\n";
		//echo '		<ColumnFamily CompareWith="UTF8Type" ColumnType="Super" CompareSubcolumnsWith="LongType" Name="' . $cf_val . 'ItemsByTime"/>' . "\n";
		//echo '$' .  $cf_val  . ' = new CassandraCF(\'Aggregator\',\'' . $cf_val . '\');' . "\n";
		//echo '$' .  $cf_val  . 'ByTime = new CassandraCF(\'Aggregator\',\'' . $cf_val . 'ByTime\');' . "\n";
		//echo '$' .  $cf_val  . 'ItemsByTime = new CassandraCF(\'Aggregator\',\'' . $cf_val . 'ItemsByTime\');' . "\n";
	echo $cf_val . "," . $cf_val . "ByTime," . $cf_val . "ItemsByTime,";
	}
}

/*
echo "		<ReplicaPlacementStrategy>org.apache.cassandra.locator.RackUnawareStrategy</ReplicaPlacementStrategy>
		<ReplicationFactor>1</ReplicationFactor>
		<EndPointSnitch>org.apache.cassandra.locator.EndPointSnitch</EndPointSnitch>
	</Keyspace>
</Keyspaces>";
*/  

?>