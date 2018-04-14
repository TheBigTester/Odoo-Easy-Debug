function updt_icon_description(tabId, change, tab){
    browser.storage.sync.get(["iconOption"], function(result){
        var iconOption = 'default';
        if (typeof result !== 'undefined') {
            iconOption = result.iconOption || 'default';
        }

        if (tab.url == undefined) {
            browser.browserAction.setTitle({ title: 'Click to activate odoo debug mode' });
            browser.browserAction.setIcon({ path: '../icons/'+iconOption+'-off.png', tabId: tabId });
        } else if (tab.url.includes("/web?debug=assets")) {
            browser.browserAction.setTitle({ title: 'Click to desactivate debug mode with assets' });
            browser.browserAction.setIcon({ path: '../icons/'+iconOption+'-on-assets.png', tabId: tabId });
        } else if (tab.url.includes("/web?debug=") || tab.url.includes("/web?debug#")) {
            browser.browserAction.setTitle({ title: 'Click to desactivate debug mode' });
            browser.browserAction.setIcon({ path: '../icons/'+iconOption+'-on.png', tabId: tabId });
        } else {
            browser.browserAction.setTitle({ title: 'Click to activate odoo debug mode' });
            browser.browserAction.setIcon({ path: '../icons/'+iconOption+'-off.png', tabId: tabId });
        }
    });
};

browser.tabs.onActivated.addListener(function(info) {
    browser.tabs.get(info.tabId, function(tab) {
        updt_icon_description(info.tabId, false, tab);
    });
});
browser.tabs.onUpdated.addListener(function(tabId, change, tab) {
    updt_icon_description(tabId, change, tab)
});

var alreadyClicked = false;
var timer;

function change_debug_state(tab) {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if (tabs[0]) {

            var tab = tabs[0];

            if (alreadyClicked) {
                clearTimeout(timer);

                if (!(tab.url.includes("/web?debug=assets#"))) {
                    if (tab.url.includes("/web?debug=#")) {
                        browser.tabs.update(tab.id, {
                            url: tab.url.replace('/web?debug=#', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web?debug#")) {
                        browser.tabs.update(tab.id, {
                            url: tab.url.replace('/web?debug#', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web#")) {
                        browser.tabs.update(tab.id, {
                            url: tab.url.replace('/web#', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web")) {
                        browser.tabs.update(tab.id, {
                            url: tab.url.replace('/web', '/web?debug=assets#')
                        });
                    } else if (tab.url.includes("/web?#")) {
                        browser.tabs.update(tab.id, {
                            url: tab.url.replace('/web?#', '/web?debug=assets#')
                        });
                    }
                } else {
                    browser.tabs.update(tab.id, {
                        url: tab.url.replace('/web?debug=assets#', '/web#')
                    });
                }

                alreadyClicked = false;

            } else {
                if (tab.url.includes("/web?debug=#")) {
                    browser.tabs.update(tab.id, {
                        url: tab.url.replace('/web?debug=#', '/web#')
                    });
                } else if (tab.url.includes("/web?debug#")) {
                    browser.tabs.update(tab.id, {
                        url: tab.url.replace('/web?debug#', '/web#')
                    });
                } else if (tab.url.includes("/web#")) {
                    browser.tabs.update(tab.id, {
                        url: tab.url.replace('/web#', '/web?debug=#')
                    });
                } else if (tab.url.includes("/web")) {
                    browser.tabs.update(tab.id, {
                        url: tab.url.replace('/web', '/web?debug#')
                    });
                } else if (tab.url.includes("/web?#")) {
                    browser.tabs.update(tab.id, {
                        url: tab.url.replace('/web?#', '/web?debug#')
                    });
                }

                alreadyClicked = true

                // add timer to detect next click
                timer = setTimeout(function() {

                    clearTimeout(timer);

                    alreadyClicked = false
                }, 250);
            }
        }
    });
};

//Wait for click
browser.browserAction.onClicked.addListener(change_debug_state);

browser.commands.onCommand.addListener(function(command) {
    console.log('Command:', command);
    if (command == 'toggle-debug') {
        change_debug_state(browser.tabs.getCurrent());
    }
});