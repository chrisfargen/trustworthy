#!/bin/bash
sqlite3 cocosci.sqlite <<!
.headers on
.mode csv
.output out.csv
SELECT * FROM session AS s JOIN results AS r on s.rowid=r.sessionId;
!
