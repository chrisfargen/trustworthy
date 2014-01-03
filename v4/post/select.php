<?php

/*

  Author: Chris Fargen
  Purpose: Testing to see if prepared 
    statements will work for me.
  
*/

$searchProject = "trust-mixed-2";

/* Configuration */
require_once('/var/www/html/config.php');

/* Authenticate with MySQL server */
$mysqli = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, 'cocosci-lab');

/* check connection */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}

//
// SELECT
//

$needle = '2011-08-26';

/* Construct the query */
$q = "SELECT * "
    . "FROM `sessions` "
    . "INNER JOIN `turk` "
    . "ON `sessions`.`worker_ID` = `turk`.`WorkerId` "
    . "WHERE `sessions`.`time_submit` >= '2013-07-10' "
    . "AND (`sessions`.`answer_okay` IS NULL OR `sessions`.`answer_okay` = 1) "
    //. "AND NOT `sessions`.`answer_okay` <=> 0 "
    ;
    
$result = $mysqli->query($q);

while($row = $result->fetch_array()) {
  $rows[] = $row;
}

foreach($rows as $row) {
  $array = array(
    $row['ref_ID'],
    $row['time_submit'],
    $row['results'],
  );
  
  echo implode($array, ",");// . "\n";
  
  continue;
  
  $prefix = implode($array, ",");
  
  $lines = explode("\n", $row['results']);
  
  foreach($lines as $line) {
    if (empty($line)) continue;
    echo $prefix . "," . $line . "\n";
  }
}

/* free result set */
$result->free();

/* close connection */
$mysqli->close();

echo "\n\n" . $q;
