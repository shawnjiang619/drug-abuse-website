(function () {
    // On page load:
    var myFullpage = new fullpage('#fullpage', {
        anchors: ['title', 'intro', 'transpie','pie', 'transbar','bar', 'transsunburst', 'sunburst', 'transmap', 'map', 'transradar', 'crime','stats', 'bubble'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Title', 'Introduction', 'Transition', 'Most Addictive','Transition', 'Most Popular', 'Transition', 'Age', 'Transition', 'Map Exploration', 'Transition', 'Crime', 'Stats', 'Deaths'],
        afterLoad: function(origin, destination, direction) {
            if (destination.index == 3) {
                executePie();
            }
            if (destination.index == 12) {
                $('.counter').counterUp({
                    delay: 10,
                    time: 1000
                });
            }
        }
    });

    // Things that need to be loaded when website is loaded
    window.onload = function() {
        resetDef();
        this.executeSunburst();
    }
}());
