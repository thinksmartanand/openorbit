(function(oo,$,undefined) {
    (function (modal) {
        // private properties..
        var _modalTemplate = null,
            _generatedModals = [],
            _modalIdPrefix = "oo_modal-",
            _contentWrapObj;

        // private methods..
        modal.generate = function (pageName) {
            oo.log("oo.modal.generate: generating iframe for pagename: " + pageName);
            if (_modalTemplate == null) {
                _modalTemplate = $('#oo_js_template-modal').html();
            }
            var objId = _modalIdPrefix + pageName;
            var htmlObj = $("<div></div>");
            htmlObj[0].innerHTML = _modalTemplate.toString();
            htmlObj.addClass("oo_modal-wrap");
            htmlObj.attr("id", objId);

            var modalObj = htmlObj.find('.oo_modal');
            modalObj.attr("style", oo.PageCSS(pageName));
            var headingObj = htmlObj.find('[data-template-header]');
            headingObj.text(oo.PageHeading(pageName));

            if (iframeObj = oo.iframe.generate(pageName)) {
                var contentObj = htmlObj.find('[data-template-content]');
                iframeObj.appendTo(contentObj);
                var closeObj = htmlObj.find('[data-template-close]');
                closeObj.click(function () {
                    oo.modal.close($(this).closest('.oo_modal-wrap'));
                });
                var popoverElements = $('#oo_js_popoverElements');
                htmlObj.appendTo(popoverElements);
                _generatedModals.push(htmlObj);

                oo.iframe.resizer.init({heightCalculationMethod: 'bodyOffset'});

                return _generatedModals[_generatedModals.length - 1];
            } else {
                oo.log("oo.modal.generate: Can not generate modal as iframe generation failed.");
                _contentWrapObj.css("max-height", "none").css("overflow", "inherit");
                return false;
            }

        };

        modal.get = function (myId) {
            var tmpArray = $.grep(_generatedModals, function (e) {
                return e.id === myId;
            });
            if (tmpArray.length == 0) {
                return false;
            } else {
                return tmpArray[0];
            }
        };
         
        //MJ : find and refresh iframes on the web page
       modal.getActiveElement = function(document) {
    	     document = document || window.document;

	    if (document.body === document.activeElement ||
	        document.activeElement.tagName == 'IFRAME') {
	       
	        var iframes = document.getElementsByTagName('iframe');
	        for (var i = 0; i < iframes.length; i++) {
	            // Recall
	            var activeIframe = $(iframes[i]).attr('id');
	
	            if (activeIframe !== false) {
	                if (activeIframe != "intercom-frame" || activeIframe != "iframeResizer0") {
	                 
	                    $("#" + activeIframe).attr('src', $("#" + activeIframe).attr('src'));
	                }
	            }
	        }
	    }

	};
        //public methods..
        modal.show = function (name, options) {
       
            _contentWrapObj = $('#oo_js_contentWrap');
            _contentWrapObj.css("max-height", "100%").css("overflow", "hidden");
            var myId = _modalIdPrefix + name;
            
            if (myModalObj = this.get(myId)) {
            } else {
                myModalObj = this.generate(name);
            }
            if (typeof options != "undefined") {
                if (typeof options.refreshIframe != "undefined") {
                    myModalObj.attr("data-refresh-iframe", options.refreshIframe);
                }
                if (typeof options.redirect != "undefined") {
                    myModalObj.attr("data-redirect", options.redirect);
                }
            }
            oo.log("oo.modal.show: showing modal - " + myModalObj.attr("id"));
            myModalObj.show();
	    
            //e.preventDefault();
        };

        modal.close = function (modalObj) {
        //alert(modalObj.attr("id"));
            //MJ : TODO : Need to refresh specific iframe by identifying text.  
             var openedDialog = $( ".oo_modal-header").text();
            //MJ:end	
            
           // oo.log("oo.modal.close: Closing modal - " + modalObj.attr("id"));
            var myRelatedIframeId = modalObj.data("refresh-iframe");
           
           // oo.log("oo.modal.close: Reloading related iframe - " + myRelatedIframeId);
            if (typeof myRelatedIframeId != "undefined") {
                var relatedIframeObj = window.parent.document.getElementById(myRelatedIframeId);
                oo.log("oo.modal.close: Related iframe object - " + relatedIframeObj);
                if(relatedIframeObj != null && relatedIframeObj != undefined)
                {
                  var iframeSrc = relatedIframeObj.src;
                  relatedIframeObj.src = "";
                  relatedIframeObj.src = iframeSrc;
                }
            }
            var myRedirect = modalObj.data("redirect");
            for (var i = 0; i < _generatedModals.length; i++) {
                if (_generatedModals[i] === modalObj) {
                    _generatedModals.splice(i, 1);
                    break;
                }
            }
            _contentWrapObj.css("max-height", "none").css("overflow", "inherit");
            modalObj.remove();
            if (typeof myRedirect != "undefined") {
                oo.log("oo.modal.close: redirecting to - " + myRedirect);
                window.location.href = myRedirect;
            }
            //MJ:TO refresh iframe on close pop up
            this.getActiveElement();
        };
       
    }(oo.modal = oo.modal || {}));
}(window.oo = window.oo || {}, jQuery));
