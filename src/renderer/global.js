// Provide a global object for the renderer process
if (typeof global === 'undefined') {
    window.global = window;
}

module.exports = window.global;