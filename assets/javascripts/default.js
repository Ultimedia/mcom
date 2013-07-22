/* ==========================================================
  Main JavaScript File
*/
  $(document).ready(function(){

    // Create a new settingsobject
    var settings = {};
        settings.viewmode = "";
        settings.enableSidePanel = false;
        settings.passwordRecoveryOpen = false;

    // Detect window resizing
   var timeOut;
    $(window).resize(function() {
      clearTimeout(timeOut);
      timeOut = setTimeout(resizeHandler, 0);
    });

    // Global variables
    var selectedPublication;
    var sidePanelOpen;
    var carouselNav = true;
    var pageScrollTop;


    /* ==========================================================
      Initialise
    */
    var init = function(){

      // Set defaults for the form validator plugin
      $.validator.setDefaults({
          errorPlacement: function(label, element) {
              label.addClass('error-container');
              label.insertAfter(element);
          },
          wrapper: 'div'
      });
      $.extend($.validator.messages, {
        email: "Please enter a valid email",
        equalTo: "Passwords do not match",
        require_from_group: "Please enter a valid address"
      });
      
      // Wire resize handler
      resizeHandler();

      // Detect the current page
      detectCurrentPage();

      // Activate form validation on global forms
      $('#login-form').validate();
      $('#authentication-code-form').validate();
      $('#password-recovery-form').validate();
      $('#login-form-mobile').validate();
      $('#authentication-code-form-mobile').validate();
      $("#publication-browse").validate();

      // Autocomplete panel (code is just for demo purposes, needs a proper jQuery autocomplete plugin)
      $('#header-search-input').keyup(function(){
        var textValue = $(this).val();
        if(textValue.length > 0){
          $('#autocomplete').show();
        }else{
          $('#autocomplete').hide();
        }
        $('#header-search-input').blur(function () {
          $('#autocomplete').hide();
        });
      });

    }


    /* ==========================================================
      Wire the current Page
    */

    // Find the current page and activate javascript methods accordingly
    var detectCurrentPage = function(){

      // each page has a unique ID atribute in the body tag, we use the id to only wire the current page
      switch($('body').attr('id')){

        // Home page
        case "hone-page":
          wireHomePage();
        break;

        // Publications page
        case "publications-page":
          wirePublicationsPage();
        break;

        // Subscribe page 
        case "subscribe-page":
          wireSubscribePage();
        break;

        // Institutional Enquiries page
        case "institutional-enquiries-page":
            wireInstitutionalEnquiriesPage();
        break;

        // Product Updates Page
        case "product-updates-page":
          wireProductUpdatesPage();
        break;

        // Help Page
        case "help-page":
          wireHelpPage();
        break;

        // Contact Page
        case "contact-page":
          wireContactPage();
        break;

      }
    };


    /* ==========================================================
      Home Page Specific Javascript
    */
    var wireHomePage = function(){

      // 1. Wire the carousel component
      wireCarousel();

      // 2. Benefits tab section
      var selectedTab = $('#audience-nav .tabs .active');
      var selectItem = $('#audience-content .tab-content.active');
      var contentID;

      // Hide the tabs (we make it visible by default as a no JS fallback)
      $('#audience-content .tab-content').hide();
      $('#audience-content .tab-content.active').removeAttr('style');

      // Function to toggle between tabs (for mobile - tablet only)
      function toggleTabs(){
         
        // Store the selected tabbed item
        if($('#audience-nav .tabs').hasClass('open')){

          $('#audience-nav .tabs').removeClass('open'); 
          $('#audience-nav .tabs li').hide();
          $(selectedTab).removeAttr('style').addClass('active')

        }else{
          selectedTab = $('#audience-nav .tabs .active');

          $('#audience-nav .tabs li').not(":first").css('display','table');
          $('#audience-nav .tabs').addClass('open'); 
        }
      }

      // Close the tab menu on mobile - tablet (the big green button)
      $('#audience-nav #tabs-down').click(function(){
        toggleTabs();
      });

      // Show the selected tab
      $('#audience-nav .tabs li').not('.tab-info').click(function(event) {
        // Disable default behaviour
        event.preventDefault();

        // Only activate the dropdown on Tablet and Mobile
        if(settings.viewMode === "tablet" || settings.viewMode === "mobile"){
          $('#audience-nav .tabs li').removeAttr('style');

          if($('#audience-nav .tabs').hasClass('open')){

            $('#audience-nav .tabs li').removeClass('active');
            $(this).addClass('active').show();   
            selectedTab = $(this);  
          }

          toggleTabs();

          // Desktop
        }else{
          $(selectedTab).removeClass('active');
          $(this).addClass('active');
          selectedTab = this;
        }

          // Remove active class from the current item
          selectItem.removeClass('active');

          // Store the id for the selected tab
          contentID = $('a',selectedTab).attr('href').replace('#', '.');

          // Hide the content for the tabs
          $('#audience-content .tab-content').hide();

          // Show the selected tab content
          $(contentID).removeAttr('style').addClass('active');

          $('#audience-header').removeAttr('class').addClass(contentID.substring(1, contentID.length));

      });
    };


    /* ==========================================================
      Publications Page Specific Javascript
    */
    var wirePublicationsPage = function(){
      
      // 1. Style the custom select boxes
      wireSelect('.select-blue-box select');

      // 2. Wire carousel component
      wireCarousel();

      // 3. Store the selected publication
      selectedPublication = $('#publications-column .active');

      // 4. Publication filter menu
      $("#publications-filter").change(function(){ 

          $('#publications-column ul li').removeAttr('style');

          // Get the selected class
          var filterClass = $(this).find(":selected").attr('class');

          // Apply filter
          if(filterClass){
            $('#publications-column ul li').each(function(index, element){
                if($(element).hasClass(filterClass)){
                  
                }else{
                  $(element).hide();
                }
            });
          }
      });

      // 5. Publication select menu click handler
      $('#publications-column a').click(function(){
        var right = $('#factsheet').width();

        // Open the publications content in a sidepanel (for Mobile only)
        if(settings.enableSidePanel){

          $('#factsheet').show().css({right:-right}).animate({right:"0"}, 200, function(){
            sidePanelOpen = true;

            $('#close-side-panel').css('right',right).show(100);
            $('html, body').css({overflow: "hidden"});
            $('#factsheet-content').scrollTop(0);
          });
        }


        //
        //
        // Load Publications via Ajax (presumably using the jQuery.ajax() methods)
        //
        //


        // Highlight the selected publication
        $(selectedPublication).removeClass('active');
        $(this).addClass('active');
        selectedPublication = $(this);
      });

      // 6. Sidepanel close (mobile only)

      // Close the side panel with a swipe gesture
      $('#factsheet').hammer({css_hacks: false}).on("swiperight", function(ev) {
        if(settings.viewMode === "mobile"){
          closeFactPanel();
        }
      });

      // Close the side panel by clicking on the close button
      $('#close-side-panel').click(function(){
        closeFactPanel();
      });

      // Functionality to close the sidepanel 
      function closeFactPanel(){
        var right = $('#factsheet').width();
        $('#close-side-panel').hide(100, function(){
          $('#factsheet').animate({"right":-right - 50}, 200, function(){
            $('#factsheet').hide();
            $('#publications-column ul li a').removeClass('active');
          });
            
          $('html, body').removeAttr('style');
          sidePanelOpen = false;
        });
      }

    };


    /* ==========================================================
      Institutional Enquiries Page
    */
    var wireInstitutionalEnquiriesPage = function(){

      // 1. form validation for the contact form
      $('#contact-form').validate();

      // 2. Select all checkboxes
      $('#select-all-publications').click(function(){

        var checkBoxes = $('#publication-list input[type="checkbox"]');
        checkBoxes.prop("checked", !checkBoxes.prop("checked"));
      });

      // 3. Allow only numbers in the participants field
      $("#potential-users").keydown(function(event) {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
             // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) || 
             // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }else {
            // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault(); 
            }   
        }
      });

    };


    /* ==========================================================
      Subscribe Page Specific Javascript
    */
    var wireSubscribePage = function(){
      
      // 1. Style the custom select boxes
      wireSelect('.select-blue-box select');

      // 2. Uncheck checkboxes (IE bug)
      $('#publication-order-table input[type=checkbox]').removeAttr('checked');


      //
      // Javascript for the various stages of the ordering process 
      //

      /**
      * a. Choose publications Page
      */

      // Add table table styling
      $('.lighter-row').next('tr.details').addClass('lighter-row');


      // Select a publication from the table
      $('#publication-order-table input[type=checkbox]').change(function(){
        $(this).parents().closest('tr').toggleClass('checked');
        calculatePrice();
      });
      $('#publication-order-table #publication-listing tr:not(.details) td').click(function(evt){
        var selectedTable = this;
        var selectedElement = $(evt.target).attr('class');

        if(!$(evt.target).is(":checkbox, label") && selectedElement !== "hide-details-btn" && selectedElement !== "see-details-btn"){
      
          var checkbox = $(this).parent().find('input[type=checkbox]');
              checkbox.prop("checked", !checkbox.prop("checked"));

          $(this).parent().toggleClass('checked');

          // find the selected price
          calculatePrice();
        }
      
      });


      /**
      * Calculate price section
      */
      var promotions = [];
      var totalPublicationPrice;
      var tax = 20;
      var totalAddedTax;
      var totalRetailPrice;
      var selectedPublications;
      var multidiscountPrice = 0;
      var totalPromotionPrice = 0;

      // Change the country (placeholder)
      $('#country-select-box').change(function(event){

          var countryData = {
              country: $(this).children("option:selected").val()
          };

          //
          // AJAX 
          //

      });


      // Calculate the price once a publication is added (otherwise hide the price / tax section)
      var calculatePrice = function(){

        // Reset the total price
        totalPublicationPrice = selectedPublications = 0;


        /**
        * 1.Find all selected publications
        */
        $('#publication-listing .checked').each(function(index, element){

          // Extract the price from the table row
          var price = Number($('td:last-child', element).text().replace(/[^\d\.]/g, ''));
          
          // Add the publication price to the total price
          totalPublicationPrice += price;
          selectedPublications++;

        });
        // Add the total Recommended Retail Price (before tax) to the table row
        $('#total-recommended-retail-price .price').html(createDecimals(totalPublicationPrice.toFixed(2)));


        /**
        * 2.See if there are promotion codes applied
        */
        if(promotions.length > 0){

          $('.promotion-table-row:visible').remove();
          totalPromotionPrice = 0;

          // Discounts
          $(promotions).each(function(index, element){
            var promotionTableRow = $('.promotion-table-row').first().clone().insertAfter('.promotion-table-row').last().removeClass('hide');

            $('.message', promotionTableRow).text(element.message);
            $('.price', promotionTableRow).html(createDecimals((element.discount).toFixed(2)));

            totalPromotionPrice += Number(element.discount);
          });

        }


        /**
        * 3. Check if there is a multi-publication discount
        */
        if(selectedPublications > 1){

          // If there is a multi-publication discount, show the table row
          $('#multi-plublication-tr').removeClass('hide');

          // The minimum and maximum percentage ranges
          var minimumDiscountPercentage = 5;
          var maximumDiscountPercentage = 25;

          // Store the discount percentage
          var totalPercentage = minimumDiscountPercentage;

          // Caculate the discount percentage (if there are more than 2 publication selected)
          if(selectedPublications > 2){

            // We only do discounts up until 9 publications (= max percentage)
            if(selectedPublications > 8){

              totalPercentage = maximumDiscountPercentage;

            // Calculate the discount percentage
            }else{
              totalPercentage =  Math.round(minimumDiscountPercentage + (selectedPublications-2) * 20/7);
            }
          }

          multidiscountPrice = ((totalPercentage / 100) * totalPublicationPrice).toFixed(2);

          $('#multi-publication-discount-percentage').text(totalPercentage);
          $('#multi-plublication-tr .price').html(createDecimals(multidiscountPrice));

        }else{
          $('#multi-plublication-tr').addClass('hide');
        }


        /**
        * 4. Calculate taxes
        */
        totalAddedTax = ((tax / 100) * totalPublicationPrice).toFixed(2);
        $('#tax .price').html(createDecimals(totalAddedTax));


        /**
        * 5. Calculate total prices
        */
        // Total price = RetailPrice - promotions - discounts + tax )
        totalRetailPrice = (Number(totalPublicationPrice) - Number(multidiscountPrice) - Number(totalPromotionPrice) + Number(totalAddedTax)).toFixed(2);
        if(totalRetailPrice < 0){
          totalRetailPrice = 0;
        }else{
          totalRetailPrice = createDecimals(totalRetailPrice);
        }


        // Update table
        $('#total-taxed-price .price').html(totalRetailPrice);


        /**
        * 6. Show totals panel
        */
        // Only show the total section if there are publications selected (or if there is a specific promotion applied)
        if (selectedPublications > 0 || promotions.length > 0) {
          $('#price-calculation-section, #price-total-section').removeClass('closed');
        }else{
          // hide the totals - calculations if no publication are selected
          $('#price-calculation-section, #price-total-section').addClass('closed');
        }
      }


      // Small helper function to style the decimals by adding the .decimals class to the last 2 digits
      var createDecimals = function(price){
        var decimals;
        
        // Slice the decimals and store them in a seperate variable so we can add the ".decimals" class (used for styling)
        decimals = price.slice(-3);
        decimals = price.slice(0, -3) + '<span class="decimals">' + decimals + '</span>';

        return decimals
      }


      // Choose publications form validation
      var promoCodesValid = true;

      $("#calculate-price-form").validate({
        ignore: '.ignore',
        rules: { 
            "publications[]": { 
              required: true, 
              minlength: 1 
            }
        },
        messages: { 
            "publications[]": "Please select at least one publication"
        },
        errorPlacement: function(error, element) {

          // custom error label positioning
          if(element.attr("name") == "publications[]"){            
            error.appendTo("#order-error-container").addClass('publication-error');
            error.find('label').removeAttr('style').css('display', 'block');

          }else if(element.attr("id") == "license-agreement"){
            error.appendTo(".license-agreement");

          }else if(element.attr("id") == "promotions"){
            error.appendTo(".promotions");

          }else if(element.attr("id") == "country-select-box"){
            error.insertAfter(".out");

          }else if(element.hasClass('promocode-input')){

            var container = element.parent();
            $(container).parent().parent().append(error);

          }else{
            error.addClass('error-container');
            error.insertAfter(element);
          }
        },
        submitHandler: function(form){

          // Submit the form once the promo code section is valid
          if(promoCodesValid && !$('#promo-codes-box').hasClass('open')){
            form.submit();
          }

        }
      });

      
      /* Pormo code validation */
      $('#buy-subscriptions-btn').click(function(){

          // check if there are promo codes entered that aren't submitted
          if($('#promo-codes-box').hasClass('open')){

            promoCodesValid = true;

            $('.form-fields:visible').each(function(index, element){

              var promoCode = $(element).find('.promocode-input').val();
              if(promoCode.length > 0){
                  promoCodesValid = false;

                if($(element).find('.promo-error').length == 0){
                  $(this).append('<div class="error-container"><label class="promo-error">Please apply your promotion code before continuing</label></div>');
                }
              }

            });
            
          }
      });


      /* Submit promo code */      
      $('.promo-code-section .promocode-submit').click(function (event) {

          // Prevent promocode button from submitting the form
          event.preventDefault();

          // Store the promo code form section
          var promoCodeField = $(this).parent();
          
          // Store the promo code field
          var promoCodeSection = $(promoCodeField).parent();

          // Store promocode
          var promoCode = $(this).parent().find('.promocode-input').val();

          if(promoCode.length > 0){


            // Use this boolean for the Ajax return 
            var promoValidated = true;

            //
            //
            // Ajax call to connect with the database (and verify the promocode)
            //
            //

            // When the ajax call is true and the code is valid
            if(promoValidated){
              
              // Remove form fields after submissions
              $(promoCodeField).remove();

              // Show the succes message
              $('.succes-box', promoCodeSection).removeClass('none').find('.code').text(promoCode);

              // Add the promo code to the promotions array
              
              var promoData = {
                message: "Discount Voucher",
                discount: 100
              };
              promotions.push(promoData);
              
              // Update the price
              calculatePrice();


            // When the code is invalid
            }else{
              $('.error-box', promoCodeSection).removeClass('none');

              // use .text() for a custom error message
            } 

            // When the code is valid apply it to the form and disable the current promocode form

          }

      });


      // Promo code panel toggle
      $('#promo-codes-box .promo-code-section, #add-promo-code').addClass('closed');
      $('#promotion-codes-toggle-btn').click(function(){
        $('#promo-codes-box').toggleClass('open');
          $(this).toggleClass('icon-arrow-right-blue, icon-arrow-down-blue');
      });
      $('#promotion-codes-toggle-btn').click(function(){
        $('#promo-codes-box .promo-code-section').toggleClass('closed');
        $('#add-promo-code').toggleClass('closed');
         $('#promo-codes-box').toggleClass('closed');

      });
      $('#promo-codes-box #add-promo-code').click(function(){
        $('#promo-codes-box .promo-code-section').first().clone(true, true).insertBefore('#promo-codes-box #add-promo-code').removeClass('none').find('input[type=text]').val('');
      })


      // See details button (on publications)
      $('#publication-order-table .details').addClass('closed');
      $('#publication-order-table #publication-listing tr:visible:even').addClass('lighter-row'); 
      $('.see-details-btn').click(function(){
          var detailsPanel = $(this).parent().parent().next('tr').toggleClass('closed');
      
          if($(this).text() === "See details"){
            $(this).text("Hide details").removeClass('see-details-btn').addClass('hide-details-btn');
          }else{
            $(this).text("See details").removeClass('hide-details-btn').addClass('see-details-btn');
          }
      });


      /**
      * b. Sign in Register Page
      */
      $("#register-form").validate({
        rules:{
          building: {
             require_from_group: [1,".address-fields"]
          },
          street: {
             require_from_group: [1,".address-fields"]
          },
          area: {
             require_from_group: [1,".address-fields"]
          }
        }
      });
      $("#application-login-form").validate();


      /**
      * c. Payment details Page
      */
      $("#payment-details-form").validate({
        rules: {
          cardnumber: {
            creditcard: true
          },
          building: {
             require_from_group: [1,".address-fields"]
          },
          street: {
             require_from_group: [1,".address-fields"]
          },
          area: {
             require_from_group: [1,".address-fields"]
          }
        }
      });


      // Copy account address (dummy functionality)
      $('#use-account-address').click(function(){
        $('#building').val("Clinical & Biomedical Computing Ltd 2nd Floor");
        $('#street').val("32A Bridge Street");
        $('#town').val("Gurnee");
        $('#county').val("Illinois");
        $('#postalcode').val("60031");
        $('#country').val("AS");
      });


      /**
      * d. Payment confirmed Page
      */
      $("#create-account-form").validate({
        rules:{
          confirmpassword: { 
            equalTo: "#newpassword"
          } 
        }
      });


      // Print invoice form
      $('#print-invoice-btn').click(function(){
          window.print();
      });


    };


    /* ==========================================================
      Product Updates Page Specific Javascript
    */
    var wireProductUpdatesPage = function(){

      // 1. Style the custom select boxes
      wireSelect('.select-blue-box select');

      // 2. Hide details by default, removing the class "closed" will open the details for a specific history item
      $('.updates-list .details').parent().closest('li').addClass('closed');

      // 3. JS functionality to open a specific detail item from a url parameter (for when a user clicks on one of the "see details" links in the page footer)


      // 4. Show / hide details functionality
      // Add a cursor pointer to the h5 element
      $('.updates-list li').has('a').find('h5').css('cursor', 'pointer');

      // Show hide the details (using toggleClass .closed)
      $('.updates-list li a, .updates-list li h5').click(function(){
        
        var detailPanel = $(this).parent().closest('li');

            detailPanel.toggleClass('closed');
            if(detailPanel.hasClass('closed')){
                detailPanel.find('.see-details-btn').text('See details');
            }else{
                detailPanel.find('.see-details-btn').text('Hide details');
            }
            
      });

      // 4. Publication filter menu
      $("#publications-filter select").change(function(){ 
          $('#product-updates-list li').removeAttr('style');

          // Get the selected class
          var filterClass = $(this).find(":selected").attr('class');

          // Apply filter
          if(filterClass){
            $('#product-updates-list li').each(function(index, element){

                if($(element).hasClass(filterClass)){
                  $(element).removeAttr('style');
                }else{
                  $(element).hide();
                }
            });
          }
      });

      // 5. Lazyloading
      $('#load-updates').click(function(){

        //
        //
        // Load Update History via Ajax (presumably using the jQuery.ajax() methods)
        //
        //

      });

    };


    /* ==========================================================
      Help Page Specific Javascript
    */
    var wireHelpPage = function(){

      // 1. FAQ Section (toggle answers functionality)
      $('#faq dd').hide(); 
      $('#faq dt').click(function(){ 
        
        if($(this).is('a')){
          if ($(this).parent().next('dd').is(":hidden")) {
            $(this).text('Hide answer');
          }else{
            $(this).text('See answer');
          }
          $(this).parent().next('dd').toggle();
        
        }else{
          if ($(this).next('dd').is(":hidden")) {
            $(this).find('a').text('Hide answer');
          }else{
            $(this).find('a').text('See answer');
          }
          $(this).next('dd').toggle();
        }
      });

      // 2. FAQ Expand all answers
      $('#faq-expand-all').click(function(){
        if($(this).hasClass('faq-open')){
          $('#faq dd').hide(); 
          $(this).text('Expand all').removeClass('faq-open');
          $('#faq dt a').text('See answer');
        }else{
          $('#faq dd').show(); 
          $(this).text('Hide all').addClass('faq-open');
          $('#faq dt a').text('Hide answer');
        }
      });

      // 3. Subscribe form validation
      $('#subscribe-form').validate();
    };


    /* ==========================================================
      Contact Page Specific Javascript
    */
    var wireContactPage = function(){

      // 1. form validation for the contact form
      $('#contact-form').validate();

    };
    // END OF PAGE SPECIFIC JS
    

    /* ==========================================================
      Detect Current Responsive Viewmode (using the Modernizer framework)
    */
    var previousMode;
    function resizeHandler() {

      // If the current viewmode is << mobile >>
      if(Modernizr.mq('screen and (max-width: 761px)')) {

        // 1. Find the current page to active specific responsive settings
        switch($('body').attr('id')){

          // Home page
          case "hone-page":
            // Reset the benefits tab section
            $('#audience-nav .tabs').addClass('close').removeClass('open');
          break;

          // Publications page
          case "publications-page":
            // Mobile sidepanel
            settings.enableSidePanel = true;

            // Remove the selected state by default
            $('#publications-column ul li a').removeClass('active');

            // When the panel is open, move the close button
            if(sidePanelOpen){
              $('#close-side-panel').css('right',$('#factsheet').width()).show(0);
            }else{
              // hide the close button
              $('#close-side-panel').removeAttr('style');
            }
          break;
        }

        // 2. Store the viewMode in the settings
        previousMode = settings.viewMode = "mobile";


      // If the current viewmode is << tablet >>
      }else if(Modernizr.mq('screen and (max-width: 939px)')) {

        $('html, body, #factsheet, #close-side-panel').removeAttr('style');

        // Close the sign in panel and the password recovery panel
        if($('#signin-panel').hasClass('open')){
          $('#login-options-panel').removeClass('open');
          $('#signin-panel').removeClass('open');
        }
        $('#password-recovery-panel').removeClass('open');

        if($('#mobile-access-code').hasClass('open')){
          $('#access-code-toggle').text('Sign In');
        }else{
          $('#access-code-toggle').text('Enter an access code');
        }

        // 1. Find the current page to active specific responsive settings
        switch($('body').attr('id')){

          // Home page
          case "hone-page":
            // Reset the benefits tab section
            $('#audience-nav .tabs').addClass('close').removeClass('open');
          break;

          // Publications page
          case "publications-page":

            // Mobile sidepanel
            settings.enableSidePanel = false;
            sidePanelOpen = false;

            // No active page by default
            $(selectedPublication).addClass('active');

            // Hide the sidepanel button 
            $('#close-side-panel').removeAttr('style');

          break;
        }

        // 2. Store the viewMode in the settings
        previousMode = settings.viewMode = "tablet";


      // If the current viewmode is << desktop >>
      }else{

        $('.nav-toggle').removeClass('active').removeClass('icon-list-mobile-active').addClass('icon-list-mobile');
        $('#signin-btn').removeClass('signin-active');
      
        if(previousMode === "tablet"){
          $('.menu').removeAttr('style');
          $('#login-options-panel').removeClass('open');
        }

        if($('#authentication-code-section').hasClass('open')){
          $('#access-code-toggle').text('Sign In');
        }else{
          $('#access-code-toggle').text('Enter an access code');
        }


        // 1. Find the current page to active specific responsive settings
        switch($('body').attr('id')){

          // Home page
          case "hone-page":

            // Reset the benefits tab section
            $('#audience-nav .tab-info').removeAttr('style');
            $('#audience-nav .tabs li').removeAttr('style');   

          break;

          // Publications page
          case "publications-page":

            // Remove styling from the side panel
            $('#close-side-panel').removeAttr('style');

          break;
        }

        // 2. Store the viewMode in the settings
        previousMode = settings.viewMode = "desktop";
      }
    }


    /* ==========================================================
      Custom select
    */
    function wireSelect(selectBox){
      $("select").change(function () { 
        var str = ""; 
        str = $(this).find(":selected").text(); 
        $(".out").text(str); 
      }).trigger('change');
    } 


    /* ==========================================================
      Global Menu's Javascript (Main menu, sign-in, search)
    */

    // Global Menu
    $(".nav-toggle").removeClass('nomobile').addClass('showmobile').removeClass('notablet').addClass('showtablet');
    $(".nav-search").removeClass('nomobile').addClass('showmobile');

    $(".nav-toggle").click(function() {
      if ( $('.menu:visible').length < 1 ) {
        $('.menu').hide().slideDown(200, function() {
          $('.nav-toggle').toggleClass('active').removeClass('icon-list-mobile').addClass('icon-list-mobile-active');
          $('#login-options-panel').slideDown(200, function(){ $(this).addClass('open').removeAttr('style'); });
        });
      } else {
        $('.menu').stop(true, true).slideUp(200, function() {
          $('.nav-toggle').toggleClass('active').removeClass('icon-list-mobile-active').addClass('icon-list-mobile');
          $('#login-options-panel').stop(true, true).slideUp(200, function(){ $(this).removeClass('open').removeAttr('style') });

          if($('#password-recovery-panel').hasClass('open')){
            $('#password-recovery-panel').slideUp(200, function(){
              $('#password-recovery-panel').removeClass('open');
            });
          }
        });
      };
      return false;
    });


    // Search for mobile devices
    $(".nav-search").click(function() {
      if ( $('#mobile-search:visible').length < 1 ) {
        $('#mobile-search').slideDown(200, function() {
          $('.nav-search').toggleClass('active').removeClass('icon-search-mobile').addClass('icon-search-mobile-active');
          $(this).addClass('open').removeAttr('style');
        });
      } else {
        $('#mobile-search').stop(true, true).slideUp(200, function() {

          $('.nav-search').toggleClass('active').addClass('icon-search-mobile').removeClass('icon-search-mobile-active');
          $('#mobile-search').removeClass('open').removeAttr('style');
        });
      };
      return false;
    });


    // Show and hide the login panel
    $('#signin-btn').click(function(){

      // if the recovery panel is open, close this instead of the login panel
      if($('#password-recovery-panel').hasClass('open')){
        $('#password-recovery-panel').stop(true, true).slideUp(200, function(){
          $('#signin-btn').removeClass('signin-active');
          settings.passwordRecoveryOpen = false;
          $('#password-recovery-panel').removeClass('open').removeAttr('style');
        });

      // Toggle the loginpanel
      }else{

        if ( !$('#signin-panel').hasClass('open') ) {

          $('#signin-panel').hide().slideDown(200, function() {
            $('#signin-btn').addClass('signin-active');
            $('#signin-panel').addClass('open').removeAttr('style');
            $('#login-options-panel').slideDown(200,function(){ 
              $(this).addClass('open').removeAttr('style'); 
            });
          });

        }else{

          $('#signin-panel').stop(true, true).slideUp(200, function() {
            $('#signin-panel').removeClass('open').removeAttr('style');
            $('#signin-btn').removeClass('signin-active');
            $('#login-options-panel').slideUp(200,function(){ $(this).removeClass('open').removeAttr('style'); });
          });
         
        }
      }
    });


    // Toggle access code panel
    $('#access-code-toggle').click(function(){
      // For desktop
      if(settings.viewMode === "desktop"){
        if($('#login-section').hasClass('open')){
          $('#login-section').stop(true,true).removeClass('open').slideUp(200, function(){ $('#authentication-code-section').addClass('open').slideDown(); });
        }else if($('#authentication-code-section').hasClass('open')){
          $('#authentication-code-section').stop(true,true).removeClass('open').slideUp(200, function(){ $('#login-section').addClass('open').slideDown(); });
        }
      }else{
        if($('#mobile-signin').hasClass('open')){
          $('#mobile-signin').stop(true,true).removeClass('open').slideUp(200, function(){
              $('#mobile-access-code').slideDown(200, function(){ $(this).removeAttr('style').addClass('open'); });
          });
        }else if($('#mobile-access-code').hasClass('open')){
          $('#mobile-access-code').stop(true,true).slideUp(200, function(){
              $(this).removeClass('open');
              $('#mobile-signin').slideDown(200, function(){ $(this).removeAttr('style').addClass('open'); });
          });
        }
      }
      
      if($('#access-code-toggle').text() === "Sign In"){
        $('#access-code-toggle').text("Enter an access code");
      }else{
      $('#access-code-toggle').text("Sign In");
        }
    });


    // Password recovery panel
    $('.password-recovery-btn').click(function(){
        var selectedButton = this;

        if ( !$('#password-recovery-panel').hasClass('open') ) {

        // Showing the recovey panel 
        $('#signin-panel').stop(true, true).slideUp(200, function() {
           $('#password-recovery-panel').hide().slideDown(200, function(){
              $('#password-recovery-panel').addClass('open').removeAttr('style');
           });
          $('#signin-panel').removeClass('open').removeAttr('style');
          if(settings.viewMode === "mobile" || settings.viewMode === "tablet"){
            var scrollPos = $('#password-recovery-panel').offset().top;
            $("html, body").animate({ scrollTop: scrollPos });
          }else{
            $('#login-options-panel').stop(true, true).slideUp(200, function(){
              $(this).removeClass('open').removeAttr('style');
            });
          }
        });

      }else{
        // Closing the recovery panel
        $('#password-recovery-panel').stop(true, true).slideUp(200, function(){

          if(settings.viewMode === "desktop" && $(selectedButton).parent().parent().attr('id') !== "application-login-form"){

            $('#signin-panel').hide().slideDown(200, function(){
              $('#signin-panel').addClass('open').removeAttr('style');
              $('#login-options-panel').addClass('open');

              $('#password-recovery-panel').removeClass('open').removeAttr('style');
            });

          }else{           
            $(this).removeAttr('style').removeClass('open');
          }
        });
      }
    });


    // User dashboard
    $('#toggle-userpanel').click(function(){
      if ( $('#user-panel:visible').length < 1 ) {

        $('#user-panel').hide().slideDown(200, function() {
          $('#toggle-userpanel').addClass('user-panel-active');
          $('#logout-panel').show();
          $('#nav-header #toggle-userpanel, #toggle-account-menu a').addClass('user-panel-active');
        });

      }else{

        $('#user-panel').stop(true, true).slideUp(200, function() {
          $('#nav-header #toggle-userpanel, #toggle-account-menu a').removeClass('user-panel-active');
          $('#logout-panel').hide();
        });
      }
    });

    // User dashboad mobile toggle
    $('#toggle-account-menu a').click(function(){
      if ( $('#user-panel:visible').length < 1 ) {
        $('#user-panel').hide().slideDown(200);
        $('#logout-panel').show();
        $('#nav-header .btn-bright, #toggle-account-menu a').addClass('user-panel-active');

      }else{
        $('#user-panel').stop(true, true).slideUp(200);
        $('#logout-panel').hide();
        $('#nav-header .btn-bright, #toggle-account-menu a').removeClass('user-panel-active');
      }
    });


    /* ==========================================================
      Scroll to top buttons and other page interactions
    */

    // Scroll To top
    $('#to-top-button').click(function() {
      $("html, body").animate({ scrollTop: "0" });
    });

    // Scroll To Section
    $('.btn-down').click(function(event) {
      event.preventDefault();

      var scrollTarget = $(this).attr('href');
      var scrollPos = $(scrollTarget).offset().top;
      
      $("html, body").animate({ scrollTop: scrollPos });
    });


    /* =============================================================
      Carousel specific functions (see background-slider.js for core functionality)
    */

    /* Used for the subscribe form inside the carousel */
    var wireCarouselSubscribe = function(){
      if($('.js-background-slider #subscribe-form').length > 0){
        $('#subscribe-form').validate({
           
          // Submit via AJAX
          submitHandler: function(form) {

            // Example of an AJAX submit
            $.post('example.php', $(form).serialize(), function (data, textStatus) {
              form.submit();
            },'json');
          }
        });
      }
    }

    /* Wire the core carousel component */
    var wireCarousel = function(){
      $('#carousel').css('background', '#000');
      $('#carousel-js-fallback').remove();

      // Hide the carousel navigation if there is only one element in the carousel otherwise wire the navigation
      if($('#carousel-list li').length > 1){
        
        // Carousel next - prev buttons
        $(".js-next").show().click(function () {
          carouselNext();
        });
        $(".js-prev").show().click(function () {
          carouselPrevious();
        });

        // Carousel gestures
        $('#carousel').hammer().on("swipeleft", function(ev) {
           carouselNext();
        });
        $('#carousel').hammer().on("swiperight", function(ev) {
           carouselPrevious();
        });

        // Create carousel dots
        var helpCarouselMenu = "";
        $('#carousel-list li').each(function(index, element){
          var isActive;
          if(index === 0){
            isActive = 'class="active"';
          }
          helpCarouselMenu += "<li><a href='javascript:;' " + isActive + "><span>&nbsp;</span></a></li>"; 
        });
        $('#carousel-dots-container ul').append(helpCarouselMenu);

      }else{
        $('.carousel-menu-background').remove();
        $('.carousel-text').css('bottom','0');
        $('#carousel-dots-container').hide();
      }

      // New Backgrooundslider (carousel see background-slider.js)
      var bgSlider = new BackgroundSlider({
        $el: $("#carousel")
      });

      var activeBackground = 0;
      var images = [];

      $("#carousel #carousel-list li").each(function () {
        var background = $(this).css('background-image');
            background = background.replace('url(','').replace(')','');

        var image = {
          background: background,
          html: $(this).html()
        };

        images.push(image);
      });

      bgSlider.slideToNewBackgroundImage(undefined, images[0].background, images[0].html);


      // Wire carousel dots
      $('#carousel-dots-container ul li a').click(function(){

        // Only enable the menu on non active buttons
        if(!$(this).hasClass('active')){

          var direction = "next";

          // see if we need to slide left or right to left
          if(activeBackground > $(this).parent().index()){
              direction = "previous";
          }

          // set the new index
          activeBackground = $(this).parent().index();
          setCarouselDots();

          // trigger carousel
          bgSlider.slideToNewBackgroundImage(direction, images[activeBackground].background, images[activeBackground].html, function(){ wireCarouselSubscribe(); });
        }
      });



      // Carousel go to the next slide
      function carouselPrevious(){
        activeBackground -= 1;
        if (activeBackground < 0) {
          activeBackground = images.length - 1;
        }
        setCarouselDots();
        bgSlider.slideToNewBackgroundImage("previous", images[activeBackground].background, images[activeBackground].html, function(){ wireCarouselSubscribe(); });
      }

      // Carousel go o the previous slide
      function carouselNext(){
          activeBackground += 1;

        if (activeBackground > images.length - 1) {
          activeBackground = 0;
        }
        setCarouselDots();
        bgSlider.slideToNewBackgroundImage("next", images[activeBackground].background, images[activeBackground].html, function(){ wireCarouselSubscribe(); });
    
      }

      // Update carousel dots
      function setCarouselDots(){
        $('#carousel-dots-container ul li a').removeClass('active');
        $('#carousel-dots-container ul li:eq(' + activeBackground + ') a').addClass('active');
      }

    }

  
    // Initialise
    init();
  });