<?php

$data = $_POST['data'];

$results = $data['results'][0];
$session = $data['session'];

# $session = array( 'project' => 'Cathy',  'ref' => '9 Dark and Twisty',  'refId' => 'Cardiff',  'start' => 'asdeaf',  'submit' => 'asgdasdf',  'test' => 'sadfgsdfb',  'url' => 'asdfkmadfbomar',  'workerId' => 'xcoarfasefd' );

# $results = array( 'sourceBelief' => 'something', 'sourceTrust' => 'something else', 'trustBefore' => '1', 'belief' => '2', 'trustAfter' => '3' );

try {
    # Establish connection
    $DBH = new PDO('sqlite:cocosci.sqlite');
    $DBH->setAttribute( PDO::ATTR_ERRMODE,  PDO::ERRMODE_EXCEPTION );  

    # Create tables
    $DBH->exec('create table if not exists session (project, ref, refId, start, submit, test, url, workerId);');
    $DBH->exec('create table if not exists results (sessionId, sourceBelief, sourceTrust, trustBefore, belief, trustAfter);');

    # Insert session data
    $STH = $DBH->prepare('insert into session (project, ref, refId, start, submit, test, url, workerId) values (:project, :ref, :refId, :start, :submit, :test, :url, :workerId);');
    $STH->execute($session);
    $results['sessionId'] = $DBH->lastInsertId(); 

    #Insert results data
    $STH = $DBH->prepare('insert into results (sessionId, sourceBelief, sourceTrust, trustBefore, belief, trustAfter) values (:sessionId, :sourceBelief, :sourceTrust, :trustBefore, :belief, :trustAfter)');
    $STH->execute($results);


    $DBH = null;
    echo "OKAY";
}
catch(PDOException $e) {  
    echo $e->getMessage();  
}

