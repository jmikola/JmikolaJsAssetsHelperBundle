{
    "id": "assets_helper",
    "paths": ["@JmikolaJsAssetsHelperBundle/Resources/js"],
    "mode": "ADVANCED",
    "level": "VERBOSE",
    "inputs": "@JmikolaJsAssetsHelperBundle/Resources/js/export.js",
    "externs": "@JmikolaJsAssetsHelperBundle/Resources/js/externs.js",

    "define": {
        "goog.DEBUG": false
    },

    "type-prefixes-to-strip": ["goog.debug", "goog.asserts", "goog.assert", "console"],
    "name-suffixes-to-strip": ["logger", "logger_"],

    "output-file": "@JmikolaJsAssetsHelperBundle/Resources/public/js/assets_helper.js",
    "output-wrapper": "/**\n * Portions of this code are from the Google Closure Library,\n * received from the Closure Authors under the Apache 2.0 license.\n *\n * All other code is taken from php.js or is (C) 2011 Jeremy Mikola and subject to the MIT license.\n */\n(function() {%output%})();",

    "pretty-print": false,
    "debug": false
}