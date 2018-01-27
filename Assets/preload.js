//
// Note: the WebView preload attribute only accepts file: protocols
//       and only accepts js files so this file needs to be pure
//       browser-readable javascript
//
// SECURITY NOTE The preload script is part of the electron app so it has access to 
// the node.js and electron APIs. The remote web app should not have 
// access to Electron or the ipcRenderer except as explicitly allowed
// by the electron copy of this file (so the following line is safe
// as web pages can't provide their own malicious copy of this file)
//
const { ipcRenderer } = require('electron');

(function() {
    //
    // SECURITY WARNING here we do work to prevent exposing any functionality
    // or APIs that could compromise the user's computer. Only allow specific
    // ipc routes to be registered and called that start with "w2r-"
    // (a shorthand way of saying webview->renderer). This helps the app and
    // the developer easily tell whether a message came from the webview
    // or from the backend or renderer. The electron backend should similarly never
    // register or expose any routes starting with "w2r-" (all "w2r-" routes should
    // be handled by the renderer and if the renderer chooses to relay them to the main
    // process the renderer should do so over an "r2m-"" channel (render->main).
    // Messages sent the other direction should be on channels ending with "-reply"
    // (eg. webview sends w2r-foo to renderer and renderer replys to webview via w2r-foo-reply).
    // It's important to avoid exposing core Electron capabilities to the
    // loaded web page to prevent malicious pages or web content from taking control
    // of the user's PC. 
    //
    window.ipcRendererStub = {
        on: (ipc, handler) => {
            //
            // note: ipc.substr(-"-reply".length) === "-reply" is a javascript form of ipc.endsWith("-reply")
            //
            if ((ipc.indexOf("w2r-") === 0) && (ipc.substr(-"-reply".length) === "-reply")) {
                //
                // NOTE: ipcRenderer.on is registering for messages
                //       from the containing electron renderer, not
                //       from the electron backend
                //
                ipcRenderer.on(ipc, handler);
            }
        },
        sendToHost: (ipc, arg) => {
            if ((ipc.indexOf("w2r-") === 0) && (ipc.substr(-"-reply".length) !== "-reply")) {
                //
                // NOTE: Send to host sends to the containing
                //       electron renderer, not to the electron
                //       backend
                //
                ipcRenderer.sendToHost(ipc,arg);
            }
        }
    };
})();
