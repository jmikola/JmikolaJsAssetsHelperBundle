goog.provide('jmikola.AssetsHelper.Package');
goog.provide('jmikola.AssetsHelper.PathPackage');
goog.provide('jmikola.AssetsHelper.UrlPackage');

goog.require('goog.array');
goog.require('PHP_JS.sprintf');
goog.require('PHP_JS.md5');

/**
 * The basic package will add a version to asset URLs.
 *
 * @constructor
 * @param {string}    version     The package version
 * @param {string=}   opt_format  The format used to apply the version
 */
jmikola.AssetsHelper.Package = function(version, opt_format) {
    this.version_ = version;
    this.format_ = (opt_format || '%s?%s') + '';
};

/**
 * Applies version to the supplied path.
 *
 * @param {string} path A path
 * @return {string} The versionized path
 */
jmikola.AssetsHelper.Package.prototype.applyVersion = function(path) {
    if (null === this.version_) {
        return path;
    }

    var versionized = PHP_JS.sprintf(this.format_, path.replace(/^\/+/, ''), this.version_);

    if (path && '/' === path.charAt(0)) {
        versionized = '/' + versionized;
    }

    return versionized;
};

/**
 * Returns an absolute or root-relative public path.
 *
 * @param {string} path A path
 * @return {string} The public path
 */
jmikola.AssetsHelper.Package.prototype.getUrl = function(path) {
    if (-1 !== path.indexOf('://') || 0 === path.indexOf('//')) {
        return path;
    }

    return this.applyVersion(path);
};

/**
 * Returns the asset package version.
 *
 * @return {string} The version string
 */
jmikola.AssetsHelper.Package.prototype.getVersion = function() {
    return this.version_;
};

/**
 * The path package adds a version and a base path to asset URLs.
 *
 * @constructor
 * @param {string}    basePath    The base path to be prepended to relative paths
 * @param {string}    version     The package version
 * @param {string=}   opt_format  The format used to apply the version
 * @extends jmikola.AssetsHelper.Package
 */
jmikola.AssetsHelper.PathPackage = function(basePath, version, opt_format) {
    jmikola.AssetsHelper.Package.call(this, version,opt_format);

    if (!basePath) {
        this.basePath_ = '/';
    } else {
        if ('/' !== basePath.charAt(0)) {
            basePath = '/' + basePath;
        }

        this.basePath_ = basePath.replace(/\/+$/, '') + '/';
    }
};
goog.inherits(jmikola.AssetsHelper.PathPackage, jmikola.AssetsHelper.Package);

/**
 * Returns an absolute or root-relative public path.
 *
 * @param {string} path A path
 * @return {string} The public path
 */
jmikola.AssetsHelper.PathPackage.prototype.getUrl = function(path) {
    var url = jmikola.AssetsHelper.PathPackage.superClass_.getUrl.call(this, path);

    if (url && '/' !== url.charAt(0)) {
        url = this.basePath_ + url;
    }

    return url;
};

/**
 * The URL package adds a version and a base URL to asset URLs.
 *
 * @constructor
 * @param {string|Array} baseUrls     Base asset URLs
 * @param {string}       version      The package version
 * @param {string=}      opt_format   The format used to apply the version
 * @extends jmikola.AssetsHelper.Package
 */
jmikola.AssetsHelper.UrlPackage = function(baseUrls, version, opt_format) {
    jmikola.AssetsHelper.Package.call(this, version,opt_format);

    baseUrls = baseUrls || [];

    if (!goog.isArray(baseUrls)) {
        baseUrls = [baseUrls];
    }

    this.baseUrls_ = goog.array.map(baseUrls, function(baseUrl) {
        return baseUrl.replace(/\/+$/, '');
    });
};
goog.inherits(jmikola.AssetsHelper.UrlPackage, jmikola.AssetsHelper.Package);

/**
 * Returns an absolute or root-relative public path.
 *
 * @param {string} path A path
 * @return {string} The public path
 */
jmikola.AssetsHelper.UrlPackage.prototype.getUrl = function(path) {
    var url = jmikola.AssetsHelper.UrlPackage.superClass_.getUrl.call(this, path);

    if (url && '/' !== url.charAt(0)) {
        url = '/' + url;
    }

    return this.getBaseUrl_(path) + url;
};
/**
 * Returns the base URL for a path.
 *
 * @param {string} path A path
 * @return {string} The base URL
 */
jmikola.AssetsHelper.UrlPackage.prototype.getBaseUrl_ = function(path) {
   switch (this.baseUrls_.length) {
       case 0:
           return '';
       case 1:
           return this.baseUrls_[0];
       default:
           return this.baseUrls_[parseInt(PHP_JS.md5(path).substring(0, 10), 16) % this.baseUrls_.length];
   }
};
