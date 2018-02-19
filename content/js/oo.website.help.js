(function(oo,$,undefined) {

    (function(help) {
        // private parameters..
        var _helpInfo= {
                diagnostics:    {
                    heading:    "Frame and focus",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:    [
                        "<p>This section helps you frame the problem statement and identify areas to focus on. The benefit of doing this is to rapidly arrive at a workable hypothesis on improvements needed, and to standardise the learnings for repeat use within the organisation. We recommend starting this step as early as when you first become aware of the potential need to solve a process optimisation problem. It should then be used continuously throughout the project to aid the analysis, provide probing questions for workshops, and to capture insights as your understanding of the problem evolves. The algorithm helps you address the problem in a flexible and dynamic way, allowing for sequential or parallel steps based on whatever is best for the project</p>",
                        "<p>Start off by providing \"Context\"  - define the Industry, Process and Business Objective of the project. You will select from standardised lists which have been designed to optimise the generation of actionable insights in the quickest and most relevant way. These lists will evolve over time to stay current with trends on how users are categorising and solving problems globally. While you are able to revise these settings at any stage, it would be rare to change the Industry and Process. The Business Objective can sometimes change at a later stage in the project based on further understanding of the problem.</p>",
                        "<p>Next you should go to Metrics, where based on the Context you just provided, the algorithm will kick in and recommend metrics to measure. Select from the recommended list based on your understanding of the business situation. By \"Adding\" a metric to the Project, you are informing the algorithm that you suspect an issue regarding this metric. You may subsequently capture data on this metric, but it is not mandatory to do so. \"Read More\" helps you with additional background information related to that topic. This information is in the form of a Wiki site and we encourage users to contribute to it over time.The Wiki is your public conversation in the practitioner community. The project data on the workbench remains private and confidential.</p>",
                        "<p>Based on Metrics you have selected to be of relevance to your project, the algorithm can then recommend Causes worth investigating. These recommendations can arm you with probing questions to ask during workshops and stakeholder meetings. Like with Metrics, these are suggestions for consideration, and not mandatory in any way. The eventual list attached to the project will be a combination of the recommendations from the algorithm, further filtered by your own judgment and knowledge of the specific business situation. Like Metrics, Causes too can lead to pages on the Wiki. In addition, some Causes have the option of \"drilling further\" into the next level of root causes.</p>",
                        "<p>Based on Causes you have selected, the algorithm will recommend solutions to consider. Solutions start their life within a Project as a Hypothesis, and will eventually go through a process of validation all the way to either being implemented or not. Like Metrics and Causes, the list of Solutions in the project can evolve during the life of the project. And like Metrics and Causes, they too can lead to further information on the Wiki.</p>"
                    ]
                },
                collaboration:  {
                    heading:    "Visibility for colleagues",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:    [
                        "<p>This section provides ways to control who else in your organisation can view or edit the project. Projects aligned to Teams can be viewed by anyone who has a valid Role on that Team. Your System Administrator has the ability to define who has a role on a given team. In addition, you can define named individuals to receive View or Edit permissions. The Edit permission is limited to entering data in the Data Collection Report, and to provide observations and comments in the Notes section.</p>"
                    ]
                },
                processModel:  {
                    heading:    "Hands-off and happy paths",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:    [
                        "<p>This section helps clarify the ideal path that the transaction takes and the hand-offs that it experiences through the process. While useful as an analysis tool in itself, it also helps capture the process definition on which the next section of Connections can be most effective.</p>",
                        "<p>A project will typically contain one process, but can contain multiple processes. It can also contain the \"as is\" as well as the \"to be\" version of the process.</p>",
                        "<p>A process is made up of steps, each step sequenced in order, and each step made up of the largest set of activities which don't involve a hand-off, on the \"happy path\" of the transaction when everything is going right. Exceptions are treated as errors or defects and the path of dealing with them is not explcility mapped in this method.</p>",
                        "<p>The concept of Worktypes is an optional extra. It is used to separate the measurements for different types of work going through the same process.</p>"
                    ]
                },
                connections:    {
                    heading:    "Connecting the diagnostic elements",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        "<p>This helps complete the diagnostic, provides a summary view of process performance, pain points and possible solutions, and is a good way to capture the repeatable learnings from the project.</p>",
                        "<p>Connect each of the selected Metrics from the project as selected in the Diagnostics - Metrics menu to processes or steps within the process as relevant. You can create multiple connections for the same metric.</p>",
                        "<p>Connect each of the selected Causes from the project as selected in the Diagnostics - Causes menu to processes or steps within the process as relevant. You can create multiple connections for the same cause.</p>",
                        "<p>Connect each of the selected Solutions from the project as selected in the Diagnostics - Solutions menu to processes or steps within the process as relevant. You can create multiple connections for the same solution.</p>"
                    ]
                },
                performanceAnalysis:    {
                    heading:    "Measure and prioritise",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        "<p>Capture process performance data, develop priorities for corrective actions.</p>",
                        "<p>The Data Collection Report is the place to capture current process performance data. Up to 3 values can be defined for providing the Baseline \(calculated as an average of non-blank values in these 3 fields\). You can also define a target value, and are encouraged to do so.</p>",
                        "<p>The Performance Gap report calculates the gap between baseline and target, as a percentage of target, and plots a this as a bar graph sorted by largest to smallest gap.</p>",
                        "<p>The Historical Data report provides a place to capture more than 3 baseline values if need be. These are for recording purpose only and do not feed into any other calculations.</p>"
                    ]
                },
                benefitsTracking:   {
                    heading:    "Benefits tracking",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        "<p>Compare process performance data before and after the corrective actions.</p>",
                        "<p>This report can capture the metrics performance after the improvements have been implemented, thus providing a way to compare the results and analyse the movement in the target metric as a result of the project.</p>"
                    ]
                },
                projectTracking:    {
                    heading:    "Stages, Status, Dates, Actions",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        "<p>This section provides the ability to track project stages, status, dates, actions and notes. The section can be configured by your Super User to suit the requirements of your organisation. It can potentially simplify and replace other project tracking mechanisms like spreadsheets, registers and standardised status reports.</p>",
                        "<p>You can define a methodology,and start and end dates for the project as well as for specific stages and activities. Stages depend on the selected methodology. Project Checklists depend on the stage and also on how your Super User has set up these standardised activities. Solution Checklists are free-format activities for you to create and track through to completion.</p>"
                    ]
                },

AssignProjectRoles:  {
                    heading:    "Assign Project Roles",
                    css:        "min-width: 320px; min-height: 100px;",
                    content:    [
                        "<p>This section will allow you to assign roles to your team members. Role type could be for a Mentor,Process Owner, Project Lead or a Sponsor. You can add more than one member to the project. The list is customizable by the admin user.</p>" 
                         


                    ]
                },
AuditLog:  {
                    heading:    "Audit Log",
                    css:        "min-width: 320px; min-height: 100px;",
                    content:    [
                        "<p>This is where you will be able to track the Workflow cycle of the Project. It lists the workflow action like \"Actioned stage\", \"User Name\",\"Actioned on\" and \"comments\" (if any). The audit trail helps you to see how and when the project has moved over its various phases.</p>"
                    ]
                },




                changeOwner:  {
                    heading:    "Change owner",
                    css:        "min-width: 320px; min-height: 100px;",
                    content:    [
                        "<p>Used for handing over the project to another team member.</p>"
                    ]
                },



                storyboardReport:  {
                    heading:    "Storyboard report",
                    css:        "min-width: 320px; min-height: 100px;",
                    content:    [
                        "<p>Captures and collates the diagnostic insights of the project in one place.</p>"
                    ]
                },
                vsmReports:  {
                    heading:    "Value stream map reports",
                    css:        "min-width: 400px; min-height: 100px;",
                    content:    [
                        "<p>This section provides for generating reports at a process level, for example <a href='http://files.insolitusglobal.com/docuwiki/doku.php?id=value_stream_mapping' target='_blank'>Value Stream Maps</a> and Fishbone diagrams.</p>"
                    ]
                },
                fishboneReports:  {
                    heading:    "Fishbone reports",
                    css:        "min-width: 400px; min-height: 100px;",
                    content:    [
                        "<p>This section provides for generating reports at a process level, for example <a href='http://files.insolitusglobal.com/docuwiki/doku.php?id=value_stream_mapping' target='_blank'>Value Stream Maps</a> and Fishbone diagrams.</p>"
                    ]
                },
        customFields:  {
                    heading:    "Custom fields",
                    css:        "min-width: 400px; min-height: 100px;",
                    content:    [
                        "<p>This section enables you to enter values in customised fields defined by the Super User in your team. </p>"
                    ]
                },
            

             customReports:  {
                    heading:    "Custom reports",
                    css:        "min-width: 400px; min-height: 100px;",
                    content:    [
                        "<p>This section enables you to generates custom reports defined by the Super User in your team. </p>"
                    ]
                
            },
dataCollectionReport: {
                    heading:    "Data Collection Report",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        
                        "<p>The Data Collection Report is the place to capture current process performance data. Up to 3 values can be defined for providing the Baseline \(calculated as an average of non-blank values in these 3 fields\). You can also define a target value, and are encouraged to do so.</p>"
                        
                    ]

                },
