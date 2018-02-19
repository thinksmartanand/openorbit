
/* Open Orbit
** Website - Configuration
** This Initialises the OO object specific to the deployed environment.
** Uncomment the specific environment's configuration below.
*/

(function(oo) {
    /* Use this configuration for Turtle-Dev environment..

    oo.init({
        debugMode:              true,
        pagePrefix:             "ef404",
        websitePlatform:        "/turtle-dev",
        serverDomain:           "c0amf816.caspio.com"
    });
     */

    /* Use this configuration for Dev environment..
     */
    oo.init({
     debugMode:              true,
     pagePrefix:             "ef404",
     websitePlatform:        "/oo/dev",
     serverDomain:           "c0amf816.caspio.com"
     });


    /* Use this configuration for QA environment..
     oo.init({
         debugMode:              false,
         pagePrefix:             "ff404",
         websitePlatform:        "/oo/qa",
         serverDomain:           "c0eru863.caspio.com"
     });
     */

    /* Use this configuration for Production environment..
     oo.init({
         debugMode:              false,
         pagePrefix:             "c22e3",
         websitePlatform:        "/oo/prod",
         serverDomain:           "c0ect399.caspio.com"
     });
     */

    oo.log("oo.init: Environment configured.");
}(window.oo = window.oo || {}));
