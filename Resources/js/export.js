/**
 * @fileoverview This file is the entry point for the compiler.
 *
 * You can compile this script by running (assuming you have JMSGoogleClosureBundle installed):
 *
 *    php app/console plovr:build @JmikolaJsAssetsHelperBundle/compile.js
 */

goog.require('jmikola.AssetsHelper');

goog.exportSymbol('jmikola.AssetsHelper', jmikola.AssetsHelper);
goog.exportProperty(jmikola.AssetsHelper, 'getInstance', jmikola.AssetsHelper.getInstance);
goog.exportProperty(jmikola.AssetsHelper.prototype, 'init', jmikola.AssetsHelper.prototype.init);
goog.exportProperty(jmikola.AssetsHelper.prototype, 'getUrl', jmikola.AssetsHelper.prototype.getUrl);
goog.exportProperty(jmikola.AssetsHelper.prototype, 'getVersion', jmikola.AssetsHelper.prototype.getVersion);

window['AssetsHelper'] = jmikola.AssetsHelper.getInstance();
