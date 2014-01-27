<?php

//$hostOK = array("https://s3.amazonaws.com", "https://workersandbox.mturkcontent.com");

$host = $_SERVER["HTTP_HOST"];
$pattern = '/^(.*?(turk|amazon).*\.com)$/';
$match = preg_match($pattern,$host);

if ($match) exit;

header("Access-Control-Allow-Origin: *");

if ( !isset($_GET['workerId']) ) {
  echo 'no-worker-id-supplied';
  exit;
}

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

/* Construct the query */
$q = "SELECT DISTINCT (WorkerId) AS WorkerId FROM turk UNION SELECT worker_ID AS WorkerId FROM sessions";
    
$result = $mysqli->query($q);

while($row = $result->fetch_array()) {
  $rows[] = $row;
  if ($row['WorkerId'] == $_GET['workerId']) {
    echo 'duplicate-worker';
    exit;
  }
}

echo 'new-worker';