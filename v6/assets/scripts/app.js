var data = {
    'results' : [],
    'session' : {}
};
// Experiment object
var ex = {
    '$' : {},
    // Cache jQuery Object corresponding to template slides, etc
    cacheElements : function() {
	// Find elements
	$('[data-cache]').each(function() {
	    // Get the slide type of this slide template
	    var label = $(this).attr('class').split(" ")[0];
	    $(this).removeAttr('data-cache');
	    if ( $(this).data('remove') !== undefined ) {
		// Cache and remove
		ex.$[label] = $(this).removeAttr('data-remove').detach();
		return true;
	    }
	    // Cache
	    ex.$[label] = $(this);
	    return true;
	});
    },
    insertNext : function() {
	// Add next button
	$(".active").append(ex.$.next);
    },
    validateCon : function(c) {
	switch(c) {
	    case 'trust-mixed-2':
		// Edit topbar
		ex.$['top-bar-text'].text("Trustworthiness > Condition " + c);
		return true;
		break;
	    default:
		ex.$['top-bar-text'].text("Trustworthiness > Condition " + c + ": Invalid condition supplied. Please check the URL.");
		break;
	}
	return false;
    },
    // Initialize a condition
    initCon : function(c) {
	// Validate condition
	if ( !ex.validateCon(c) ) {
	    return false;
	}
	if (source.results[ex.get.srcTrust].group !== source.results[ex.get.srcBelief].group) {
	    console.log("Error! Groups not the same");
	    return false;
	}
	else {
	    var groupId = source.results[ex.get.srcTrust].group;
	    console.log( "groupId is " + groupId );
	}
	// Abbreviate source group to use to populate content
	console.log("srcTrust is " + ex.get.srcTrust + " and group is " + source.results[ex.get.srcTrust].group );
	console.log("srcBelief is " + ex.get.srcBelief + " and group is " + source.results[ex.get.srcBelief].group );

	/* var groupedItems = (function() {
	   var arr = [];
	   _.each(source.results,function(item){
	   if (!arr[item.group]) arr[item.group] = [];
	   arr[item.group].push(item); 
	   });
	   return arr;
	   })(); */

	// Group items
	var groupedItems = _.toArray(
		_.groupBy(source.results, function(item){ return item.group; })
		);
	// Pick out the predetermined first pair
	groupedItems.splice(groupId,1)[0];

	// Specify the order of the first one
	// This is the only one we will specify order for
	// The rest will be randomly ordered
	// The order is [trust,belief]
	var firstPair = [
	    source.results[ex.get.srcTrust],
	    source.results[ex.get.srcBelief]
	    ];
	
	// Randomize the belief vs trust
	_.each(groupedItems, function(val, key, list) {
	    groupedItems[key] = _.shuffle(val);
	});

	// Randomize the remaining items
	groupedItems = _.shuffle(groupedItems);

	// Splice the first item
	groupedItems.splice(0,0,firstPair);

	// Loop
	for (var j = 0; j < groupedItems.length; j++) {
	    console.log( j );
	    var g = groupedItems[j];
	    console.log( g );
	    // Abbreviate new objects
	    var stb = ex.$['slide-trust-before'].clone();
	    var sb = ex.$['slide-belief'].clone();
	    var sta = ex.$['slide-trust-after'].clone();
	    data.results[j] = {};
	    (function() {
		// Populate content of trust slides
		// Before
		$('.source', stb).text( g[0].source );
		$('.subject', stb).text( g[0].subject );
		// After
		$('.source', sta).text( g[0].source );
		$('.subject', sta).text( g[0].subject );
		// Record presets
		data.results[j].sourceTrust = g[0].id;
	    })();
	    // No correspondence
	    $('.source', sb).text( capitalizeFirst( g[1].source ) );
	    $('.statement', sb).text( capitalizeFirst( g[1].statement ) );
	    // Record presets
	    data.results[j].sourceBelief = g[1].id;
	    // Specify location to which we will save user input
	    $('.slider', stb).attr('data-save', 'data.results.' + j + '.trustBefore');
	    $('.slider', sb).attr('data-save', 'data.results.' + j + '.belief');
	    $('.slider', sta).attr('data-save', 'data.results.' + j + '.trustAfter');
	    var threeSlides = $(stb).add(sb).add(sta);
	    // Insert the three slides before the last slide
	    ex.$['slide-sports'].before(threeSlides);

	}
	// Full-view mode
	if (ex.get.fullview) {
	    $('.slideshow > li').show();
	}
	return true;
    },
    // Initialize sliders
    initSliders : function() {
	$( ".slider" ).slider({
	    min: 1,
	max: 7,
	step: 1,
	value: 4,
	// On start of slide event
	start: function( event, ui ) { ex.valChange(this, ui.value); },
	// On slide event
	slide: function( event, ui ) { ex.valChange(this, ui.value); }
	})
	// Add customized labels
	.each(function() {
	    //
	    // Add labels to slider whose values 
	    // are specified by min, max and whose
	    // step is set to 1
	    //
	    // Get the options for this slider
	    var opt = $(this).data().uiSlider.options;
	    // Get the number of possible values
	    var vals = opt.max - opt.min;
	    // Space out values
	    for (var i = 0; i <= vals; i++) {
		var el = $('<label>'+(i+1)+'</label>').css('left',(i/vals*100)+'%');
		$(this).append(el);
	    }
	    // Get the measure, trustworthy or believable
	    var measure = $(this).attr('data-measure');
	    //
	    // Add labels to slider whose values 
	    // are specified by min, max and whose
	    // step is set to 1
	    //
	    var labelNot = $('<strong>Not at all ' + measure + '</strong>').css('left','0');
	    var labelVery = $('<strong>Very ' + measure + '</strong>').css('left','100%');
	    $(this).append(labelNot, labelVery);
	    if ( !$(this).prop('name') ) {
		return true;
	    }
	    // If data-save attribute is specified as 'disable', slider is a dummy
	    if ( $(this).attr('data-save') == 'disable') {
		// Disable slider
		$(this).slider({
		    slide: function( event, ui ) {}
		});
		return true;
	    }
	    // Otherwise, what the heck?
	    consolex.error('Unexpected name for scalex.');
	});
	return true;
    },
    // Register new input
    registerInput : function(el) {
	// Get the jQuery object containing the element
	// and add class "needs-input"
	var $el = $(el).addClass('needs-input');
	// Get the parent LI element
	var $li = $( $el.closest('li')[0] );
	// If parent LI element has no class "needs-input"
	if ( !$li.hasClass('needs-input') ) {
	    $li.addClass('needs-input');
	}
	//consolex.log('Input flag "' + getXPath(el) + '" registered.');
	return true;
    },
    okayInput : function(el) {
	// Get the jQuery object containing the element
	var $el = $(el);
	// Get the parent LI element
	var $li = $( $el.closest('li')[0] );
	// If there is a flag
	if ( $el.hasClass('needs-input') ) {
	    // Remove class "needs-input" from input element
	    $el.removeClass('needs-input');
	    //consolex.log('Input flag "' + getXPath(el) + '" deleted.');
	}
	// Check to see if all inputs okay
	if ( $li.hasClass('needs-input') && !$('[class*=needs-input]', $li).length ) {
	    // Remove class
	    $li.removeClass('needs-input');
	    //consolex.log('Class "needs-input" removed from "' + $li.attr('class').split(" ")[0] + '".');
	}
	return true;
    },
    // Activate the next slide
    next : function() {
	// Cache this slide
	ex.$.active = $('.active');
	// Remove focus from handle, if it's focused.
	if ( ex.$.handle && ex.$.handle.length > 0 ) {
	    ex.$.handle.blur();
	}
	// If we still need something, cancel the attempt
	if (ex.$.active.filter('[class*=needs]').length) {
	    return false;
	}
	// Otherwisex...
	// Swap .active classes
	ex.$.active = ex.$.active
	    .removeClass('active')
	    .next()
	    .addClass('active needs-timeout');
	// Check for the post flag
	if (ex.$.active.data("event") === "post") {
	    ex.post();
	    return null;
	}
	// Reset timeout
	ex.timeout.reset( ( Number( ex.$.active.data('delay')) || 0 ) || 3000 );
	// Register inputs
	$('[data-required]', ex.$.active).each(function() {
	    ex.registerInput(this);
	});
	// Fix this later to avoid wrapping in anon fun
	// Add events to input elements
	$('input[data-save], select[data-save], textarea[data-save]', ex.$.active)
	    .keyup( function(){ex.valChange(this);} )
	    .change( function(){ex.valChange(this);} );
	// Label
	ex.$.next.text(ex.$.active.data('next') || "Next");
	// Insert next button
	ex.insertNext();
	// Cache slider handle
	ex.$.handle = $('.active .ui-slider-handle');
	// Focus the handle
	if ( ex.$.handle && ex.$.handle.length > 0 ) {
	    ex.$.handle.focus();
	}
	return true;
    },
    timeout : {
	reset : function(delay) {
	    var d = delay || 0;
	    // Test mode
	    d *= (ex.testMode == 1 ? 0 : 1);
	    // Clear the timeout so they overwrite properly
	    window.clearTimeout(ex.timeout.ID);
	    ex.timeout.ID = window.setTimeout(
		    function(){
			// Remove class
			$('.active').removeClass("needs-timeout");
			// Bump slider, if any
			var $slider = $('.slider', ex.$.active);
			if ($slider.length !== 0) {
			    ex.valChange( $slider[0], $slider.slider('value') );
			}
		    },
		    d
		    );
	    return true;
	}
    },
    valChange : function(el,val) {
	val = val || $(el).val();
	var key = $(el).attr('data-save');
	setKey(key, val);
	//consolex.log(key + " : " + val);
	ex.okayInput(el);
	return true;
    },
    keyHandler : function() {
	$(document).keydown(function(e) {
	    switch (e.which) {
		// Enter / Space
		case 10:
		case 13:
		case 32:
		    // If user is not focusing on input...
		    if ( !$("input, select, textarea").is(":focus") ) {
			// ...attempt to go to next slidex.
			ex.next();
			return null;
		    }
		    break;
		    // Arrow keys
		case 37:
		case 38:
		case 39:
		case 40:
		    if ( ex.$.handle && ex.$.handle.length > 0 ) {
			ex.$.handle.focus();
		    }
		    break;
		default:
		    break;
	    }
	    return true;
	});
	return true;
    },
    post: function() {
	ex.$.active.append('<p>Submitting data...</p>');
	// Get end time
	data.session.submit = dateTime(new Date);
	// Validate "Sport-Other"
	data.session.test[1] = data.session.test[1] || "";
	// Combine test questions
	data.session.test = [data.session.test[0],data.session.test[1]].join();
	// Create CSV
	data.resultsCSV = JSON2CSV($.parseJSON(JSON.stringify(data.results)),0,0,1);
	// Send our data via post
	$.post('post-sqlite.php', {'data' : data}, function(response) {
	    ex.$.active
	    .append('<p>Data submitting...</p>');
	consolex.log(response);
	return true;
	})
	.fail(function() {
	    ex.$.active.append('<p>There was an error. Please contact the admin.</p>');
	    return false;
	})
	.always(function() {
	    if (data.session.ref !== "turk") {
		return null;
	    }
	    ex.$.active.append('<p>To receive credit, copy the code below into Amazon Turk.</p><p>Code: <input style="padding: 0.3em 1em;" value="' + data.session.refId + '" /></p>');
	    return true;
	});
	return true;
    }
};
// On document ready
$(function() {
    // Get start time
    data.session.start = dateTime(new Date());
    // Get the get variables
    ex.get = getQueryParams(document.location.search);
    // Get the referer
    data.session.ref = ex.get.ref || "";
    //data.session.refId = "000000";
    data.session.refId = rand(100000,999999);
    // URL
    data.session.url = document.location.href;
    // Set test mode
    ex.testMode = ex.get.test || 0;
    data.session.workerId = ex.get.workerId || 0;
    // Project label
    // project,condition,mode,version
    data.session.project = ["trust-mixed", ex.get.c, (ex.testMode == 1 ? "test" : "normal"), "2013-06-14"].join();
    // Cache and/or remove template slides
    ex.cacheElements();
    // Initialize condition
    if ( !ex.initCon(ex.get.c) ) {
	return false;
    }
    // Initialize sliders
    ex.initSliders();
    // Click events
    ex.$.next
	.click(ex.next)
	.mousedown(function(){$(this).addClass('mousedown')})
	.mouseup(function(){$(this).removeClass('mousedown')})
	.mouseout(function(){$(this).removeClass('mousedown')});
    // Add 'Next' button to slide
    ex.insertNext();
    // On any key press
    ex.keyHandler();
    return true;
});
