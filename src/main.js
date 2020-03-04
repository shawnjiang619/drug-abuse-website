(function () {
    // On page load:
    var myFullpage = new fullpage('#fullpage', {
        anchors: ['title', 'pie', 'bar', 'sunburst', 'map', 'treemap', 'crime','stats', 'bubble'],
        navigation: true,
        navigationPosition: 'right',
        navigationTooltips: ['Title', 'Most Addictive', 'Most Popular', 'Age', 'Map Exploration', 'Treemap', 'Crime', 'Stats', 'Deaths'],
        afterLoad: function(origin, destination, direction) {
            if (destination.index == 1) {
                executePie();
            }
            if (destination.index == 7) {
                $('.counter').counterUp({
                    delay: 10,
                    time: 1000
                });
            } 
        }
    });
}());