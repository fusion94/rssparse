Feeds = {};

//
// create controls tab and root window
var Feeds_Win = Titanium.UI.createWindow({
    title: 'Feeds',
    backgroundColor: '#ffffff'
});
var Feeds_Tab = Titanium.UI.createTab({
    icon: 'images/tabbar/rss.png',
    title: 'Feeds',
    window: Feeds_Win
});

// occasionally using this as a test feed.
var url = 'http://fusion94.org/rss.xml';

// loadRRSFeed(url) // is at the bottom of the js - after all the functions

var i = 0;
var feedTableView;
var feedTitle = '';
var itemList;
var indicator = Titanium.UI.createActivityIndicator();
//indicator.setType(Titanium.UI.ActivityIndicator.INDETERMINANT);

function displayItems(itemList) {
    var count = 0;
    indicator.setMessage("Parsing RSS Feed...");
    indicator.show();

    // Check for a more button
    var sections = feedTableView.data;
    if (sections.length == 1) {
        count = sections[0].rowCount;
        if (count > 0) {
            feedTableView.deleteRow(count - 1, {animationStyle: Titanium.UI.iPhone.RowAnimationStyle.NONE});
        }
    }

    for (var c = count; c < count + 10 && c < itemList.length; c++) {
        var title = null;
        var desc = null;
        var author = null;
        var pubDate = null;
        var link = null;
     //   var new_row = null;

        // Item title
        title = itemList.item(c).getElementsByTagName("title").item(0).text;
        // Item description
        desc = itemList.item(c).getElementsByTagName("description").item(0).text;
        // Item author
        author = itemList.item(c).getElementsByTagName("author").item(0).text;
        // Item date
        pubDate = itemList.item(c).getElementsByTagName("pubDate").item(0).text;
        // Item link
        link = itemList.item(c).getElementsByTagName("link").item(0).text;

        // Clean up any nasty linebreaks & special characters in the title and description
        title = title.replace(/\n/gi, " ");
        desc = desc.replace(/\n/gi, " ");
        desc = desc.replace(/&rsquo;/gi, "'");
        desc = desc.replace(/&hellip;/gi, "...");
        desc = desc.replace(/&#39;/gi, "'");
        desc = desc.replace(/&nbsp;/gi, " ");
        desc = desc.replace(/&quot;/gi, '"');
        // In pubDate let's remove the +0100 offset from displaying
        pubDate = pubDate.replace(/\+0100/gi, "");

        // Create a table row for this item TABLE ROW VIEW
        new_row = Ti.UI.createTableViewRow({
            height: '65',
            //height: 'auto',
            width: 'auto',
            backgroundColor: '#ffffff',
            id: c
        });

        // Create a label for the title
        var post_title = Ti.UI.createLabel({
            text: title,
            color: '#000',
            textAlign: 'left',
            left: 45,
            top: 15,
            height: 'auto',
            width: 'auto',
            font: {fontWeight: 'bold', fontSize: 12}
        });
        new_row.add(post_title);

        // Create a label for the pubDate
        var post_pubDate = Ti.UI.createLabel({
            text: pubDate,
            color: '#000',
            textAlign: 'left',
            left: 45,
            height: 'auto',
            width: 'auto',
            bottom: 15,
            font: {fontWeight: 'bold', fontSize: 10}
        });
        new_row.add(post_pubDate);

        // add the rss logo on the left naturally this could be an image in the feed itself if it existed
        var item_image = Ti.UI.createImageView({
            image: 'images/rss1.png',
            left: 3,
            top: 15,
            width: 35,
            height: 35
        });
        new_row.add(item_image);

        // Add some rowData for when it is clicked
        new_row.thisTitle = title;
        new_row.thisDesc = desc;
        new_row.thisAuthor = author;
        new_row.thispubDate = pubDate;
        new_row.thisLink = link;

        // Add the row to the tableview
        feedTableView.appendRow(new_row, {animationStyle: Titanium.UI.iPhone.RowAnimationStyle.NONE});
    }  // End for
    indicator.hide();
    // Add the more button
    if (feedTableView.data.length == 1) {
        count = feedTableView.data[0].rowCount;
    }

    Ti.API.info('count: ' + count + ' length: ' + itemList.length);
    if (count < itemList.length - 1) {
        var loadmore = Ti.UI.createTableViewRow({
            height: '55',
            width: 'auto',
            backgroundColor: '#ffffff',
            id: 'loadmore'
        });
        loadmore.add(Ti.UI.createLabel({
            text: 'Load More...',
            color: '#000',
            textAlign: 'center',
            font: {fontWeight: 'bold', fontSize: 12}
        }));
        feedTableView.appendRow(loadmore, {animationStyle: Titanium.UI.iPhone.RowAnimationStyle.NONE});
    }

} // End displayItems


function loadRSSFeed(url) {
    data = [];
    Ti.API.info('Loading RSS feed: ' + url);
    indicator.setMessage("Loading RSS Feed...");

    xhr = Titanium.Network.createHTTPClient();
    xhr.open('GET', url);
    xhr.onload = function () {
        Ti.API.info('>>> got the feed! ... ');

        // Now parse the feed XML
        var xml = this.responseXML;

        // Find the channel element
        var channel = xml.documentElement.getElementsByTagName("channel");

        feedTitle = channel.item(0).getElementsByTagName("title").item(0).text;

        Feeds_Win.title = feedTitle;
        // Find the RSS feed 'items'
        itemList = xml.documentElement.getElementsByTagName("item");
        //Ti.API.info('found ' + itemList.length + ' items in the RSS feed');

        // Now add the items to a tableView
        indicator.hide();
        Ti.API.info('calling displayItems');
        displayItems(itemList);
    };

    xhr.send();
    indicator.show();
}

feedTableView = Titanium.UI.createTableView({
    top: 0
});
// Create tableView row event listener
feedTableView.addEventListener('click', function (e) {
    Ti.API.info('click fired: ' + e.rowData.id);
    if (e.rowData.id == 'loadmore') {
        displayItems(itemList);
    } else {
        var item_window = Ti.UI.createWindow({
            title: 'Item',
            backgroundColor: '#ffffff'
        });

        // Header for title, author and published date
        var item_header_view = Ti.UI.createView({
            backgroundColor: '#c1c1c1',
            top: 0,
            height: '80'
        });

        var item_title_label = Ti.UI.createLabel({
            text: '',
            //backgroundColor: '',
            color: '#000',
            //textAlign: 'center',
            left: 10,
            right: 10,
            top: 5,
            //height: 45,
            font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 14}
        });

        var item_author_label = Ti.UI.createLabel({
            text: '',
            color: '#000',
            left: 10,
            right: 10,
            top: 45,
            font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
        });

        var item_pubDate_label = Ti.UI.createLabel({
            text: '',
            color: '#000',
            left: 10,
            right: 10,
            top: 60,
            font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
        });

        var item_desc_label = Ti.UI.createLabel({
            text: '',
            color: '#000',
            textAlign: 'left',
            left: 10,
            right: 10,
            top: 80,
            font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
        });

        var item_link_label = Ti.UI.createLabel({
            text: '',
            color: '#0b0b61',
            textAlign: 'center',
            left: 10,
            right: 10,
            bottom: 20,
            font: {fontFamily: 'Helvetica Neue', fontWeight: 'bold', fontSize: 12}
        });
        item_window.add(item_header_view);
        item_title_label.text = strip_tags(e.rowData.thisTitle);
        item_window.add(item_title_label);
        item_author_label.text = strip_tags(e.rowData.thisAuthor);
        item_window.add(item_author_label);
        item_pubDate_label.text = strip_tags(e.rowData.thispubDate);
        item_window.add(item_pubDate_label);
        item_desc_label.text = strip_tags(e.rowData.thisDesc);
        item_window.add(item_desc_label);
        item_link_label.text = "Read More...";
        item_link_label.url = strip_tags(e.rowData.thisLink);
        item_window.add(item_link_label);

        item_link_label.addEventListener('click', function (e) {
            Ti.Platform.openURL(item_link_label.url);
        });

        Feeds_Tab.open(item_window, {animated: true});
    }
});

function startFeedLoader() {
    Feeds_Win.add(feedTableView);
    loadRSSFeed(url);
}
