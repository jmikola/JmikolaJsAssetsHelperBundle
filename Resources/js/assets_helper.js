goog.provide('jmikola.AssetsHelper');

goog.require('goog.array');
goog.require('goog.string.format');

/**
 * @constructor
 */
jmikola.AssetsHelper = function() {
    this.basePath_ = '/';
    this.defaultPackage_ = null;
    this.namedPackages_ = [];
};
goog.addSingletonGetter(jmikola.AssetsHelper);

/**
 * Create an appropriate package instance from a config object.
 *
 * @param {Object} config
 * @return {jmikola.AssetsHelper.Package}
 */
jmikola.AssetsHelper.prototype.createPackage_ = function(config) {
    if (config.hasOwnProperty('baseUrls')) {
        return new jmikola.AssetsHelper.UrlPackage(config.baseUrls, config.version, config.format);
    }
    if (config.hasOwnProperty('version')) {
        return new jmikola.AssetsHelper.PathPackage(this.basePath_, config.version, config.format);
    }
    return this.createPackage_(config['https:' === window.location.protocol ? 'ssl' : 'http']);
}

/**
 * @param {string} basePath               The base path to be prepended to relative paths
 * @param {Object} defaultPackageConfig   Default package configuration
 * @param {Array} namedPackageConfigs    Named package configurations by name
 */
jmikola.AssetsHelper.prototype.init = function(basePath, defaultPackageConfig, namedPackageConfigs) {
    this.basePath_ = basePath;
    this.defaultPackage_ = this.createPackage_(defaultPackageConfig);
    this.namedPackages_ = goog.array.map(namedPackageConfigs, function(v) { return jmikola.AssetsHelper.prototype.createPackage_(v);});
};

/**
 * Returns an asset package.
 *
 * @param {string=} opt_name The name of the package or null for the default package
 * @return {jmikola.AssetsHelper.Package} An asset package
 * @throws {jmikola.AssetsHelper.InvalidPackageError} If there is no package by that name
 */
jmikola.AssetsHelper.prototype.getPackage = function(opt_name) {
    if (undefined === opt_name || null === opt_name) {
        return this.defaultPackage_;
    }

    if (!this.namedPackages_.hasOwnProperty(opt_name)) {
        throw new jmikola.AssetsHelper.InvalidPackageError(opt_name);
    }

    return this.namedPackages_[opt_name];
};

/**
 * Returns the public path.
 *
 * Absolute paths (i.e. http://...) are returned unmodified.
 *
 * @param {string}    path            A public path
 * @param {string=}   opt_packageName The name of the asset package to use
 *
 * @return {string} A public path which takes into account the base path and URL path
 */
jmikola.AssetsHelper.prototype.getUrl = function(path, opt_packageName) {
    return this.getPackage(opt_packageName).getUrl(path);
};

/**
 * Gets the version to add to public URL.
 *
 * @param {string=} opt_packageName A package name
 * @return {string} The current version
 */
jmikola.AssetsHelper.prototype.getVersion = function(opt_packageName) {
   return this.getPackage(opt_packageName).getVersion();
};

/**
 * The basic package will add a version to asset URLs.
 *
 * @constructor
 * @param {string}    version     The package version
 * @param {string=}   opt_format  The format used to apply the version
 */
jmikola.AssetsHelper.Package = function(version, opt_format) {
    this.version_ = version;
    this.format_ = opt_format + '' || '%s?%s';
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

    var versionized = goog.string.format(this.format_, path.replace(/^\/+/, ''), this.version_);

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
    var url = jmikola.AssetsHelper.PathPackage.superClass_.getUrl.call(this, path);

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
           var $P = new PHP_JS();
           return this.baseUrls_[parseInt($P.md5(path).substring(0, 10), 16) % this.baseUrls_.length];
   }
};

/**
 * Custom error type for invalid package name references.
 *
 * @constructor
 * @param {string} name
 * @extends Error
 */
jmikola.AssetsHelper.InvalidPackageError = function(name) {
    this.name = "InvalidPackageError";
    this.message = 'There is no "' + name + '" asset package.';
}
goog.inherits(jmikola.AssetsHelper.InvalidPackageError, Error);

