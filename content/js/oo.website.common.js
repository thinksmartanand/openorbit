(function(oo, $, undefined) {
    (function(common) {
        var _planType = "";
        var _topBarHeight = 0;

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
            return pageName + ".shtml?PlanType=" + common.getPlanType().toUpperCase();
        };
        common.scrollTo = function(hashId) {
            if (_topBarHeight === 0) _topBarHeight = $('#oo_js_topBar').height();
            $('html, body').animate({
                scrollTop: $(hashId).offset().top - _topBarHeight
            }, 1000);
        };

    }(oo.common = oo.common || {}));
}(window.oo = window.oo || {}, jQuery));
