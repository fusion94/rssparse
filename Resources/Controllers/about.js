About = {};

//
// create controls tab and root window
//
var About_Win = Titanium.UI.createWindow({  
    title: 'About',
    backgroundColor: '#5CB7E7'
});

var About_Tab = Titanium.UI.createTab({  
    icon: 'images/tabbar/info.png',
    title: 'About',
    window: About_Win
});



