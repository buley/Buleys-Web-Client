<?php
/**
 * Services_Digg2_AllTests
 * 
 * PHP Version 5.2.0+
 * 
 * @category  Services
 * @package   Services_Digg2
 * @author    Bill Shupp <hostmaster@shupp.org> 
 * @copyright 2009 Digg, Inc.
 * @license   http://www.opensource.org/licenses/bsd-license.php FreeBSD
 * @link      http://github.com/digg/Services_Digg2
 */

require_once 'PHPUnit/Framework.php';
require_once 'Services/Digg2Test.php';

/**
 * All tests for Services_Digg2
 * 
 * @category  Services
 * @package   Services_Digg2
 * @author    Bill Shupp <hostmaster@shupp.org> 
 * @copyright 2009 Digg, Inc.
 * @license   http://www.opensource.org/licenses/bsd-license.php FreeBSD
 * @link      http://github.com/digg/Services_Digg2
 */
class OpenID_AllTests
{
    /**
     * suite 
     * 
     * @return PHPUnit_Framework_TestSuite
     */
    static public function suite()
    {
        $suite = new PHPUnit_Framework_TestSuite('Services_Digg2 Unit Test Suite');
        $suite->addTestSuite('Services_Digg2Test');
        return $suite;
    }
}

?>
