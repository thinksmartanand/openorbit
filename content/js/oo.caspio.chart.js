(function(oo, $, undefined) {
    (function(chart) {
        // private parameters..
        var _charts = [];

        var convertTableData = function(tblObj) {
        
            return $(tblObj).tableToJSON();
        };

        chart.addChart = function(myChart) {
            _charts.push(myChart);
        };
        chart.getData = function() {

            //TODO: make this method only run, once each iframe is loaded..
            var chartData = [],
                iframes = $('iframe'),
                myTbls,
                myTbl,
                myData,
                myDoc;
            if (iframes.length > 0) {
                $("iframe").each(function(){
                    //this.on('load', function() {
                        myDoc = (this.contentWindow.document||this.contentDocument);
                        myTbls = $('table', myDoc);
                        myTbl = myTbls.first();
                        myData = convertTableData(myTbl);
                        oo.log("oo.chart.getData: " + JSON.stringify(myData));
                        chartData.push(myData);
                    //});
                });
            } else {
                myDoc = document;
                myTbls = $('table', myDoc);
                myTbl = myTbls.first();
                myData = convertTableData(myTbl);
                oo.log("oo.chart.getData: " + JSON.stringify(myData));
                chartData.push(JSON.stringify(myData));
            }
            return chartData;
        };

        (function(vsm) {
            var _chartData = [],
                _steps = [],
                _html = "",
                _defaultOptions = {
                    "chartContainerId": "oo_chart_vsm",
                    "minimumStepWidth": 100,
                    "css": {
                        "stepWidth": function () {
                            return (100 / (_steps.length * 2.1)) + "%";
                        }
                    }
                };

            var getData = function() {
                    _chartData = oo.chart.getData();
                },
                generateSteps = function() {
                    var tmpArray = [],
                        tmp = "";
                       
                    // list all steps across metrics, causes and solutions..
                    for (var i=0; i < _chartData.length; i++) {
                 
                        for (var j = 0; j < _chartData[i].length; j++) {
                       
                            tmp = _chartData[i][j][Object.keys(_chartData[i][j])[0]];
                            if (tmp != "") {
                                tmpArray.push(tmp);
                            }
                        }
                    }
                    // remove duplicates..
                    _steps = $.grep(tmpArray, function(v, k){
                        return $.inArray(v ,tmpArray) === k;
                    });
                   
                    oo.log("oo.chart.vsm.getSteps: steps = " + _steps.toString());
                },
                integrateData = function() {
                    var myTableType = "",
                        myRow, myHtml, myHtmlHeader, myHtmlFooter = "</table>",
                        myKey, myRegExp, i, j,
                        myPlaceholders = {
                            metrics: "[oo_chart_vsm-metrics]",
                            causes: "[oo_chart_vsm-causes]",
                            solutions: "[oo_chart_vsm-solutions]"
                        };
                    oo.log("oo.chart.vsm.integrateData: integrating data.");
                    for (i = 0; i < _chartData.length; i++) {
                        myHtml = [];
                        if (typeof _chartData[i][0] != "undefined") {
                            if (typeof _chartData[i][0]["MetricName"] != "undefined") {
                                // metric table..
                                myTableType = "metrics";
                                myHtmlHeader = "<table class='oo_chart_vsm-metrics' cellspacing='0' cellpadding='0' border='0'><tr><th scope='col' colspan='3'>Metrics</th></tr>";
                            } else if (typeof _chartData[i][0]["CauseName"] != "undefined") {
                                // causes table..
                                myTableType = "causes";
                                myHtmlHeader = "<table class='oo_chart_vsm-causes' cellspacing='0' cellpadding='0' border='0'><tr><th scope='col' colspan='2'>Causes</th></tr>";
                            } else {
                                // solutions table..
                                myTableType = "solutions";
                                myHtmlHeader = "<table class='oo_chart_vsm-solutions' cellspacing='0' cellpadding='0' border='0'><tr><th scope='col' colspan='2'>Solutions</th></tr>";
                            }
                            for (j=0; j < _chartData[i].length; j++) {
                                myRow = _chartData[i][j];
                                if (myRow.id == "") {
                                    myRow.id = "Project-wide";
                                }
                                oo.log("oo.chart.vsm.integrateData: id = " + myRow.id);
                                switch (myRow.Priority) {
                                    case '3 - Low':
                                        myRow.Priority = "oo_chart_vsm-priority_low";
                                        break;
                                    case '2 - Medium':
                                        myRow.Priority = "oo_chart_vsm-priority_medium";
                                        break;
                                    case '1 - High':
                                        myRow.Priority = "oo_chart_vsm-priority_high";
                                        break;
                                }
                                if (typeof myHtml[myRow.id] == "undefined") {
                                    myHtml[myRow.id] = "";
                                    oo.log("oo.chart.vsm.integrateData: initialised myHtml[" + myRow.id + "]");
                                }
                                switch(myTableType) {
                                    case 'metrics':
                                        oo.log("oo.chart.vsm.integrateData: table type = metrics");
                                        myHtml[myRow.id] += "<tr class='" + myRow.Priority + "'><th scope='row'>" + myRow.MetricName + "</th><td>" + myRow.Baseline + " " + myRow.UoM + "</td>";
                                        break;
                                    case 'causes':
                                        oo.log("oo.chart.vsm.integrateData: table type = causes");
                                        myHtml[myRow.id] += "<tr class='" + myRow.Priority + "'><td>" + myRow.CauseName + "</td>";
                                        break;
                                    case 'solutions':
                                        oo.log("oo.chart.vsm.integrateData: table type = solutions");
                                        myHtml[myRow.id] += "<tr class='" + myRow.Priority + "'><td>" + myRow.SolutionName + "</td>";
                                        break;
                                    default:
                                        oo.log("oo.chart.vsm.integrateData: table type = ??");
                                }
                                if (myRow.Priority != "") {
                                         strPriority = myRow.Priority;
                                         if(strPriority.indexOf("high") >= 0)
                                         {
                                           myHtml[myRow.id] += "<td><img  style='width:15px;height:15px;'                                     src='https://files.insolitusglobal.com/oo/dev/content/vsm/img/flag-red.png' title='High'></td></tr>";
                                         }
                                         else if(strPriority.indexOf("medium") >= 0)
                                         {
                                           myHtml[myRow.id] += "<td><img  style='width:15px;height:15px;'   src='https://files.insolitusglobal.com/oo/dev/content/vsm/img/flag-yellow.png' title='Medium'></td></tr>";
                                         }
                                    else if(strPriority.indexOf("low") >= 0)
                                     { 
                                       myHtml[myRow.id] += "<td><img  style='width:15px;height:15px;' src='https://files.insolitusglobal.com/oo/dev/content/vsm/img/flag-green.png' title='Low'></td></tr>";
                                    }
                                   
                                } else {
                                    myHtml[myRow.id] += "<td><img style='width:15px;height:15px;' src='https://files.insolitusglobal.com/oo/dev/content/vsm/img/flag.png' title='TBD'></td></tr>";
                                }
                                oo.log("oo.chart.vsm.integrateData: myHtml[" + myRow.id + "] = " + myHtml[myRow.id]);
                            }
                            oo.log("oo.chart.vsm.integrateData: myHtml[myRow.id] = " + myHtml[myRow.id]);

                            var tmpArray = [];
                            for (myKey in myHtml) {
                                oo.log("oo.chart.vsm.integrateData: key = " + myKey + " and value = " + myHtml[myKey]);
                                tmpArray = _html.split(myKey);
                                if (tmpArray.length === 2) {
                                    _html = tmpArray[0] + myKey + tmpArray[1].replace(myPlaceholders[myTableType], (myHtmlHeader + myHtml[myKey] + myHtmlFooter));
                                }
                            }

                        } else {
                            oo.log("oo.chart.vsm.integrateData: error as chartdata not complete.");
                        }

                    }

                    //remove extra placeholders..
                    for (myKey in myPlaceholders) {
                        myRegExp = new RegExp(oo.common.escape(myPlaceholders[myKey]), "g");
                        _html = _html.replace(myRegExp, "");
                    }

                    oo.log("oo.chart.vsm.integrateData: _html = " + _html);
                },
                build = function(options) {
                    var settings = {},
                        i;

                    if (typeof options != "undefined") {
                        settings = $.extend({}, _defaultOptions, options);
                    } else {
                        settings = _defaultOptions;
                    }

                    // Setup vsm steps..
                    _html = "";

                    generateSteps();

                    for (i = 0; i < _steps.length; i++) {

                        oo.log("oo.chart.drawMe: adding step as category: " + _steps[i]);
                        _html += "<div class='oo_chart_vsm-wait' style='width: " + settings.css.stepWidth() + ";'><p class='oo_chart_vsm-label'></p></div><div class='oo_chart_vsm-step' style='width: " + settings.css.stepWidth() + ";'><p class='oo_chart_vsm-label'>" + _steps[i] + "</p>[oo_chart_vsm-metrics][oo_chart_vsm-causes][oo_chart_vsm-solutions]</div></div>";
                    }
                    _html += "<div class='oo_clear-left'></div>";
                    // for project-wide metrics, causes and solutions..
                    _html += "<div class='oo_chart_vsm-all'><p class='oo_chart_vsm-label'>Project-wide</p>[oo_chart_vsm-metrics][oo_chart_vsm-causes][oo_chart_vsm-solutions]</div>";

                    oo.log("oo.chart.vsm.build: _html = " + _html);

                    integrateData();
					
                };
				//added by mj to set the max  height to step decsription
				setMaxHeight = function(){
					var maxHeight = -1;

					$('.oo_chart_vsm-label').each(function() {
					maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
					});

				   $('.oo_chart_vsm-label').each(function() {
					 $(this).height(maxHeight);
				   });
				   //alert(maxHeight);
				};
				//end of setMaxHeight
            // public methods..
            vsm.render = function() {
                // set width of container if page too narrow..
                var containerObj = $('#' + _defaultOptions.chartContainerId),
                    containerWidth = (_steps.length * _defaultOptions.minimumStepWidth * 2);
                if (containerWidth > containerObj.width()) {
                    containerObj.css("width", containerWidth + "px");
                }
                // Render chart..
                containerObj.html(_html);
				setMaxHeight();
                oo.log("oo.chart.vsm.render: finished rendering VSM chart.");
            };
            vsm.init = function(options) {

                getData();

                build(options);
                return this;
            };
			
        }(chart.vsm = chart.vsm || {}));


        (function(fishbone) {
            var _chartData = [],
                _causeTypes = {
                    People:         [],
                    Systems:        [],
                    Process:        [],
                    Policies:       [],
                    Measurement:    [],
                    Environment:    []
                },
                _canvas,
                _ctx,
                _defaultOptions = {
                    chartContainerId:   "oo_chart_fishbone",
                    canvasId:           "oo_chart_fishbone-canvas",
                    causeTypeMinWidth:  180,
                    canvasHeight:       450,
                    canvasWidth:        0,
                    baseFontSize:       12
                };


            var getData = function() {
                    var i;
                    _chartData = JSON.parse(oo.chart.getData());
                    for (i=0; i < _chartData.length; i++) {
                        if (_chartData[i]["Cause Type"] !== "") {
                            oo.log("oo.chart.fishbone.getData: _chartData[" + i + "] = " + _chartData[i]["Cause Name"]);
                            _causeTypes[_chartData[i]["Cause Type"]].push({

                                name:           _chartData[i]["Cause Name"],
                                step:           _chartData[i]["Step"],
                                priority:       _chartData[i]["Priority"],
                                controllable:   _chartData[i]["Controllable"],
                                Description:    _chartData[i]["Description"]
                            });
                        } else {
                            oo.log("oo.chart.fishbone.getData: found _chartData[" + i + "]['Cause Type'] = ''");
                        }
                    }
                    return (_chartData.length > 0);
                },
                sortCauseTypes = function(myArray) {
                    myArray.sort(function(a,b) {
                        return (_causeTypes[a].length - _causeTypes[b].length);
                    });
                    return myArray;
                },
                build = function(options) {
                var adjustmentVal = 5;
                    var settings = {},
                        i,
                        causeTypeLabels = Object.keys(_causeTypes),
                        numCauseTypes = causeTypeLabels.length,
                        myChartContainer;

                    if (typeof options != "undefined") {
                        settings = $.extend({}, _defaultOptions, options);
                    } else {
                        settings = _defaultOptions;
                    }

                    // sort cause types..
                    causeTypeLabels = sortCauseTypes(causeTypeLabels);

                    // get chart html container..
                    myChartContainer = $('#' + settings.chartContainerId);

                    // create canvas..
                    _canvas = $("<canvas></canvas>");
                    _canvas.attr("id", settings.canvasId);

                    // calculate canvas width..
                    if (myChartContainer.width() < (numCauseTypes * settings.causeTypeMinWidth)) {
                        settings.canvasWidth = parseInt(myChartContainer.width());
                    } else {
                        settings.canvasWidth = parseInt(numCauseTypes * settings.causeTypeMinWidth);
                    }
                    _canvas.attr("width", settings.canvasWidth);

                    var halfCanvasHeight = settings.canvasHeight / 2,
                        halfNumCauseTypes = Math.ceil(numCauseTypes / 2),
                        spineSection = settings.canvasWidth / halfNumCauseTypes,
                        sectionLabelHeight = 40,
                        extraHeight = 100;

                    // calculate canvas height..
                    var verticalNumCauses = _causeTypes[causeTypeLabels[numCauseTypes - 1]].length + _causeTypes[causeTypeLabels[numCauseTypes - 2]].length;
                    settings.canvasHeight = extraHeight + (verticalNumCauses * 50) + (2 * sectionLabelHeight);
                    var spineY = (extraHeight / 2) + (_causeTypes[causeTypeLabels[numCauseTypes - 1]].length * 50) + sectionLabelHeight;
                    _canvas.attr("height", settings.canvasHeight);

                    oo.log("oo.chart.fishbone.build: spineSection = " + spineSection + "; canvasWidth = " + settings.canvasWidth + "; canvasHeight = " + settings.canvasHeight + "; spineY = " + spineY);

                    // add canvas to page..
                    myChartContainer.append(_canvas);

                    // get canvas context..
                    _ctx = _canvas[0].getContext("2d");

                    // draw fishbone chart..

                    // setup line width and crispness..
                    _ctx.lineWidth = 1;

                    // draw main spine, right to left..
                    oo.log("oo.chart.fishbone.build: drawing spine.");
                    _ctx.moveTo(settings.canvasWidth, spineY);
                    _ctx.lineTo(spineSection, spineY);

                    // draw branches..
                    oo.log("oo.chart.fishbone.build: drawing branches.");
                    var myCauses = [],
                        myNumCauses = 0,
                        j = 0,
                        dataItemX = 0,
                        dataItemY = 0,
                        tmpRowHeight = 0,
                        tmpIndent = 0;

                    for (i = 1; i <= halfNumCauseTypes; i++) {
//alert("for looop 1 start");
//alert("halfNumCauseTypes = " + halfNumCauseTypes);
                        var x1,x2,y1,y2,y3,a,b,c;
                        x1 = (spineSection * (i - 1)) + (spineSection * (3 / 4));
                        x2 = (spineSection * (i - 1)) + (spineSection);
                        y1 = sectionLabelHeight;
                        y2 = spineY;
                        y3 = (settings.canvasHeight - sectionLabelHeight);

                        _ctx.strokeStyle = oo.common.getColorByKey("text");

                        // draw top branch..
                        _ctx.moveTo(x1, y1);
                        _ctx.lineTo(x2, y2);

                        // draw bottom branch..
                        _ctx.moveTo(x2, y2);
                        _ctx.lineTo(x1, y3);


                        // add in top branch data..

                        _ctx.textAlign = "right";

                        myCauses = _causeTypes[causeTypeLabels[i + halfNumCauseTypes - 1]];

                        myNumCauses = myCauses.length;

                        for (j=0; j < myNumCauses; j++) {
//alert("for loop 2 start");
                            b = y2 - ((j + 1) * 50);
                            a =  - (((y2 - b) / ((y2 - y1) / (x2 - x1))) - x2);
                            
                            oo.log("oo.chart.fishbone.build: a = " + a + "; b = " + b + ";");

                            // add line for branch data item..
                            _ctx.strokeStyle = oo.common.getColorByKey("text");
                            _ctx.moveTo(a, b);
                            _ctx.lineTo(a - 10, b);

                            // add branch data item text..
                            _ctx.font = "11px Helvetica";
                            _ctx.fillStyle = oo.common.getColorByKey("text");
                           
                                switch (myCauses[j].priority) {
                                    case '1 - High':
                                        _ctx.fillText(myCauses[j].name, a - 35, b + adjustmentVal , spineSection - 20);
                                        //_ctx.font = "11px FontAwesome";
                                        _ctx.fillStyle = oo.common.getColorByKey("priority-high");
                                        //_ctx.fillText(String.fromCharCode("0xf024"), a - 20, b);
                                        _ctx.fillText("H", a - 20, b + adjustmentVal);
                                        break;
                                    case '2 - Medium':
                                        _ctx.fillText(myCauses[j].name, a - 35, b + adjustmentVal, spineSection - 20);
                                        //_ctx.font = "11px FontAwesome";
                                        _ctx.fillStyle = oo.common.getColorByKey("priority-medium");
                                        //_ctx.fillText(String.fromCharCode("0xf024"), a - 20, b);
                                        _ctx.fillText("M", a - 20, b+ adjustmentVal);
                                        break;
                                    case '3 - Low':
                                        _ctx.fillText(myCauses[j].name, a - 35, b + adjustmentVal, spineSection - 20);
                                        //_ctx.font = "11px FontAwesome";
                                        _ctx.fillStyle = oo.common.getColorByKey("priority-low");
                                        //_ctx.fillText(String.fromCharCode("0xf024"), a - 20, b);
                                        _ctx.fillText("L", a - 20, b+ adjustmentVal);
                                        break;
                                    default:
                                        _ctx.fillText(myCauses[j].name , a - 20, b + adjustmentVal, spineSection);
                                }
                            
                            NoOfColumns = 1;
                            tmpRowHeight = 15;
                            tmpIndent = 21;
                            if (myCauses[j].step !== "") {
                                 tmpRowHeight = tmpRowHeight * NoOfColumns;
                                _ctx.font = "10px Helvetica";
                                _ctx.fillStyle = oo.common.getColor("grey6");
                                var strStepName = myCauses[j].step;
                                if(strStepName.length > 50) strStepName = strStepName.substring(0,50) + '...';
                                _ctx.fillText("(STEP: " + strStepName + ")", a - 20, b + tmpRowHeight , spineSection);
                                NoOfColumns++;
                                console.log("NoOfColumns =" + tmpRowHeight );
                            }
                            if (myCauses[j].controllable != "") {
                                 tmpRowHeight = 15 * NoOfColumns;
                                _ctx.font = "9px Helvetica";
                                _ctx.fillStyle = oo.common.getColor("blue1");
                                _ctx.fillText("-- " + myCauses[j].controllable.toUpperCase() + " --", a - tmpIndent, b + tmpRowHeight, spineSection);
                                 NoOfColumns++;
                                 console.log("NoOfColumns =" + tmpRowHeight );

                            }

//alert(fishbone.getUrlVars()['Comments']);
                            if(fishbone.getUrlVars()['Comments'] != 'hide')
                            {
                            if (myCauses[j].Description!= "") {
                               tmpRowHeight = 15 * NoOfColumns -5;
                               //trim characters if length is > 50
                               var strDescription = myCauses[j].Description;
//alert(strDescription.length);
                               if(strDescription.length > 50) strDescription = strDescription.substring(0,50) + '...';
                                _ctx.font = "10px Helvetica";
                                _ctx.fillStyle = oo.common.getColor("grey7");
                                _ctx.fillText(strDescription, a - tmpIndent, b + tmpRowHeight, spineSection);

                                NoOfColumns++;
                                console.log("DescriptionNoOfColumns =" + tmpRowHeight );
                                tmpRowHeight = 65;
                            }
                           }
//alert("for loop 2 End");
                        }

                        // add in bottom branch data..
                        myCauses = _causeTypes[causeTypeLabels[i - 1]];
                        myNumCauses = myCauses.length;

                        for (j=0; j < myNumCauses; j++) {
                          //alert("for loop 3 Start");
                            c = y2 + ((j + 1) * 50);
                            a =  - (((y2 - c) / ((y2 - y3) / (x2 - x1))) - x2);
                            oo.log("oo.chart.fishbone.build: a = " + a + "; c = " + c + ";");

                            // add line for branch data item..
                            _ctx.strokeStyle = oo.common.getColorByKey("text");
                            _ctx.moveTo(a, c);
                            _ctx.lineTo(a - 10, c);

                            // add branch data item text..
                            _ctx.font = "11px Helvetica";
                            _ctx.fillStyle = oo.common.getColorByKey("text");
                            
                                switch (myCauses[j].priority) {
                                    case '1 - High':
                                        _ctx.fillText(myCauses[j].name, a - 35, c + adjustmentVal, spineSection - 20);
                                        //_ctx.font = "11px FontAwesome";
                                        _ctx.fillStyle = oo.common.getColorByKey("priority-high");
                                        //_ctx.fillText("\uf024", a - 20, c + adjustmentVal);
                                        _ctx.fillText("H", a - 20, c + adjustmentVal);
                                        break;
                                    case '2 - Medium':
                                        _ctx.fillText(myCauses[j].name, a - 35, c + adjustmentVal, spineSection - 20);
                                        //_ctx.font = "11px FontAwesome";
                                        _ctx.fillStyle = oo.common.getColorByKey("priority-medium");
                                        //_ctx.fillText("\uf024", a - 20, c + adjustmentVal);
                                        _ctx.fillText("M", a - 20, c + adjustmentVal);
                                        break;
                                    case '3 - Low':
                                        _ctx.fillText(myCauses[j].name, a - 35, c + adjustmentVal, spineSection - 20);
                                        //_ctx.font = "11px FontAwesome";
                                        _ctx.fillStyle = oo.common.getColorByKey("priority-low");
                                        //_ctx.fillText("\uf024", a - 20, c + adjustmentVal);
                                        _ctx.fillText("L", a - 20, c + adjustmentVal);
                                        break;
                                    default:
                                        _ctx.fillText(myCauses[j].name, a - 20, c + adjustmentVal, spineSection);
                                }
                            
                            NoOfColumns = 1;
                            tmpRowHeight = 15;
                            //tmpIndent = 35;
                            tmpIndent = 21;
                            if (myCauses[j].step !== "") {
                                   tmpRowHeight = tmpRowHeight * NoOfColumns;
                                _ctx.font = "10px Helvetica";
                                _ctx.fillStyle = oo.common.getColor("grey6");
                                var strStepName = myCauses[j].step;
                                if(strStepName.length > 50) strStepName = strStepName.substring(0,50) + '...';
                                _ctx.fillText("(STEP: " + strStepName  + ")", a - 20, c + tmpRowHeight, spineSection);
                                  NoOfColumns++;
                            }

                            if (myCauses[j].controllable != "") {
                                   tmpRowHeight = 15 * NoOfColumns;
                                _ctx.font = "9px Helvetica";
                                _ctx.fillStyle = oo.common.getColor("blue1");
                                _ctx.fillText("-- " + myCauses[j].controllable.toUpperCase() + " --", a - tmpIndent, c + tmpRowHeight, spineSection);
                                NoOfColumns++;
                            }

                           if (myCauses[j].Description!= "") {
 if(fishbone.getUrlVars()['Comments'] != 'hide')
                            {
                                  tmpRowHeight = 15 * NoOfColumns - 5;
                                _ctx.font = "10px Helvetica";
                                _ctx.fillStyle = oo.common.getColor("grey7");
                                //trim characters if length is > 50
                               var strDescription = myCauses[j].Description;
                               if(strDescription.length > 50) strDescription = strDescription.substring(0,50) + '...';
                                _ctx.fillText(strDescription, a - 25, c+ tmpRowHeight, spineSection );
                                 NoOfColumns++;
                                tmpRowHeight = 50;
                            }
}
//alert("for loop 3 end");
                        }

                        _ctx.font = "11px Helvetica";
                        _ctx.fillStyle = oo.common.getColor("grey4");
                        _ctx.textAlign = "center";
                        //code modified by MJ To Resolve JIRA ISSUE 210 
			//Swapped parameters in old code top <->bottom
                        // add top branch label..
                        // _ctx.fillText(causeTypeLabels[i - 1], x1, ((sectionLabelHeight * 2) / 3)); //Old code
                        _ctx.fillText(causeTypeLabels[i + halfNumCauseTypes - 1], x1, ((sectionLabelHeight * 2) / 3));
                        // add bottom branch label..
                        //_ctx.fillText(causeTypeLabels[i + halfNumCauseTypes - 1], x1, settings.canvasHeight - (sectionLabelHeight / 2));//Old code 
                        _ctx.fillText(causeTypeLabels[i - 1], x1, settings.canvasHeight - (sectionLabelHeight / 2));
                    }
//alert("for loop 1 end");
                };

            // public methods..
            fishbone.render = function() {
                // Render chart..
                _ctx.stroke();
                oo.log("oo.chart.fishbone.render: finished rendering Fishbone chart.");
            };
            fishbone.init = function(options) {

                if (getData()) {
                    build(options);
                    return this;
                } else {
                    return false;
                }

            };
            fishbone.getUrlVars = function() {
            var vars = [],
                hash;
            var hashes = document.referrer.slice(document.referrer.indexOf('?') + 1).split('&');
            for(var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        };
        }(chart.fishbone = chart.fishbone || {}));

        chart.draw = function(chartType) {
            var myChart;
            switch(chartType) {
                case 'vsm':
                    myChart = oo.chart.vsm.init();
                    break;
                case 'fishbone':
                    myChart = oo.chart.fishbone.init();
                    break;
            }
            if (myChart) {
                oo.chart.addChart(myChart);
                myChart.render();
            } else {
                oo.log("oo.chart.draw: could not render chart");
            }
        };

    }(oo.chart = oo.chart || {}));
}(window.oo = window.oo || {}, jQuery));
