var data = {

  'results' : [],
  
  'session' : {}

};

var jsExp = {

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
        jsExp.$[label] = $(this).removeAttr('data-remove').detach();
        
        return true;
        
      }
      
      // Cache
      jsExp.$[label] = $(this);
      
      return true;
      
    });
  
  },
  
  insertNext : function() {
    
    // Add next button
    $(".active").append(jsExp.$.next);
    
  },
  
  validateCon : function(c) {
  
    switch(c) {
    
      case 'trust-mixed-2':
      
        // Edit topbar
        jsExp.$['top-bar-text'].text("Trustworthiness > Condition " + c);
        
        return true;
        break;
        
      default:
      
        jsExp.$['top-bar-text'].text("Trustworthiness > Condition " + c + ": Invalid condition supplied. Please check the URL.");
        break;
    }
    
    return false;
    
  },
  
  // Initialize a condition
  initCon : function(c) {
  
    // Validate condition
    if ( !jsExp.validateCon(c) ) {
      return false;
    }
  
    // Loop through groups of examples
    var i = 0;
    
    // Abbreviate source group to use to populate content
    var g = [
      alias[jsExp.get.srcTrust],
      alias[jsExp.get.srcBelief]
    ];
    
    // Abbreviate new objects
    var stb = jsExp.$['slide-trust-before'].clone();
    var sb = jsExp.$['slide-belief'].clone();
    var sta = jsExp.$['slide-trust-after'].clone();
    
    data.results[i] = {};
    
    var popTrust = function(n) {
    
      // Populate content of trust slides
      
      // Before
      $('.source', stb).text( g[n].source );
      $('.subject', stb).text( g[n].subject );
      
      // After
      $('.source', sta).text( g[n].source );
      $('.subject', sta).text( g[n].subject );
      
      // Record presets
      data.results[i].sourceTrust = g[n].source.substring(0,16)+"...";
      
    };
    

    // Populate content
    popTrust(0);
    
    // No correspondence
    $('.source', sb).text( capitalizeFirst( g[1].source ) );
    $('.statement', sb).text( capitalizeFirst( g[1].statement ) );
    
    // Record presets
    data.results[i].sourceBelief = g[1].source.substring(0,16)+"...";
    
    // Specify location to which we will save user input
    $('.slider', stb).attr('data-save', 'data.results.' + i + '.trustBefore');
    $('.slider', sb).attr('data-save', 'data.results.' + i + '.belief');
    $('.slider', sta).attr('data-save', 'data.results.' + i + '.trustAfter');
    
    var threeSlides = $(stb).add(sb).add(sta);
    
    // Insert the three slides before the last slide
    jsExp.$['slide-sports'].before(threeSlides);

    // Full-view mode
    if (jsExp.get.fullview) {
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
      start: function( event, ui ) { jsExp.valChange(this, ui.value); },
      
      // On slide event
      slide: function( event, ui ) { jsExp.valChange(this, ui.value); }
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
      console.error('Unexpected name for scale.');
      
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
    
    //console.log('Input flag "' + getXPath(el) + '" registered.');
    
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
      
      //console.log('Input flag "' + getXPath(el) + '" deleted.');
      
    }
    
    // Check to see if all inputs okay
    if ( $li.hasClass('needs-input') && !$('[class*=needs-input]', $li).length ) {
    
      // Remove class
      $li.removeClass('needs-input');
      
      //console.log('Class "needs-input" removed from "' + $li.attr('class').split(" ")[0] + '".');
      
    }
    
    return true;
  
  },
  
  // Activate the next slide
  next : function() {
    
    // Cache this slide
    jsExp.$.active = $('.active');
    
    // Remove focus from handle, if it's focused.
    if ( jsExp.$.handle && jsExp.$.handle.length > 0 ) {
      jsExp.$.handle.blur();
    }
    
    // If we still need something, cancel the attempt
    if (jsExp.$.active.filter('[class*=needs]').length) {
      return false;
    }
    
    // Otherwise...
    
    // Swap .active classes
    jsExp.$.active = jsExp.$.active
      .removeClass('active')
      .next()
      .addClass('active needs-timeout');
      
    // Check for the post flag
    if (jsExp.$.active.data("event") === "post") {
      jsExp.post();
      return null;
    }
      
    // Reset timeout
    jsExp.timeout.reset( ( Number( jsExp.$.active.data('delay')) || 0 ) || 3000 );
   
    // Register inputs
    $('[data-required]', jsExp.$.active).each(function() {
    
      jsExp.registerInput(this);
      
    });
    
    // Fix this later to avoid wrapping in anon fun
    // Add events to input elements
    $('input[data-save], select[data-save], textarea[data-save]', jsExp.$.active)
      .keyup( function(){jsExp.valChange(this);} )
      .change( function(){jsExp.valChange(this);} );
    
    // Label
    jsExp.$.next.text(jsExp.$.active.data('next') || "Next");
    
    // Insert next button
    jsExp.insertNext();
    
    // Cache slider handle
    jsExp.$.handle = $('.active .ui-slider-handle');
    
    // Focus the handle
    if ( jsExp.$.handle && jsExp.$.handle.length > 0 ) {
      jsExp.$.handle.focus();
    }
    
    return true;
    
  },
  
  timeout : {
    
    reset : function(delay) {
      
      var d = delay || 0;
      
      // Test mode
      d *= (jsExp.testMode == 1 ? 0 : 1);
      
      // Clear the timeout so they overwrite properly
      window.clearTimeout(jsExp.timeout.ID);
      
      jsExp.timeout.ID = window.setTimeout(
        function(){
        
          // Remove class
          $('.active').removeClass("needs-timeout");
          
          // Bump slider, if any
          var $slider = $('.slider', jsExp.$.active);
          
          if ($slider.length !== 0) {
            jsExp.valChange( $slider[0], $slider.slider('value') );
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
    
    //console.log(key + " : " + val);
    
    jsExp.okayInput(el);
    
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
            
            // ...attempt to go to next slide.
            jsExp.next();
            
            return null;
          }
          
          break;
          
          
        // Arrow keys
        case 37:
        case 38:
        case 39:
        case 40:

          if ( jsExp.$.handle && jsExp.$.handle.length > 0 ) {
            jsExp.$.handle.focus();
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
  
    jsExp.$.active.append('<p>Submitting data...</p>');
  
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
      
      jsExp.$.active
        .append('<p>Data submitting...</p>');
    console.log(response);
        return true;

    })
      .fail(function() {
        jsExp.$.active.append('<p>There was an error. Please contact the admin.</p>');
        return false;
      })
      .always(function() {
      
        if (data.session.ref !== "turk") {
          return null;
        }
        
        jsExp.$.active.append('<p>To receive credit, copy the code below into Amazon Turk.</p><p>Code: <input style="padding: 0.3em 1em;" value="' + data.session.refId + '" /></p>');
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
  jsExp.get = getQueryParams(document.location.search);
  
  // Get the referer
  data.session.ref = jsExp.get.ref || "";
  //data.session.refId = "000000";
  data.session.refId = rand(100000,999999);
  
  // URL
  data.session.url = document.location.href;
  
  // Set test mode
  jsExp.testMode = jsExp.get.test || 0;
  
  data.session.workerId = jsExp.get.workerId || 0;
  
  // Project label
  // project,condition,mode,version
  data.session.project = ["trust-mixed", jsExp.get.c, (jsExp.testMode == 1 ? "test" : "normal"), "2013-06-14"].join();
  
  // Cache and/or remove template slides
  jsExp.cacheElements();
  
  // Initialize condition
  if ( !jsExp.initCon(jsExp.get.c) ) {
    return false;
  }
  
  // Initialize sliders
  jsExp.initSliders();
  
  // Click events
  jsExp.$.next
    .click(jsExp.next)
    .mousedown(function(){$(this).addClass('mousedown')})
    .mouseup(function(){$(this).removeClass('mousedown')})
    .mouseout(function(){$(this).removeClass('mousedown')});
  
  // Add 'Next' button to slide
  jsExp.insertNext();
  
  // On any key press
  jsExp.keyHandler();
  
  return true;
  
});
