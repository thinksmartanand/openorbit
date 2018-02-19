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
                purple2:            "#232a52",
                grey1:              "#34495e" 
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
//alert(params);
            var paramStr = "",
                myKey;
            if (typeof params != "undefined") {
                // build uri parameters..
                for (myKey in params) {
                    paramStr += "&" + encodeURIComponent(myKey) + "=" + encodeURIComponent(params[myKey]);
                }
            }
            
            

            if(pageName == 'reportFishbone')
            {

            //  alert(common.getUrlVars()['Comments']);
              var CurrentVal = common.getUrlVars()['Comments'];
              var url = window.top.location.href;
             
              paramStr = "&Comments="+params;
              if( CurrentVal != '' && CurrentVal == 'hide' && CurrentVal != undefined)
              {

                url = url.slice(0, url.lastIndexOf('&'));
                paramStr = "";
              }
              window.top.location.href = url +paramStr;
           }
            else
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
        //added by mj to auto refresh iframes
        common.getIframeToRefresh = function(index) {
        //alert(index);
            _iframeArray = {
                "Connection Metrics":"oo_iframe-metricsConnection",
                "3. Connections":"oo_iframe-metricsConnection",
                "Connection Causes": "oo_iframe-causesConnection",
                "Connection Solutions":"oo_iframe-solutionConnection",
		"Custom Reports":"oo_iframe-customReports",
                "Custom Fields":"oo_iframe-customFields",
                "Custom Lists of Values":"oo_iframe-customLOVs",
                "Custom Report Fields":"oo_iframe-customReportsFields",
                "Project Outline":"oo_iframe-ProjectManagement_New",
                "Stage Tracking":"oo_iframe-stageTracking",
                "Project Checklists":"oo_iframe-projectChecklists",
                "Solution Checklists":"oo_iframe-solutionChecklists",
                "Project Notes":"oo_iframe-notesAndAttachments",
                "Metrics":"MetricsOptions",
                "Causes":"CausesOptions",
                "Solutions":"SolutionsOptions",
                "Solution & Benefits":"oo_iframe-benefitTracking",
                "Benefits Tracking Report":"oo_iframe-benefitTracking",
                "4. Custom Fields":"oo_iframe-CustomFieldsValues_LOVs",
                "Standard List":"oo_iframe-CustomFieldsValues_LOVs",
                "Free Text":"oo_iframe-CustomFieldsValues_Text",
                "Performance Gap After Report":"oo_iframe-BenefitsAnalysisReport",
                "Performance Before Vs. After Report":"oo_iframe-BeforeVsAfterReport",
                "Custom Reports":"oo_iframe-customReportOutput"
            };
              
              if (typeof _iframeArray[index] != "undefined") {
                return (_iframeArray[index]);
            } else {
                oo.log("oo.common.getIframeToRefresh : could not find value for = " + index);
            }
            //return (_iframeArray[index]);
        };
    }(oo.common = oo.common || {}));
}(window.oo = window.oo || {}, jQuery));
