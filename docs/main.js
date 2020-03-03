(function () {
    // var slideIndex1 = 1;
    // var slideIndex2 = 1;
    // var slideIndex3 = 1;
    // var sliding = false;

    // On page load:
    $(document).ready(function() {
	    $('#fullpage').fullpage({
            // Add options here [https://github.com/alvarotrigo/fullPage.js#options]
            navigation: "true",
            navigationPosition: "right",
            navigationTooltips: ["Introduction", "Mass Shootings", "The Big Picture", "The Past Decade", "Understanding the Circumstances", "Understanding Our Laws", "What Can You Do to Help?", "Credits and References", "About Us"],
            loopHorizontal: false,
            controlArrows: false,
            // callbacks:
            afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
                $('.scroll-down').show();
                // On scroll into blob page, load blob
                // if (anchorLink === "gun-deaths-overview" && slideIndex == 1) {
                //     executeBlobLoad(); // fun in intro-blob.js
                // } else if (anchorLink === "gun-deaths-overview" && slideIndex == 2) {
                //     executeCarTerror();
                // } else if (anchorLink === "gun-deaths-overview" && slideIndex == 3) {
                //     executeHDI();
                // } 
            },

            afterLoad: function(anchorLink, index) {
                $('.scroll-down').show();
            },

            onLeave: function(index, nextIndex, direction) {
                $('.scroll-down').hide();
            }, 

            onSlideLeave: function (anchorLink, index, slideIndex, direction, nextSlideIndex) {
                $('.scroll-down').hide();
            },

        });
        $.fn.fullpage.setKeyboardScrolling(false);
    });
}());