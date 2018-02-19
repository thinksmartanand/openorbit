(function(oo,$,undefined) {
    (function(subContent) {
        // private parameters..
        var _subNav,
            _subContent,
            _subNav_btn,
            _level2Links,
            _accordionLinks;

        // private methods..
        var getContentLevels = function (subContentId) {
                var tmp = subContentId.split("-");
                tmp = tmp[1].split("_");
                level1 = parseInt(tmp[0]);
                if (tmp.length > 1) {
                    level2 = parseInt(tmp[1]);
                    return [level1,level2];
                }
                return [level1];
            },
            setupContent = function() {
              if (window.location.search.indexOf('Processmodel') > -1) {
	            oo.subContent.show('#oo_js_subContent-2_1');
	        } else {
	            oo.subContent.show('#oo_js_subContent-1_1');
	        }
              if ($('#oo_js_subContent-1').length > 0) {
                    oo.subContent.show('#oo_js_subContent-1');
                } 
                /*else {
                    oo.subContent.show('#oo_js_subContent-1_1');
                }*/
            },
            setupNav = function() {
                _accordionLinks = _subNav.find('> ol > li > a, > ul > li > a');

                _accordionLinks.click(function (e) {
                    var currentLink = $(e.target);
                    oo.subContent.openAccordionSection(currentLink);
                    e.preventDefault();
                });
                _level2Links = _accordionLinks.parent('li').find('li a');
                _level2Links.click(function (e) {
                    var currentLink = $(e.target);
                    var subContentId = currentLink.attr("href");
                    if (subContentId != "javascript:void(0);") {
                        oo.subContent.show(subContentId);
                    }
                    _level2Links.closest("li").removeClass("oo_selected");
                    currentLink.closest("li").addClass("oo_selected");
                    e.preventDefault();
                });
            },
            setupPaging = function() {
                _subContent.find('> div').each(function() {
                    var nextLinks = $(this).find('.oo_js_paging-next');
                    if (nextLinks != null) {
                        var nextSubContent = $(this).next();
                        var nextSubContentHeading = nextSubContent.find("h2").text();
                        nextLinks.click(function(e) {
                            var nextSubContentId = $(this).closest('div').next().attr("id");
                            oo.subContent.show("#" + nextSubContentId);
                        });
                        nextLinks.each(function() {
                            $(this).attr('title', 'Next: ' + nextSubContentHeading);
                        });
                    }
                    var previousLinks = $(this).find('.oo_js_paging-previous');
                    if (previousLinks != null) {
                        var previousSubContent = $(this).prev();
                        var previousSubContentHeading = previousSubContent.find("h2").text();
                        previousLinks.click(function(e) {
                            var previousSubContentId = $(this).closest('div').prev().attr("id");
                            oo.subContent.show("#" + previousSubContentId);
                        });
                        previousLinks.each(function() {
                            $(this).attr('title', 'Previous: ' + previousSubContentHeading);
                        });

                    }
                });
            };

        // public methods..
        subContent.init = function() {
            _subNav = $('#oo_js_subNav');
            if (_subNav.length < 1) return;

            _subContent = $('#oo_js_subContent');
            _subNav_btn = $('#oo_js_subNav-btn');

            setupNav();
            setupPaging();
            setupContent();
        };
        subContent.closeAccordionSection = function(currentLI) {
            var activeLI;
            if (typeof currentLI != "undefined") {
                activeLI = currentLI;
            } else {
                activeLI = _subNav.find('li.oo_active');
            }
            activeLI.each(function() {
                $(this).removeClass('oo_active');
                $(this).children('ul,ol').slideUp(300).removeClass('oo_active');
            });
        };
        subContent.openAccordionSection = function(currentLink) {
            var currentLI = currentLink.closest('li');
            if (currentLI.hasClass('.oo_active')) {
                subContent.closeAccordionSection(currentLI);
            } else {
                subContent.closeAccordionSection();

                // Add active class to section title
                currentLI.addClass('oo_active');
                // Open up the hidden content panel
                currentLI.children('ul').slideDown(300).addClass('oo_active');

                var subContentId = currentLink.attr("href");
                subContent.show(subContentId);

            }
        };
        subContent.show = function(subContentId) {
            //nb. subContentId includes "#" at the beginning.
            oo.log("showing subcontent: " + subContentId);

            //hide all subcontent..
            _subContent.find('> div').hide();

            //show subcontent..
            $(subContentId).show();
            oo.common.scrollTo("#oo_hash-top");

            //track showing this subcontent..
            oo.track.me('projectdetails-section-show', $(subContentId).find("h2:first-child").text());

            // setup iframes if not already loaded.. kinda lazyload..
            var foundIframe = false;
            $(subContentId).find('iframe').each(function() {
                if ($(this).attr("src") == "" && (typeof $(this).attr("data-pageKey") != "undefined")) {
                    foundIframe = true;
                    var iframeObj = $(this);
                    oo.iframe.load(iframeObj);
                }
            });
            if (foundIframe) {
                oo.iframe.setupResizer();
            }

            //remove all oo_selected..
            _level2Links.closest("li").removeClass('oo_selected');

            //set subnav oo_selected..
            var levels = getContentLevels(subContentId);
            var a = _accordionLinks.eq(levels[0] - 1).closest("li");
            if (!a.hasClass("oo_active")) {
                var currentAccordionLI = _subNav.find('li.oo_active');
                subContent.closeAccordionSection(currentAccordionLI);
                a.addClass("oo_active");

                if (levels.length > 1) {
                    a.children('ul').slideDown(300).addClass('oo_active');
                }
            }
            if (levels.length > 1) {
                var b = a.find("li:nth-child(" + levels[1] + ")");
                b.addClass("oo_selected");
            }
        };
        subContent.toggleSubNav = function() {
            if (_subNav.is(':visible')) {
                _subNav_btn.css("position", "relative");
            } else {
                _subNav_btn.css("position", "absolute");
            }
            _subNav.toggle('slow', 'linear', function() {
                if (_subNav.is(':visible')) {
                    _subNav_btn.attr("title", "Hide menu");
                    _subNav_btn.find(".fa").removeClass("fa-caret-square-o-right").addClass("fa-caret-square-o-left");
                } else {
                    _subNav_btn.attr("title", "Show menu");
                    _subNav_btn.find(".fa").removeClass("fa-caret-square-o-left").addClass("fa-caret-square-o-right");
                }
            });
        };
    }(oo.subContent = oo.subContent || {}));
}(window.oo = window.oo || {}, jQuery));