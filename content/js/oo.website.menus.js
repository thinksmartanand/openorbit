(function(oo,$,undefined) {
    (function(topMenu) {
        // private properties..
        var _topMenuObj,
            _topMenuDropdowns;

        // public methods..
        topMenu.init = function() {
            _topMenuObj = $('#oo_js_topMenu');
            _topMenuDropdowns = _topMenuObj.find('.oo_topBar-popover');
            _topMenuDropdowns.each(function() {
                // for each second level nav...
                popover = $(this);
                popover.closest('li').on('click', function(e) {
                    e.stopPropagation();
                    $(this).toggleClass("oo_selected");
                    popover.toggle();
                });
            });
            $(document.body).click(function() {
                _topMenuDropdowns.hide();
            });
        };
    }(oo.topMenu = oo.topMenu || {}));

    (function(slidebar) {
        var _slidebarNavObj,
            _plan = "";

        // public methods..
        slidebar.init = function() {
            // TODO: This method should be centralised with the other css hiding and showing of these nav items. ie. there are currently two separate ways controlling the hiding and showing of nav items, and they should be merged into one.
            _plan = oo.common.getPlanType();
            _slidebarNavObj = $('#oo_js_slidebarNav');
            if(_plan != "") {
                oo.log("oo.slidebar.initNav: plan type = " + _plan);
                var slidebarLIs = _slidebarNavObj.find("> li");
                slidebarLIs.not("." + _plan).hide();
                if(_plan === "ops") {
                    _slidebarNavObj.find(".myprojects,.myteamprojects").hide();
                }
                else if(_plan === "gov") {
                    _slidebarNavObj.find(".myprojects").hide();
                }
            }
        };
    }(oo.slidebar = oo.slidebar || {}));
}(window.oo = window.oo || {}, jQuery));