BenefitAnalysisReport: {
                    heading:    "Benefit Analysis Report",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        
                       "<p>The Performance Gap After Report calculates the gap between after performance and target, as a percentage of target, and plots this as a bar graph sorted by largest to smallest gap. It is helpful in checking metric gaps after the project is done.</p>"
                        
                    ]

                },

BeforeVsAfterReport: {
                    heading:    "Before Vs. After Report",
                    css:        "min-width: 480px; min-height: 100px;",
                    content:   [
                        
                         "<p>The Performance Before Vs. After Report calculates the gap between after and before performance, as a percentage of before, and plots this as a bar graph sorted by largest to smallest gap. It is helpful in tracking needle movement of performance after Vs. Before.</p>"
                        
                    ]

                },
           
 
performanceGapReport:  {
                    heading:    "Performance gap report",
                    css:        "min-width: 400px; min-height: 100px;",
                    content:    [
                        "<p> The Performance Gap report calculates the gap between baseline and target, as a percentage of target, and plots this as a bar graph sorted by largest to smallest gap</p>"
                    ]
                }
            },
           
              
            _modalTemplate = null,
            _generatedModals = [],
            _modalIdPrefix = "oo_help-";

        // private methods overwritten..
        help.generate = function(helpKey) {
            oo.log("oo.help.generate: generating content for : " + helpKey);
            if (_modalTemplate == null) {
                _modalTemplate = $('#oo_js_template-modal').html();
            }
            var objId = _modalIdPrefix + helpKey;

            var htmlObj = $("<div></div>");
                htmlObj[0].innerHTML = _modalTemplate.toString();
                htmlObj.addClass("oo_modal-wrap");
                htmlObj.addClass("oo_help");
                htmlObj.attr("id", objId);

            var modalObj = htmlObj.find('.oo_modal');
                modalObj.attr("style", _helpInfo[helpKey].css);

            var headingObj = htmlObj.find('[data-template-header]');
                headingObj.text(_helpInfo[helpKey].heading);

            var content = "";
                for (var i=0; i < _helpInfo[helpKey].content.length; i++) {
                    content += "<div>";
                    content += _helpInfo[helpKey].content[i];
                    if (i != 0) {
                        content += "<a href='javascript:void(0);' class='oo_help-back' onclick='oo.help.back(this);'><i class='fa fa-angle-left'></i> back</a>";
                    }
                    if (i+1 < _helpInfo[helpKey].content.length) {
                        content += "<a href='javascript:void(0);' class='oo_help-more' onclick='oo.help.more(this);'>further information <i class='fa fa-angle-right'></i></a>";
                        if (i != 0) {
                            content += "<div class='oo_clear-both'></div>";
                        } else {
                            content += "<div class='oo_clear-right'></div>";
                        }
                    } else if (i != 0) {
                        content += "<div class='oo_clear-left'></div>";
                    }
                    content += "</div>";
                }

            var contentObj = htmlObj.find('[data-template-content]');
                contentObj.html(content);

            var closeObj = htmlObj.find('[data-template-close]');
                closeObj.click(function () {
                    oo.modal.close($(this).closest('.oo_modal-wrap'));
                });

            var popoverElements = $('#oo_js_popoverElements');
                htmlObj.appendTo(popoverElements);

            _generatedModals.push(htmlObj);
            return _generatedModals[_generatedModals.length - 1];
        };
        help.back = function(moreLinkObj) {
            var myObj = $(moreLinkObj);
            myObj.closest('div').hide().prev().show('slow');
        };
        help.more = function(moreLinkObj) {
            var myObj = $(moreLinkObj);
            myObj.closest('div').hide().next().show('slow');
        };

    }(oo.help = oo.help || {}));

    oo.help = $.extend(true, {}, oo.modal, oo.help);

}(window.oo = window.oo || {}, jQuery));
