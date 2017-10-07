chrome.tabs.onActivated.addListener(function(info){
chrome.tabs.get(info.tabId, function(change){
        if(change.url == undefined){
            chrome.browserAction.setTitle({title: 'Click to activate odoo debug mode'});
            chrome.browserAction.setIcon({path: '../icons/bug-off.png', tabId: info.tabId});
        }
        else if(change.url.includes("/web?debug=assets")){
            chrome.browserAction.setTitle({title: 'Click to desactivate debug mode with assets'});
            chrome.browserAction.setIcon({path: '../icons/bug-on-assets.png', tabId: info.tabId});
        }
        else if(change.url.includes("/web?debug=") || change.url.includes("/web?debug#")){
            chrome.browserAction.setTitle({title: 'Click to desactivate debug mode'});
            chrome.browserAction.setIcon({path: '../icons/bug-on.png', tabId: info.tabId});
        }
        else{
            chrome.browserAction.setTitle({title: 'Click to activate odoo debug mode'});
            chrome.browserAction.setIcon({path: '../icons/bug-off.png', tabId: info.tabId});
        }
    });
});
chrome.tabs.onUpdated.addListener(function (tabId, change, tab){
    if(tab.url == undefined){
        chrome.browserAction.setTitle({title: 'Click to activate odoo debug mode'});
        chrome.browserAction.setIcon({path: '../icons/bug-off.png', tabId: info.tabId});
    }
    else if(tab.url.includes("/web?debug=assets")){
        chrome.browserAction.setTitle({title: 'Click to desactivate odoo debug mode with assets'});
        chrome.browserAction.setIcon({path: '../icons/bug-on-assets.png', tabId: tabId});
    }
    else if(tab.url.includes("/web?debug=") || tab.url.includes("/web?debug#")){
        chrome.browserAction.setTitle({title: 'Click to desactivate odoo debug mode'});
        chrome.browserAction.setIcon({path: '../icons/bug-on.png', tabId: tabId});
    }
    else{
        chrome.browserAction.setTitle({title: 'Click to activate odoo debug mode'});
        chrome.browserAction.setIcon({path: '../icons/bug-off.png', tabId: tabId});
    }
});

var alreadyClicked = false;
var timer;

//Wait for click
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs[0]) {

            var tab = tabs[0];

            if (alreadyClicked){
                clearTimeout(timer);

                if (!(tab.url.includes("/web?debug=assets#")))
                {
                    if (tab.url.includes("/web?debug=#")) {
                        chrome.tabs.update(tab.id, {
                            url: tab.url.replace('/web?debug=#', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web?debug#")) {
                        chrome.tabs.update(tab.id, {
                            url: tab.url.replace('/web?debug#', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web#")) {
                        chrome.tabs.update(tab.id, {
                            url: tab.url.replace('/web#', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web")) {
                        chrome.tabs.update(tab.id, {
                            url: tab.url.replace('/web', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web?#")) {
                        chrome.tabs.update(tab.id, {
                            url: tab.url.replace('/web?#', '/web?debug=assets#')
                        });
                    }
                }
                else {
                    chrome.tabs.update(tab.id, {
                        url: tab.url.replace('/web?debug=assets#', '/web#')
                    });
                }

                alreadyClicked = false;

            }
            else {
                if (tab.url.includes("/web?debug=#")) {
                    chrome.tabs.update(tab.id, {
                        url: tab.url.replace('/web?debug=#', '/web#')
                    });
                } else if (tab.url.includes("/web?debug#")) {
                    chrome.tabs.update(tab.id, {
                        url: tab.url.replace('/web?debug#', '/web#')
                    });
                } else if (tab.url.includes("/web#")) {
                    chrome.tabs.update(tab.id, {
                        url: tab.url.replace('/web#', '/web?debug=#')
                    });
                } else if (tab.url.includes("/web")) {
                    chrome.tabs.update(tab.id, {
                        url: tab.url.replace('/web', '/web?debug#')
                    });
                } else if (tab.url.includes("/web?#")) {
                    chrome.tabs.update(tab.id, {
                        url: tab.url.replace('/web?#', '/web?debug#')
                    });
                }

                alreadyClicked = true

                // add timer to detect next click
                timer = setTimeout(function () {

                    clearTimeout(timer);

                    alreadyClicked = false
                }, 250);
            }
        }
    });
})