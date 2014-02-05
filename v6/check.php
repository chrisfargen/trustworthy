<?php

//$hostOK = array("https://s3.amazonaws.com", "https://workersandbox.mturkcontent.com");

/*$host = $_SERVER["HTTP_HOST"];
$pattern = '/^(.*?(turk|amazon).*\.com)$/';
$match = preg_match($pattern,$host);

if ($match) exit;
 */

header("Access-Control-Allow-Origin: *");

if ( !isset($_GET['workerId']) ) {
    echo 'no-worker-id-supplied';
    exit;
}

/* new code below */

try {
    $DBH = new PDO('sqlite:cocosci.sqlite');
    $DBH->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $result = $DBH->query("SELECT workerId FROM session;");

    foreach ($result as $row) {
	if ($row['workerId'] == $_GET['workerId']) {
	    echo 'duplicate-worker';
	    exit;
	}
    }

    echo 'new-worker';
}
catch(PDOException $e) {
    echo $e->getMessage();
}
