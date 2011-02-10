<?php
/**
 * Services_Digg2Test 
 * 
 * PHP Version 5.2.0+
 * 
 * @uses      PHPUnit_Framework_TestCase
 * @category  Services
 * @package   Services_Digg2
 * @author    Bill Shupp <hostmaster@shupp.org> 
 * @copyright 2009 Digg, Inc.
 * @license   http://www.opensource.org/licenses/bsd-license.php FreeBSD
 * @link      http://github.com/digg/services_digg2
 */

require_once 'Services/Digg2.php';
require_once 'PHPUnit/Framework.php';
require_once 'HTTP/Request2.php';
require_once 'HTTP/Request2/Adapter/Mock.php';
require_once 'HTTP/OAuth/Consumer.php';

/**
 * Services_Digg2Test 
 * 
 * @uses      PHPUnit_Framework_TestCase
 * @category  Services
 * @package   Services_Digg2
 * @author    Bill Shupp <hostmaster@shupp.org> 
 * @copyright 2009 Digg, Inc.
 * @license   http://www.opensource.org/licenses/bsd-license.php FreeBSD
 * @link      http://github.com/digg/services_digg2
 */
class Services_Digg2Test extends PHPUnit_Framework_TestCase
{
    public $mockAdapter = null;
    public $http        = null;
    public $digg2       = null;

    /**
     * setUp 
     * 
     * @return void
     */
    public function setUp()
    {
        $this->http        = new HTTP_Request2;
        $this->mockAdapter = new HTTP_Request2_Adapter_Mock;
        $this->http->setAdapter($this->mockAdapter);
        $this->digg = new Services_Digg2;
        $this->digg->setURI('http://localhost');
        $this->digg->accept($this->http);
    }

    /**
     * tearDown 
     * 
     * @return void
     */
    public function tearDown()
    {
        $this->mockAdapter = null;
        $this->http        = null;
        $this->digg2       = null;
    }

    /**
     * testSetURIFailure 
     * 
     * @expectedException Services_Digg2_Exception
     * @return void
     */
    public function testSetURIFailure()
    {
        $this->digg->setURI('fubar');
    }

    /**
     * testSetAndGetURI 
     * 
     * @return void
     */
    public function testSetAndGetURI()
    {
        $uri = 'http://example.com';
        $this->digg->setURI($uri);
        $this->assertSame($uri, $this->digg->getURI());
    }

    /**
     * testGetHTTPRequest2 
     * 
     * @return void
     */
    public function testGetHTTPRequest2()
    {
        $this->assertSame($this->http, $this->digg->getHTTPRequest2());
        $digg =new Services_Digg2;
        $this->assertType('HTTP_Request2', $digg->getHTTPRequest2());
        $this->assertNotSame($this->http, $digg->getHTTPRequest2());
    }

    /**
     * testGetSetHTTPOAuthConsumer 
     * 
     * @return void
     */
    public function testGetSetHTTPOAuthConsumer()
    {
        $oauth = new HTTP_OAuth_Consumer('key', 'secret', 'token', 'token_secret');
        $this->digg->accept($oauth);
        $this->assertSame($oauth, $this->digg->getHTTPOAuthConsumer());
    }

    /**
     * testSetGetVersion 
     * 
     * @return void
     */
    public function testSetGetVersion()
    {
        $version = '1.0';
        $this->digg->setVersion('1.0');
        $this->assertSame($version, $this->digg->getVersion());
    }

    /**
     * testSetVersionFail 
     * 
     * @expectedException Services_Digg2_Exception
     * @return void
     */
    public function testSetVersionFail()
    {
        $this->digg->setVersion('fubar');
    }

    /**
     * testMagicGet 
     * 
     * @return void
     */
    public function testMagicGet()
    {
        $this->assertSame($this->digg, $this->digg->story);
    }

    /**
     * setResponseSuccess 
     * 
     * @return void
     */
    protected function setResponseSuccess()
    {
        $responseClass         = new stdClass;
        $responseClass->result = 'SUCCESS';

        $response  = "HTTP/1.1 200 OK";
        $response .= "Content-Type: text/json\n\n";
        $response .= json_encode($responseClass);
        $this->mockAdapter->addResponse($response);
    }

    /**
     * testMagicCall 
     * 
     * @return void
     */
    public function testMagicCall()
    {
        $this->setResponseSuccess();
        $result = $this->digg->story->getInfo(array('story_id' => 12345));
    }

    /**
     * testMagicCallFail 
     * 
     * @return void
     */
    public function testMagicCallFail()
    {
        $responseClass                 = new stdClass;
        $responseClass->error          = new stdClass;
        $responseClass->error->message = 'AUTH FAILURE';
        $responseClass->error->code    = 500;

        $response  = "HTTP/1.1 401 OK";
        $response .= "Content-Type: text/json\n\n";
        $response .= json_encode($responseClass);
        $this->mockAdapter->addResponse($response);

        try {
            $oauth = new HTTP_OAuth_Consumer('key',
                                             'secret',
                                             'token',
                                             'token_secret');
            $this->digg->accept($oauth);
            $result = $this->digg->story->getInfo();
        } catch (Services_Digg2_Exception $e) {
            $this->assertSame($e->getMessage(), $responseClass->error->message);
            $this->assertSame($e->getCode(), $responseClass->error->code);
            $this->assertSame($e->status, 401);
        }
    }

    /**
     * testSendOAuthRequest 
     * 
     * @return void
     */
    public function testSendOAuthRequest()
    {
        $this->setResponseSuccess();
        $oauth = new HTTP_OAuth_Consumer('key', 'secret', 'token', 'token_secret');
        $this->digg->accept($oauth);
        $result = $this->digg->story->getInfo();
    }

    /**
     * testAcceptFail 
     * 
     * @expectedException Services_Digg2_Exception
     * @return void
     */
    public function testAcceptFail()
    {
        $this->digg->accept(new stdClass);
    }

    /**
     * testParseResponseFail 
     * 
     * @expectedException Services_Digg2_Exception
     * @return void
     */
    public function testParseResponseFail()
    {
        $response  = "HTTP/1.1 401 OK";
        $response .= "Content-Type: text/html\n\n";
        $response .= "FUBAR";
        $this->mockAdapter->addResponse($response);
        $result = $this->digg->story->getInfo();
    }

    /**
     * testGetLastResponse 
     * 
     * @return void
     */
    public function testGetLastResponse()
    {
        $this->setResponseSuccess();
        $result = $this->digg->story->getInfo();
        $this->assertType('HTTP_Request2_Response', $this->digg->getLastResponse());
    }
}
?>
