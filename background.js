let updtIconAndDescription = (tabId, debugMode) => {
    browser.storage.sync.get(["iconOption"], (result) => {
        let iconOption = 'default';
        if (typeof result !== 'undefined') {
            iconOption = result.iconOption || 'default';
        }

        if (debugMode == '0' || !debugMode || debugMode == '') {
            browser.browserAction.setTitle({ title: 'Click to activate odoo debug mode' });
            browser.browserAction.setIcon({ path: '../icons/' + iconOption + '-off.png', tabId: tabId });
        } else if (debugMode == 'assets') {
            browser.browserAction.setTitle({ title: 'Click to desactivate debug mode with assets' });
            browser.browserAction.setIcon({ path: '../icons/' + iconOption + '-on-assets.png', tabId: tabId });
        } else if (debugMode == '1') {
            browser.browserAction.setTitle({ title: 'Click to desactivate debug mode' });
            browser.browserAction.setIcon({ path: '../icons/' + iconOption + '-on.png', tabId: tabId });
        }
    });
};

// old means before V13
var odooVersion = 'old';
var debugMode = '';

let getVarsAndUpdtIcon = () => {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, tabs => {
        if (tabs[0]) {
            const tabId = tabs[0].id;
            browser.tabs.sendMessage(tabId, { message: 'get_odoo_data' }, response => {
                if (!browser.runtime.lastError && response) {
                    odooVersion = response.odoo_version;
                    debugMode = response.debug_mode;

                    console.log('odooVersion', odooVersion, 'debugMode', debugMode)

                    updtIconAndDescription(tabId, debugMode);
                }
            });
        };
    });
}

let alreadyClicked = false;
let timer;

let updtURL = () => {
    browser.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        if (tabs[0]) {

            const tab = tabs[0];
            let newState = '';

            if (alreadyClicked) {
                // if 2 clicks
                clearTimeout(timer);

                if (debugMode == '0' || !debugMode || debugMode == '' || debugMode == '1') {
                    newState = 'assets';
                } else {
                    newState = 'normal';
                }

                alreadyClicked = false;

            } else {
                // if 1 click
                if (debugMode == '0' || !debugMode || debugMode == '') {
                    newState = 'debug';
                } else if (debugMode == '1') {
                    newState = 'normal';
                }

                alreadyClicked = true

                // add timer to detect next click
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    alreadyClicked = false
                }, 250);
            }

            let newStateStr = '';

            if (odooVersion == 'old') {
                if (newState == 'debug') {
                    newStateStr = '?debug='
                } else if (newState == 'assets') {
                    newStateStr = '?debug=assets'
                }
            } else if (odooVersion == 'new') {
                if (newState == 'normal' && debugMode == '1') {
                    newStateStr = '?debug=0'
                } else if (newState == 'debug') {
                    newStateStr = '?debug=1'
                } else if (newState == 'assets') {
                    newStateStr = '?debug=assets'
                }
            }

            const tabURL = new URL(tab.url);
            browser.tabs.update(tab.id, { url: tab.url = tabURL.origin + tabURL.pathname + newStateStr + tabURL.hash });
        }
    });
};

let updtTabDebugMode = (ev) => {
    getVarsAndUpdtIcon();
    updtURL();
};


// on extension click listeners
browser.browserAction.onClicked.addListener(updtTabDebugMode);

// on key command listeners
browser.commands.onCommand.addListener((command) => {
    if (command == 'toggle-debug') {
        updtTabDebugMode();
    }
});

// on tabs listeners
browser.tabs.onActivated.addListener(getVarsAndUpdtIcon);
browser.tabs.onUpdated.addListener(getVarsAndUpdtIcon);