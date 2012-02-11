<?php

namespace Jmikola\JsAssetsHelperBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Templating\EngineInterface;
use Symfony\Component\HttpFoundation\Request;

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
        $this->namedPackages = $namedPackages;
    }

    public function indexAction(Request $request)
    {
        return $this->engine->renderResponse('JmikolaJsAssetsHelperBundle::index.'.$request->getRequestFormat().'.twig', array(
            'basePath'       => $request->getBasePath(),
            'defaultPackage' => $this->defaultPackage,
            'namedPackages'  => $this->namedPackages,
        ));
    }
}
