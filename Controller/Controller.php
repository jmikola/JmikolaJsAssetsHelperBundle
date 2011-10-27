<?php

namespace Jmikola\JsAssetPackageBundle\Controller;

use Symfony\Component\HttpFoundation\Request;

use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\Response;

class Controller
{
    private $engine;
    private $defaultPackage;
    private $namedPackages;

    /**
     * Constructor.
     *
     * @param EngineInterface $engine
     * @param array           $defaultPackage
     * @param array           $namedPackages
     */
    public function __construct(EngineInterface $engine, array $defaultPackage, array $namedPackages = array())
    {
        $this->engine = $engine;
        $this->defaultPackage = $defaultPackage;
        $this->namedPackages = $namedPackage;
    }

    public function indexAction(Request $request)
    {
        return $this->engine->renderResponse('JmikolaJsAssetPackageBundle::index.'.$request->getRequestFormat().'.twig', array(
            'basePath'       => $request->getBasePath(),
            'defaultPackage' => $this->defaultPackage,
            'namedPackages'  => $this->namedPackages,
        ));
    }
}
