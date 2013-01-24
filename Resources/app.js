// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

Ti.include(
    'debug.js',
    'Controllers/about.js',
    'Controllers/feeds.js',
    'Controllers/strip_tags.js'
);

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
//  add tabs
//
tabGroup.addTab(Feeds_Tab);
tabGroup.addTab(About_Tab);

// open tab group
tabGroup.open();

// Start the load
startFeedLoader();
