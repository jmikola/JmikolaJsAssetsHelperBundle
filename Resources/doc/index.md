# JmikolaJsAssetsHelperBundle

This bundle exposes the Symfony2 asset helper to JavaScript, which allows
relative or absolute asset URI's to be generated client-side.

## Installation

### Submodule Creation

Add JmikolaJsAssetsHelperBundle to your `vendor/` directory:

``` bash
$ git submodule add https://github.com/jmikola/JmikolaJsAssetsHelperBundle.git vendor/bundles/Jmikola/JsAssetsHelperBundle
```

### Class Autoloading

Register the "Jmikola" namespace prefix in your project's `autoload.php`:

``` php
# app/autoload.php

$loader->registerNamespaces(array(
    'Jmikola' => __DIR__'/../vendor/bundles',
));
```

### Application Kernel

Add JmikolaJsAssetsHelperBundle to the `registerBundles()` method of your
application kernel.

``` php
# app/AppKernel.php

public function registerBundles()
{
    return array(
        new Jmikola\JsAssetsHelperBundle\JmikolaJsAssetsHelperBundle(),
    );
}
```

## Configuration

If you do not configure the bundle explicitly, it will only expose the default
package defined in the `templating' block of the FrameworkBundle configuration.

Named packages you wish to expose must be explicitly listed:

```yml
jmikola_js_assets_helper:
    packages_to_expose: [ cloudfront, s3 ]
```

While an array of package names is the normal format, the configuration will
also accept a scalar to expose a single package:

```yml
jmikola_js_assets_helper:
    packages_to_expose: cloudfront
```

In these examples, "cloudfront" and "s3" correspond to named packages in the
FrameworkBundle configuration. For example:

```yml
framework:
    templating:
        # The default package will be a PathPackage
        assets_version:        123
        assets_version_format: "%%s?version=%%s"
        packages:
            # The cloudfront package will be a UrlPackage
            cloudfront:
                version:        123
                version_format: "%%s?version=%%s"
                base_urls:      https://example.cloudfront.net
```

Additional information on configuring templating asset packages may be found in
the [FrameworkBundle docs][].

### Routing

The bundle defines one route to a dynamically generated JavaScript file. Ensure
this route is including in your application's routing configuration: 

```yml
jmikola_js_assets_helper:
    resource: "@JmikolaJsAssetsHelperBundle/Resources/config/routing/routing.xml"
```

### Assets

The bundle's static assets must be published to your `web/` directory:

```bash
$ php app/console assets:install --symlink web
```

Include the static assets and dynamic JavaScript in your applications template:

```jinja
<script src="{{ asset('bundles/jmikolajsAssetsHelper/js/phpjs.namespaced.min.js') }}"></script>
<script src="{{ asset('bundles/jmikolajsAssetsHelper/js/assets_helper.js') }}"></script>
<script src="{{ path('jmikola_js_assets_helper_js') }}"></script>
```

If you are using [Assetic][], you may prefer to pack the static assets first:

```jinja
{% javascripts
    '@JmikolaJsAssetsHelperBundle/Resources/public/js/phpjs.namespaced.min.js'
    '@JmikolaJsAssetsHelperBundle/Resources/public/js/assets_helper.js'
    filter="?yui_js" output="js/jmikolajsAssetsHelper.min.js" %}
    <script src="{{ asset_url }}"></script>
{% endjavascripts %}

<script src="{{ path('jmikola_js_assets_helper_js') }}"></script>
```

## Usage

Once configured, the bundle creates a single `AssetsHelper` global in JavaScript.
This is modeled after the PHP class from Symfony2's Templating component and
has the following methods:

```js
/**
 * Returns an asset package.
 *
 * @param string name The name of the package or null for the default package
 * @return Package An asset package
 * @throws InvalidPackageError If there is no package by that name
 */
function getPackage(name);

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
function getUrl(path, packageName);

/**
 * Gets the version to add to public URL.
 *
 * @param string packageName A package name
 * @return string The current version
 */
function getVersion(packageName);
```

Typically, you will want to use the `getUrl()` method to generate asset paths.
Keep in mind that if you refer to a named package that has not been exposed, an
`InvalidPackageError` will be thrown.

The following equivalent snippets demonstrate how `AssetsHelper.getUrl()`
compares to Symfony2's asset helper for Twig: 

```js
'<img src="' + AssetsHelper.getUrl('/images/logo.png') + '">';
```

```jinja
<img src="{{ asset('/images/logo.png') }}">
```

  [FrameworkBundle docs]: http://symfony.com/doc/current/reference/configuration/framework.html#templating
  [Assetic]: https://github.com/kriswallsmith/assetic
  [Symfony2 API]: http://api.symfony.com/2.0/
