/**
 * @fileoverview This file is the entry point for the compiler.
 *
 * You can compile this script by running (assuming you have JMSGoogleClosureBundle installed):
 *
 *    php app/console plovr:build @JmikolaJsAssetPackageBundle/compile.js
 */

goog.require('jmikola.AssetHelper');

goog.exportSymbol('jmikola.AssetHelper', jmikola.AssetHelper);
goog.exportProperty(jmikola.AssetHelper, 'getInstance', jmikola.AssetHelper.getInstance);
goog.exportProperty(jmikola.AssetHelper.prototype, 'init', jmikola.AssetHelper.prototype.init);
goog.exportProperty(jmikola.AssetHelper.prototype, 'getUrl', jmikola.AssetHelper.prototype.getUrl);
goog.exportProperty(jmikola.AssetHelper.prototype, 'getVersion', jmikola.AssetHelper.prototype.getVersion);
goog.exportProperty(jmikola.AssetHelper.prototype, 'getPackage', jmikola.AssetHelper.prototype.getPackage);

window['AssetHelper'] = jmikola.AssetHelper.getInstance();
