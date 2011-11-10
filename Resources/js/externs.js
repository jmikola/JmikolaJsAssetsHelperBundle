/**
 * @fileoverview This file contains some properties which we don't
 * want the compiler to rename.
 */
var externs = {
    'baseUrls': [],
    version: '',
    format: '',
    http: [],
    ssl: []
};

/**
 * @constructor
 */
var PHP_JS = function(){};

/**
 * @param {string} str
 * @return {string}
 */
PHP_JS.prototype.md5 = function(str){};

/**
 * @param {string} format
 * @param {...string|number} var_args
 * @return {string}
 */
PHP_JS.prototype.sprintf = function(format, var_args){};
