// Experiment namespace
var e = {};


$(function(){

    // Load sources
    $.getJSON("assets/sources.json",{},function(data){ e.sources = data; });


});
