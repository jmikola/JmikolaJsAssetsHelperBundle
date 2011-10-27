var AssetHelper = AssetHelper || {};

(function(AssetHelper, $, $P) {
    /* Simple JavaScript Inheritance
     * By John Resig http://ejohn.org/
     * MIT Licensed.
     */
    // Inspired by base2 and Prototype
    (function(){
        var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

        // The base Class implementation (does nothing)
        this.Class = function(){};

        // Create a new Class that inherits from this class
        Class.extend = function(prop) {
            var _super = this.prototype;

            // Instantiate a base class (but only create the instance,
            // don't run the init constructor)
            initializing = true;
            var prototype = new this();
            initializing = false;

            // Copy the properties over onto the new prototype
            for (var name in prop) {
                // Check if we're overwriting an existing function
                prototype[name] = typeof prop[name] == "function" &&
                    typeof _super[name] == "function" && fnTest.test(prop[name]) ?
                    (function(name, fn){
                        return function() {
                            var tmp = this._super;

                            // Add a new ._super() method that is the same method
                            // but on the super-class
                            this._super = _super[name];

                            // The method only need to be bound temporarily, so we
                            // remove it when we're done executing
                            var ret = fn.apply(this, arguments);
                            this._super = tmp;

                            return ret;
                        };
                    })(name, prop[name]) :
                    prop[name];
            }

            // The dummy class constructor
            function Class() {
                // All construction is actually done in the init method
                if ( !initializing && this.init )
                    this.init.apply(this, arguments);
            }

            // Populate our constructed prototype object
            Class.prototype = prototype;

            // Enforce the constructor to be what we expect
            Class.prototype.constructor = Class;

            // And make this class extendable
            Class.extend = arguments.callee;

            return Class;
        };
    })();

    /**
     * The basic package will add a version to asset URLs.
     */
    var Package = Class.extend({
        /**
         * Constructor.
         *
         * @param string version The package version
         * @param string format  The format used to apply the version
         */
        init: function(version, format) {
            this.version = version;
            this.format = format;
        },
        /**
         * Applies version to the supplied path.
         *
         * @param string path A path
         * @return string The versionized path
         */
        applyVersion: function(path) {
            if (null === this.version) {
                return path;
            }

            var versionized = $P.sprintf(this.format, path.replace(/^\/+/, ''), this.version);

            if (path && '/' === path.charAt(0)) {
                versionized = '/' + versionized;
            }

            return versionized;
        },
        /**
         * Returns an absolute or root-relative public path.
         *
         * @param string path A path
         * @return string The public path
         */
        getUrl: function(path) {
            if (-1 !== path.indexOf('://') || 0 === path.indexOf('//')) {
                return path;
            }

            return this.applyVersion(path);
        },
        /**
         * Returns the asset package version.
         *
         * @return string The version string
         */
        getVersion: function() {
            return this.version;
        }
    });

    /**
     * The path package adds a version and a base path to asset URLs.
     */
    var PathPackage = Package.extend({
        /**
         * Constructor.
         *
         * @param string basePath The base path to be prepended to relative paths
         * @param string version  The package version
         * @param string format   The format used to apply the version
         */
        init: function(basePath, version, format) {
            this._super(version, format);

            if (!basePath) {
                this.basePath = '/';
            } else {
                if ('/' !== basePath.charAt(0)) {
                    basePath = '/' + basePath;
                }

                this.basePath = basePath.replace(/\/+$/, '') + '/';
            }
        },
        /**
         * Returns an absolute or root-relative public path.
         *
         * @param string path A path
         * @return string The public path
         */
        getUrl: function(path) {
            var url = this._super(path);

            if (url && '/' !== url.charAt(0)) {
                url = this.basePath + url;
            }

            return url;
        }
    });

    /**
     * The URL package adds a version and a base URL to asset URLs.
     */
    var UrlPackage = Package.extend({
        /**
         * Constructor.
         *
         * @param string|array baseUrls Base asset URLs
         * @param string       version  The package version
         * @param string       format   The format used to apply the version
         */
        init: function(baseUrls, version, format) {
            this._super(version, format);

            baseUrls = baseUrls || [];

            if (!$.isArray(baseUrls)) {
                baseUrls = [baseUrls];
            }

            this.baseUrls = $.map(baseUrls, function(baseUrl) {
                return baseUrl.replace(/\/+$/, '');
            });
        },
        /**
         * Returns an absolute or root-relative public path.
         *
         * @param string path A path
         * @return string The public path
         */
        getUrl: function(path) {
            var url = this._super(path);

            if (url && '/' !== url.charAt(0)) {
                url = '/' + url;
            }

            return this.getBaseUrl(path) + url;
        },
        /**
         * Returns the base URL for a path.
         *
         * @param string path A path
         * @return string The base URL
         */
       getBaseUrl: function(path) {
           switch (this.baseUrls.length) {
               case 0:
                   return '';
               case 1:
                   return this.baseUrls[0];
               default:
                   return this.baseUrls[parseInt($P.md5(path).substring(0, 10), 16) % this.baseUrls.length];
           }
       }
    });

    /**
     * Custom error type for invalid package name references.
     */
    function InvalidPackageError(name) {
        this.name = "InvalidPackageError";  
        this.message = 'There is no "' + name + '" asset package.';  
    }
    InvalidPackageError.prototype = new Error();  
    InvalidPackageError.prototype.constructor = InvalidPackageError;

    var _basePath = '', _defaultPackage, _namedPackages = {};

    /**
     * Create an appropriate package instance from a config object.
     *
     * @param object config
     * @returns Package
     */
    function createPackage(config) {
        if (config.hasOwnProperty('baseUrls')) {
            return new UrlPackage(config.baseUrls, config.version, config.format);
        } else if (config.hasOwnProperty('version')) {
            return new PathPackage(_basePath, config.version, config.format);
        } else {
            return createPackage(config['https:' === window.location.protocol ? 'ssl' : 'http']);
        }
    }

    $.extend(AssetHelper, {
        /**
         * Constructor.
         *
         * @param string basePath       The base path to be prepended to relative paths
         * @param object defaultPackage Default package configuration
         * @param object namedPackage   Named package configurations by name
         */
        init: function(basePath, defaultPackageConfig, namedPackageConfigs) {
            _basePath = basePath;
            _defaultPackage = createPackage(defaultPackageConfig);
            _namedPackages = $.map(namedPackageConfigs, createPackage);
        },
        /**
         * Returns an asset package.
         *
         * @param string name The name of the package or null for the default package
         * @return Package An asset package
         * @throws InvalidPackageError If there is no package by that name
         */
        getPackage: function(name) {
            if (undefined === name || null === name) {
                return _defaultPackage;
            }

            if (!_namedPackages.hasOwnProperty(name)) {
                throw new InvalidPackageError(name);
            }

            return _namedPackages[name];
        },
        /**
         * Returns the public path.
         *
         * Absolute paths (i.e. http://...) are returned unmodified.
         *
         * @param string path        A public path
         * @param string packageName The name of the asset package to use
         *
         * @return string A public path which takes into account the base path and URL path
         */
        getUrl: function(path, packageName) {
            return this.getPackage(packageName).getUrl(path);
        },
        /**
         * Gets the version to add to public URL.
         *
         * @param string packageName A package name
         * @return string The current version
         */
        getVersion: function(packageName) {
           return this.getPackage(packageName).getVersion();
        }
    });
}(AssetHelper, jQuery, new PHP_JS()));
