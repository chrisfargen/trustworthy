/* */
/* PLUGINS */
/* */

// Traverse JS object by string and set value
function setKey(key, val) {
  
  var obj = window;

  var keys = key.split('.'),
    keyPart;
    
  while ((keyPart = keys.shift()) && keys.length) {
    if (obj[keyPart] === undefined) { obj[keyPart] = {}; }
    obj = obj[keyPart];
  }
  
  obj[keyPart] = val;
  
  return obj[keyPart];

}

// Shuffling algorithm based on Fisher-Yates
// http://bost.ocks.org/mike/shuffle/
// Also, optionally specifies number of items to return
function shuffle(array,n) {
  var m = array.length, t, i, copy;
  
  // Create a copy of an array of primitive values
  copy = array.slice(0);

  // While there remain elements to shuffle
  while (m) {

    // Pick a remaining element
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element
    t = copy[m];
    copy[m] = copy[i];
    copy[i] = t;
  }
  
  if (n != undefined) copy.length = n;

  return copy;
}

function getQueryParams(qs) {
  qs = qs.split("+").join(" ");
  var params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])]
      = decodeURIComponent(tokens[2]);
  }

  return params;
}

function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getXPath( element ) {
  var xpath = '';
  for ( ; element && element.nodeType == 1; element = element.parentNode ) {
    var id = $(element.parentNode).children(element.tagName).index(element) + 1;
    id > 1 ? (id = '[' + id + ']') : (id = '');
    xpath = '/' + element.tagName.toLowerCase() + id + xpath;
  }
  return xpath;
}

function JSON2CSV(objArray, labelsOn, wrapQuotes, lineNumbers) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;

  var str = '';
  var line = '';

  if (labelsOn) {
    var head = array[0];
    if (wrapQuotes) {
      for (var index in array[0]) {
        var value = index + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    } else {
      for (var index in array[0]) {
        line += index + ',';
      }
    }

    line = line.slice(0, -1);
    str += line + '\r\n';
  }

  for (var i = 0; i < array.length; i++) {
    var line = '';
    
    if (wrapQuotes) {
      if (lineNumbers) line += '"' + i + '",';
      for (var index in array[i]) {
        var value = array[i][index] + "";
        line += '"' + value.replace(/"/g, '""') + '",';
      }
    } else {
      if (lineNumbers) line += i + ',';
      for (var index in array[i]) {
        line += array[i][index] + ',';
      }
    }

    line = line.slice(0, -1);
    str += line + '\r\n';
  }
  return str;
  
}

// format for mysql DATETIME type
function dateTime(d) {
  
  var iso = d.toISOString().split('T');
  var datetime = [iso[0],iso[1].substring(0,8)].join(" ");
  return datetime;
  
}

// sparse length
// Get the number of elements in a sparse array
function spL(r) {
    var n = 0;
    for (var indx in r) {
        if (!isNaN(indx)) n++;
    }
    return n;
}

// Random int generator
// Returns a random int between min and max, inclusive
function rand(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}