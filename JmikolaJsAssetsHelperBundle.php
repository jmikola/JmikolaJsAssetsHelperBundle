<?php

namespace Jmikola\JsAssetsHelperBundle;

use Jmikola\JsAssetsHelperBundle\DependencyInjection\Compiler\ExtractPackageDefinitionsPass;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Bundle\Bundle;

class JmikolaJsAssetsHelperBundle extends Bundle
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
