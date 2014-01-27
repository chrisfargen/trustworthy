//  e
//	source
//	op
//	data
// Experiment namespace
var e = {
    "source" : {},
    "op" : {},
    "data" : {
	"session" : {},
	"results" : []
    }
};

e.op.alias = function(x) { return Math.floor(x/2); };



$(function(){

    // Load sources
    $.getJSON("assets/statementPair.json",{},function(data){
	// Assign result to global variable
	e.source.statementPair = data;
	// Get variables
	e.data.results[0].srcTrust = $(document).getUrlParam("srcTrust");
	e.data.results[0].srcBelief = $(document).getUrlParam("srcTrust");
	// Shuffle
	//ok = _.shuffle(e.source);
	console.log(e.source);
    });

});
