## Export

To export a table to csv for editing (say, in google docs), enter this from the command line:

    sqlite3 2014-02-04-cocosci-1-validate-test.sqlite 

and then from the sqlite3 prompt:

    sqlite> .mode csv
    sqlite> .output session.csv
    sqlite> select rowid, * from session;
    sqlite> .exit

## Import

To import a table from tsv to sqlite, export as tab-separated file.

Note the following:

    - Sqlite3 is not very flexible when it comes to importing, and it will not recognize optional characters surrounding fields such as quotation marks.
    - Be sure to remove the first line if it contains the header.
    - Be sure that the dates are in the proper syntax (mysql syntax: YYYY-MM-DD hh:mm:ss)

Then, enter this from the command line:

    sqlite3 2014-02-04-cocosci-2-session-empty.sqlite 

Then, from the sqlite3 prompt:

    sqlite> .table
    flatfile  results 
    sqlite> CREATE TABLE session (rowid INT PRIMARY KEY, project, ref, refId, start, submit, test, url, workerId, "passedTest" BOOL, "firstHIT" BOOL);
    sqlite> .separator "\t"
    sqlite> .width 4 8 4 6 8 8 8 8 8
    sqlite> .import session-3-tabs.tsv session
    sqlite> select * from session LIMIT 0,10;
    rowi  project   ref   refId   start     submit    test      url       workerId  passedTest  firstHIT  
    ----  --------  ----  ------  --------  --------  --------  --------  --------  ----------  ----------
    1     trust-mi  turk  506214  1/29/201  1/29/201  Other...  http://c  A1JVUD5X  1           1         
    2     trust-mi  turk  490434  1/29/201  1/29/201  Football  http://c  A21FH5XU  0           1         
    3     trust-mi  turk  553640  1/29/201  1/29/201  Other...  http://c  A2P25BBI  1           1         
    4     trust-mi  turk  978455  1/29/201  1/29/201  Other...  http://c  A3DXQI24  1           1         
    5     trust-mi  turk  545928  1/29/201  1/29/201  Other...  http://c  A362QMJV  1           1         
    6     trust-mi  turk  635659  1/29/201  1/29/201  Other...  http://c  A27J3NRV  1           1         
    7     trust-mi  turk  935192  1/29/201  1/29/201  Other...  http://c  AKO4O0L9  1           1         
    8     trust-mi  turk  215708  1/29/201  1/29/201  Other...  http://c  A3HBQMBW  1           1         
    9     trust-mi  turk  773769  1/29/201  1/29/201  Football  http://c  AFOLA5UV  0           1         
    10    trust-mi  turk  546388  1/29/201  1/29/201  Other...  http://c  A3C9GEBD  1           1         

    sqlite3 2014-02-04-cocosci-2-session-empty.sqlite 

Then, from the sqlite prompt, follow this procedure:

1.  Change the settings to accomodate tsv format:

    sqlite> .show
	 echo: off
      explain: off
      headers: on
	 mode: column
    nullvalue: ""
       output: stdout
    separator: "|"
	stats: off
	width: 
    sqlite> .separator "\t"
    sqlite> .width 6 6 4 6 8 8 8 8 8 4 4 4

2.  Import the table:

    sqlite> .table
    flatfile  results   session 
    sqlite> DROP TABLE session;
    sqlite> CREATE TABLE session (rowid int primary key, project, ref, refId, start, submit, test, url, workerId, passedTest int, firstHIT int, legitHIT int);
    sqlite> .import session-3-tabs.tsv session
    sqlite> SELECT * FROM session LIMIT 0,10;
    rowid   projec  ref   refId   start     submit    test      url       workerId  pass  firs
    ------  ------  ----  ------  --------  --------  --------  --------  --------  ----  ----
    1       trust-  turk  506214  2014-01-   2014-01  Other...  http://c  A1JVUD5X  1     1   
    2       trust-  turk  490434  2014-01-   2014-01  Football  http://c  A21FH5XU  0     1   
    3       trust-  turk  553640  2014-01-   2014-01  Other...  http://c  A2P25BBI  1     1   
    4       trust-  turk  978455  2014-01-   2014-01  Other...  http://c  A3DXQI24  1     1   
    5       trust-  turk  545928  2014-01-   2014-01  Other...  http://c  A362QMJV  1     1   
    6       trust-  turk  635659  2014-01-   2014-01  Other...  http://c  A27J3NRV  1     1   
    7       trust-  turk  935192  2014-01-   2014-01  Other...  http://c  AKO4O0L9  1     1   
    8       trust-  turk  215708  2014-01-   2014-01  Other...  http://c  A3HBQMBW  1     1   
    9       trust-  turk  773769  2014-01-   2014-01  Football  http://c  AFOLA5UV  0     1   
    10      trust-  turk  546388  2014-01-   2014-01  Other...  http://c  A3C9GEBD  1     1
