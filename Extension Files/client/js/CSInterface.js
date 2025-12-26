/*
 * CSInterface.js
 * 
 * Standard Adobe CSInterface library for CEP extensions.
 * This is a minimal version sufficient for evalScript.
 */
var CSInterface = function () {
    // Look for the native CEP object
    if (typeof window.__adobe_cep__ !== "undefined") {
        this.hostEnvironment = JSON.parse(window.__adobe_cep__.getHostEnvironment());
    } else {
        console.log("CSInterface: __adobe_cep__ not found. Are you running in a browser?");
    }
};

CSInterface.prototype.evalScript = function (script, callback) {
    if (typeof window.__adobe_cep__ !== "undefined") {
        window.__adobe_cep__.evalScript(script, callback);
    } else {
        console.log("CSInterface: evalScript called in browser context: " + script);
    }
};

CSInterface.prototype.closeExtension = function () {
    if (typeof window.__adobe_cep__ !== "undefined") {
        window.__adobe_cep__.closeExtension();
    }
};
