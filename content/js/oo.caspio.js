(function(oo, $, undefined) {
    (function(caspio) {
        caspio.init = function() {
            //caspio.addCSS(oo.WebsiteServer() + oo.WebsitePlatform() + "/content/css/font-awesome.min.css");
            $(function() {

            });
        };

        caspio.setupGroupedHeadingTables = function() {
            oo.log("oo.caspio.setupGroupedHeadingTables: starting..");
            var myGroupedTables = $('.oo_subContent-tableGrouped table').add('.oo_content-tableGrouped table');
            myGroupedTables.each(function () {
                var myTable = $(this),
                    myHeadings = [];
                myTable.find('tr:first-child th').each(function () {
                    myHeadings.push($(this).text());
                });
                oo.log("found these headings: " + myHeadings.join(","));
                myTable.find('tr td').each(function () {
                    $(this).attr('data-heading', myHeadings[($(this).index())]);
                });
            });
            oo.log("oo.caspio.setupGroupedHeadingTables: finished");
        };

        caspio.addCSS = function(cssUrl) {
            var head = $(document).find('head'),
                element = $('<link />');

            link.attr("type", 'text/css');
            link.attr("rel", 'stylesheet');
            link.attr("href", cssUrl);

            link.appendTo(head);
        };

    }(oo.caspio = oo.caspio || {}));
}(window.oo = window.oo || {}, jQuery));


// oo.shared.base.js

(function(oo, $, undefined) {
    var _options = {},
        _defaultOptions = {
            debugMode:              true,
            pagePrefix:             "ef404",
            protocol:               "https://",
            websiteDomain:          "files.insolitusglobal.com",
            websitePlatform:        "/oo/dev",
            serverDomain:           "c0amf816.caspio.com"
        };

    oo.init = function(options) {
        if (typeof options != "undefined") {
            _options = $.extend({}, _defaultOptions, options);
        }
        $.extend(true, _options, {
            websiteServer: (_options.protocol + _options.websiteDomain),
            caspioServer: (_options.protocol + _options.serverDomain)
        });
        oo.log("oo.init: Initialised with " + JSON.stringify(_options));
    };

    oo.debugMode = function() {
        return _options.debugMode;
    };
    oo.log = function(msg) {
        if (_options.debugMode) {
            console.log(msg);
        }
    };
    oo.Protocol = function() {
        return (_options.protocol);
    };
    oo.WebsiteName = function() {
        return (_options.websiteDomain);
    };
    oo.ServerName = function() {
        return (_options.serverDomain);
    };
    oo.CaspioServer = function() {
        return (_options.caspioServer);
    };
    oo.WebsiteServer = function() {
        return (_options.websiteServer);
    };
    oo.WebsitePlatform = function() {
        return (_options.websitePlatform);
    };
    oo.PagePrefix = function() {
        return (_options.pagePrefix);
    };
    oo.PageKey =  function(pageName) {
        return ((typeof _pages[pageName] != "undefined") ? _pages[pageName].pageKey : "");
    };
    oo.PageHeading = function(pageName) {
        return ((typeof _pages[pageName] != "undefined") ? _pages[pageName].heading : "");
    };
    oo.PageCSS = function(pageName) {
        return ((typeof _pages[pageName] != "undefined") ? _pages[pageName].css : "");
    };
    oo.AppKey = function(pageKey) {
        return (_options.pagePrefix + "000" + oo.PageKey(pageKey));
    };
    oo.DataPageUrl = function(pageKey) {
        return (oo.Protocol() + oo.ServerName() + "/dp.asp?AppKey=" + oo.AppKey(pageKey));
    };

}(window.oo = window.oo || {}, jQuery));


// oo.shared.config.js

(function(oo) {
    /* Use this configuration for Turtle-Dev environment..

    oo.init({
        debugMode:              true,
        pagePrefix:             "ef404",
        websitePlatform:        "/turtle-dev",
        serverDomain:           "c0amf816.caspio.com"
    });
     */

    /* Use this configuration for Dev environment..*/
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


// oo.shared.common.js
(function(oo, $, undefined) {
    (function(common) {
        var _planType = "",
            _topBarHeight = 0,
            _colors = {
                blue2:              "#279dd9",
                blue1:              "#1084bf",
                orange1:            "#f2b90b",
                red1:               "#c70000",
                grey9:              "#454545",
                grey7:              "#949494",
                grey6:              "#a7a7a7",
                grey4:              "#c7c7c7",
                purple2:            "#232a52"
            },
            _colorHash = {
                "text":             "grey9",
                "text-dehighlight": "grey7",
                "priority-low":     "blue2",
                "priority-medium":  "orange1",
                "priority-high":    "red1"
            };

        common.getColor = function(colorName) {
            if (typeof _colors[colorName] != "undefined") {
                return (_colors[colorName]);
            } else {
                oo.log("oo.common.getColor: could not find colour for colorName = " + colorName);
            }
        };
        common.getColorByKey = function(colorKey) {
            return (common.getColor(_colorHash[colorKey]));
        };
        common.getParameterByName = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        };
        common.getPlanType = function() {
            if (_planType === "") {
                _planType = common.getParameterByName('PlanType').toLowerCase();
            }
            return _planType;
        };
        common.getUrlVars = function() {
            var vars = [],
                hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        common.getUrl = function(pageName) {
            return oo.WebsiteServer() + oo.WebsitePlatform() + "/" + pageName + ".shtml?PlanType=" + common.getPlanType().toUpperCase();
        };
        common.goBack = function() {
            window.history.go(-1);
        };
        common.gotoPage = function(pageName, params) {
            var paramStr = "",
                myKey;
            if (typeof params != "undefined") {
                // build uri parameters..
                for (myKey in params) {
                    paramStr += "&" + encodeURIComponent(myKey) + "=" + encodeURIComponent(params[myKey]);
                }
            }
            window.top.location.href = common.getUrl(pageName) + paramStr;
        };
        common.getCurrentPageName = function() {
            var myPath = window.top.location.pathname,
                myPage = /\/([a-zA-Z0-9\-_]+).shtml/.exec(myPath);
            if (myPage != null) {
                return myPage[1];
            } else {
                return "";
            }
        };
        common.getCurrentProjectId = function() {
            return common.getParameterByName('ProjectID');
        };
        common.scrollTo = function(hashId) {
            if (_topBarHeight === 0) _topBarHeight = $('#oo_js_topBar').height();
            $('html, body').animate({
                scrollTop: $(hashId).offset().top - _topBarHeight
            }, 1000);
        };
        common.escape = function(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };
        common.sortBy = function(key, reverse) {

            // Move smaller items towards the front
            // or back of the array depending on if
            // we want to sort the array in reverse
            // order or not.
            var moveSmaller = reverse ? 1 : -1;

            // Move larger items towards the front
            // or back of the array depending on if
            // we want to sort the array in reverse
            // order or not.
            var moveLarger = reverse ? -1 : 1;

            /**
             * @param  {*} a
             * @param  {*} b
             * @return {Number}
             */
            return function(a, b) {
                if (a[key] < b[key]) {
                    return moveSmaller;
                }
                if (a[key] > b[key]) {
                    return moveLarger;
                }
                return 0;
            };
        };

    }(oo.common = oo.common || {}));
}(window.oo = window.oo || {}, jQuery));
