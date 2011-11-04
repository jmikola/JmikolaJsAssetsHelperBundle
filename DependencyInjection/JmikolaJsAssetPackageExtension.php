<?php

namespace Jmikola\JsAssetsHelperBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;

class JmikolaJsAssetsHelperExtension extends Extension
{
    /**
     * @see Symfony\Component\DependencyInjection\Extension\ExtensionInterface::load()
     */
    public function load(array $configs, ContainerBuilder $container)
    {
        $loader = new XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));
        $loader->load('controllers.xml');

        $processor = new Processor();
        $configuration = new Configuration();
        $config = $processor->processConfiguration($configuration, $configs);

        $container->setParameter('jmikola_js_asset_package.packages_to_expose', $config['packages_to_expose']);
    }
}
