let odooVersionType = 'old';
let odooDebugMode = '';

if (window.hasOwnProperty('odoo') && odoo.hasOwnProperty('debug')) {
    // before V13, odoo sets "debug" to "true" or "false"
    if (typeof odoo.debug === 'boolean') {
        const url = window.location.href;
        if (url.indexOf('?debug=assets') !== -1) {
            odooDebugMode = 'assets';
        } else if (url.indexOf('?debug') !== -1) {
            odooDebugMode = '1';
        }
    // In V13 and above odoo sets "debug" to "1" and "0"
    } else {
        odooDebugMode = odoo.debug;
        odooVersionType = 'new';
    }
}

document.body.setAttribute('data-odoo-version-type', odooVersionType);
document.body.setAttribute('data-odoo-debug-mode', odooDebugMode);