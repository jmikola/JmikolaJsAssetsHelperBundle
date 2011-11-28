/**
 * @fileoverview This file is the entry point for the compiler.
 *
 * You can compile this script by running (assuming you have JMSGoogleClosureBundle installed):
 *
 *    php app/console plovr:build @JmikolaJsAssetsHelperBundle/compile.js
 */

goog.require('jmikola.AssetsHelper.Helper');

goog.exportSymbol('jmikola.AssetsHelper.Helper', jmikola.AssetsHelper.Helper);
goog.exportProperty(jmikola.AssetsHelper.Helper, 'getInstance', jmikola.AssetsHelper.Helper.getInstance);
goog.exportProperty(jmikola.AssetsHelper.Helper.prototype, 'init', jmikola.AssetsHelper.Helper.prototype.init);
goog.exportProperty(jmikola.AssetsHelper.Helper.prototype, 'getUrl', jmikola.AssetsHelper.Helper.prototype.getUrl);
goog.exportProperty(jmikola.AssetsHelper.Helper.prototype, 'getVersion', jmikola.AssetsHelper.Helper.prototype.getVersion);

window['AssetsHelper'] = jmikola.AssetsHelper.Helper.getInstance();
