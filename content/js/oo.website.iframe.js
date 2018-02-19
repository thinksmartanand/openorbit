(function(oo, $, undefined) {
    (function(iframe) {
        // private properties..
        var _iframes = [],
            _archivedIframes = [],
            _iframeClass = "oo_content-iframe",
            _iframeIdPrefix = "oo_iframe-",
            _iframePlaceholderPrefix = "oo_placeholder-";

        // public methods..
        iframe.init = function() {
            oo.log("oo.iframe.init: initialising all iframes..");
            _iframes = $('iframe');
            //iframe.archiveAll();  //TODO: re-activate archiving of iframes after phase 1 release.
            $('.oo_content-iframe, .oo_subContent-iframe').each(function() {
                oo.iframe.load($(this));
            });
            oo.iframe.setupResizer();
            oo.log("oo.iframe.init: finished initialising all iframes..");
        };
        iframe.archiveAll = function() {
            oo.log("oo.iframe.archiveAll: Archiving all hidden iframes..");
            _iframes = iframe.archive(_iframes);
        };
        iframe.archive = function(iframes) {
            var _hiddenIframes = iframes.find(':hidden');
            _hiddenIframes.each(function(i) {
                var myId = $(this).attr("id");
                oo.log("oo.iframe.archive: archiving iframe - " + myId);
                var placeholder = $("<span></span>");
                placeholder.attr("id", _iframePlaceholderPrefix + myId);
                placeholder.before($(this));
                var myHiddenIframe = $(this).remove();
                _archivedIframes.push(myHiddenIframe);
                iframes.splice(i,1);
            });
            oo.log("oo.iframe.archive: finished archiving all hidden frames.");
            return iframes;
        };
        iframe.addToPage = function(iframeObj, wrapperObj) {
            var placeholder;
            if (placeholder = $('#' + _iframePlaceholderPrefix + iframeObj.attr("id"))) {
                oo.log("oo.iframe.addToPage: adding iframe to placeholder location - " + $(this).attr("id"));
                iframeObj.after(placeholder);
            } else {
                if (typeof wrapperObj != "undefined") {
                    wrapperObj.append(iframeObj);
                    oo.log("oo.iframe.addToPage: added iframe into wrapping object/container - " + $(this).attr("id"));
                } else {
                    oo.log("oo.iframe.addToPage: Could not add iframe to page - " + $(this).attr("id"));
                }
            }
        };

        (function(resizer) {
            var _defaultOptions = {
                log:                        oo.debugMode(),
                enablePublicMethods:        true,
                autoResize:                 true,
                checkOrigin:                [oo.WebsiteServer(), oo.CaspioServer()],
                minHeight:                  200,
                resizeFrom:                 'child'
            };
            // public methods..
            resizer.init = function(options) {
                // use this init when there is no parent window, but a it has a child iframe..
                var settings = $.extend({}, _defaultOptions, options);
                oo.log("oo.iframe.resizer.init: resizer configured with settings = " + settings);
                iFrameResize(settings);
                oo.log("oo.iframe.resizer.init: finished init");
            };
        }(iframe.resizer = iframe.resizer || {}));

        iframe.setupResizer = function() {
            // this method is kept only for old implementations..
            // new implementations should use oo.iframe.resizer.init() instead.
            // TODO: remove this method once no references exist.
            oo.log("oo.iframe.setupResizer: Setting up iFrameResizer..");
            iframe.resizer.init();
        };
        iframe.load = function(iframeObj) {
            var src = "",
                pageName = "",
                pageParams = "",
                pageParamsArray = [];
            oo.log("oo.iframe.load: attempting to load iframeObj = " + iframeObj.attr("id"));
            if (typeof iframeObj.attr("src") != "undefined" && iframeObj.attr("src") !== "") {
                oo.log("oo.iframe.load: Can not load iframeObj that already has a value in its src attribute = " + iframeObj.attr("src"));
                return false;
            }
            if (typeof iframeObj.attr("data-pageKey") != "undefined") {
                pageName = iframeObj.attr("data-pageKey");
                src += oo.DataPageUrl(pageName);
            } else {
                oo.log("oo.iframe.load: no data-pageKey attribute on iframe: " + iframeObj.attr("id"));
            }
            if (typeof iframeObj.attr("data-pageParams") != "undefined") {
                oo.log("oo.iframe.load: data-pageParams attribute found on iframe: " + iframeObj.attr("id"));
                pageParams = iframeObj.attr("data-pageParams");
                pageParamsArray = pageParams.split(",");
                for(var i=0; i < pageParamsArray.length; i++) {
                    oo.log("oo.iframe.load: adding pageParam - " + pageParamsArray[i] + " = " + oo.common.getParameterByName(pageParamsArray[i]));
                    src += "&" + pageParamsArray[i] + "=" + oo.common.getParameterByName(pageParamsArray[i]);
                }
            }
            if (src !== "") {
                // load iframe src..
                oo.log("oo.iframe.load: loading iframe with src = " + src);
                iframeObj.attr("src",src);
                iframeObj.css("background-image", "none"); // remove loading image
            }
            return iframeObj;
        };
        iframe.generate = function(pageName, pageParams) {
            var iframeObj = $("<iframe></iframe>");
            iframeObj.attr("id", _iframeIdPrefix + pageName);
            iframeObj.attr("data-pageKey", pageName);
            if (typeof pageParams != "undefined") {
                iframeObj.attr("data-pageParams", pageParams);
            }
            iframeObj.attr("scrolling","no");
            iframeObj.attr("style","width: 100%; height: 100%; border: none;");
            iframeObj.addClass(_iframeClass);

            if (iframeObj = iframe.load(iframeObj)) {
                oo.log("oo.iframe.generate: loaded iframe id = " + iframeObj.attr("id"));
                _iframes.push(iframeObj);
                return _iframes[_iframes.length - 1];
            } else {
                oo.log("oo.iframe.generate: Could not generate iframe as couldn't load iframe. iframeObj = " + iframeObj);
                return false;
            }
        };
        iframe.get = function(myId) {
            var tmpArray = $.grep(_iframes, function(e) {
                return e.id === myId;
            });
            if (tmpArray.length == 0) {
                return null;
            } else {
                return tmpArray[0];
            }
        };
        iframe.refresh = function(iframeId) {
            var iframeObj = $('#' + iframeId);
            iframeObj.contentWindow.location.reload(true);
        };
        iframe.show = function(name) {
            var myId = _iframeIdPrefix + name;
            if (iframeObj = iframe.get(myId)) {
                iframeObj.show();
            } else {
                iframeObj = iframe.generate(name);
                iframe.addToPage(iframeObj);
            }
        };
        iframe.close = function(iframeObj) {
            for (var i=0; i < _iframes.length; i++) {
                if (_iframes[i] === iframeObj) {
                    _iframes.splice(i,1);
                    break;
                }
            }
            iframeObj.remove();
        };
    }(oo.iframe = oo.iframe || {}));
}(window.oo = window.oo || {}, jQuery));