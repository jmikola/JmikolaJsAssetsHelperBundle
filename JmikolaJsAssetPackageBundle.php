<?php

namespace Jmikola\JsAssetPackageBundle;

use Jmikola\JsAssetPackageBundle\DependencyInjection\Compiler\ExtractPackageDefinitionsPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class JmikolaJsAssetPackageBundle extends Bundle
{
    /**
     * @see Symfony\Component\HttpKernel\Bundle\Bundle::build()
     */
    public function build(ContainerBuilder $container)
    {
        parent::build($container);

        $container->addCompilerPass(new ExtractPackageDefinitionsPass());
    }
}
