<?php

namespace Jmikola\JsAssetsHelperBundle\DependencyInjection\Compiler;

use Jmikola\JsAssetsHelperBundle\Exception\InvalidArgumentException;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\DefinitionDecorator;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;

class ExtractPackageDefinitionsPass implements CompilerPassInterface
{
    /**
     * @see Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface::process()
     */
    public function process(ContainerBuilder $container)
    {
        $packages = array();

        foreach ($container->getParameter('jmikola_js_assets_helper.packages_to_expose') as $name) {
            $packages[$name] = $this->extractDefinition($container, 'templating.asset.package.'.$name);
        }

        $definition = $container->getDefinition('jmikola_js_assets_helper.controller');
        $definition->replaceArgument(1, $this->extractDefinition($container, 'templating.asset.default_package'));
        $definition->replaceArgument(2, $packages);
    }

    private function extractDefinition(ContainerBuilder $container, $name)
    {
        $definition = $container->getDefinition($name);

        if (!$definition instanceof DefinitionDecorator) {
            throw new InvalidArgumentException(sprintf('Definition for service "%s" is not a decorator', $name));
        }

        switch ($definition->getParent()) {
            case 'templating.asset.path_package':
                return array(
                    'version' => $definition->getArgument(1),
                    'format'  => $definition->getArgument(2),
                );

            case 'templating.asset.url_package':
                return array(
                    'baseUrls' => $definition->getArgument(0),
                    'version'  => $definition->getArgument(1),
                    'format'   => $definition->getArgument(2),
                );

            case 'templating.asset.request_aware_package':
                return array(
                    'http' => $this->extractDefinition($container, $name.'.http'),
                    'ssl'  => $this->extractDefinition($container, $name.'.ssl'),
                );
        }

        throw new InvalidArgumentException(sprintf('Definition for service "%s" does decorates "%s", which is not a asset package service', $name, $definition->getParent()));
    }
}
