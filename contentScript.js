var script = document.createElement('script');
script.src = browser.extension.getURL('pageScript.js');;
(document.head||document.documentElement).appendChild(script);
script.remove();

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_odoo_data') {
        sendResponse({
            odoo_version: document.body.getAttribute('data-odoo-version-type'),
            debug_mode: document.body.getAttribute('data-odoo-debug-mode'),
        });
    }
});