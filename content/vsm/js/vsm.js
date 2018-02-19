
(function(window){
    'use strict';

    function define_VsmCrud(){

        var VsmCrud = {};

        VsmCrud.getIFrameIds = function () {
            return iframes;
        }

        //FOOTERS
        VsmCrud.getFooterNotes = function () {
            //return getArrayData(iframes.metrics.READ);
            var stepsColumns = {
                0: 'Notes'
            };
            return getObjectData(iframes.footer.READ, stepsColumns);
        };

        VsmCrud.reloadFooters = function (fun) {
            reloadIFrame(iframes.footer.READ, null, fun);
        };

        // METRICS
        VsmCrud.getMetrics = function () {
            //return getArrayData(iframes.metrics.READ);
            var stepsColumns = {
                0: 'MetricName',
                1: 'MetricURL'
            };
            return getObjectData(iframes.metrics.READ, stepsColumns);
        };

        // CAUSES
        VsmCrud.getCauses = function () {
            //return getArrayData(iframes.causes.READ);
            var stepsColumns = {
                0: 'CauseName',
                1: 'CauseURL'
            };
            return getObjectData(iframes.causes.READ, stepsColumns);
        };

        // SOLUTIONS
        VsmCrud.getSolutions = function () {
            var stepsColumns = {
                0: 'SolutionName',
                1: 'SolutionURL'
            };
            return getObjectData(iframes.solutions.READ, stepsColumns);
            //return getArrayData(iframes.solutions.READ);
        };

        // STEPS
        VsmCrud.getSteps = function () {
            var stepsColumns = {
                0: 'ProcessStepID',
                1: 'StepSequence',
                2: 'StepName',
                3: 'ValueAdding',
                4: 'StepComments',
                5: 'StepDescription',
                6: 'StepsChkUnique'
            };
            return getObjectData(iframes.steps.READ, stepsColumns);
        };

        VsmCrud.onModalSubmit = function (Callbacks, action) {

            var elementID = "";
            if (action == 'Update')
                elementID = "#modal-update"
            else
                elementID = "#modal-add"

            var iframe = $('iframe').filter(elementID);

            if (iframe) {
                if (iframe.contents().find('.cbFormError').length > 0) {
                    if (_.isFunction(Callbacks.onError)) {
                        Callbacks.onError();
                    }
                }
                if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                    // Success
                    if (_.isFunction(Callbacks.onSucess)) {
                        Callbacks.onClose();
                    }
                } else if (iframe.contents().find('#caspioform')) {
                    if (_.isFunction(Callbacks.onSucess)) {
                        Callbacks.onSucess();
                    }
                }
            }
        };

        VsmCrud.createStep1 = function (stepSeq) {
            var iframe = $('iframe').filter(iframes.steps.CREATE);
            if (iframe) {
                // Input fields
                var fieldSequence = iframe.contents().find('#InsertRecordProcessStepSequence');
                var fieldName = iframe.contents().find('#InsertRecordProcessStepName');
                var fieldValueAdding = iframe.contents().find('#InsertRecordStepsStatus');

                // Compute next step
                var maxStep = _.maxBy(this.getSteps(), function (item) { return Number(item.StepSequence) })
                console.log(maxStep);
                var nextSequenceNumber = maxStep ? Number(maxStep.StepSequence) + 1 : 1;

                // Fill input fields
                fieldSequence.val(nextSequenceNumber);
                fieldName.val(stepName || '');
                fieldValueAdding.val(valueAdding || 'Value Adding');
            }
        }

        VsmCrud.createStep = function (stepName, valueAdding, okFun, errFun) {
            var iframe = $('iframe').filter(iframes.steps.CREATE);
            if (iframe) {
                // Input fields
                var fieldSequence = iframe.contents().find('#InsertRecordProcessStepSequence');
                var fieldName = iframe.contents().find('#InsertRecordProcessStepName');
                var fieldValueAdding = iframe.contents().find('#InsertRecordStepsStatus');

                // Compute next step
                var maxStep = _.maxBy(this.getSteps(), function (item) { return Number(item.StepSequence) })
                console.log(maxStep);
                var nextSequenceNumber = maxStep ? Number(maxStep.StepSequence) + 1 : 1;

                // Fill input fields
                fieldSequence.val(nextSequenceNumber);
                fieldName.val(stepName || '');
                fieldValueAdding.val(valueAdding || 'Value Adding');

                // Add event handler to the iframe to catch server reponse to submit
                var self = this;
                iframe.bind('load', function () {
                    // Remove envent handler
                    iframe.unbind('load');

                    // Check for success
                    if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                        // Success
                        self.reloadSteps(function () {
                            var res = _.find(VsmCrud.getSteps(), function (item) { return item.StepSequence == nextSequenceNumber; });
                            if (_.isFunction(okFun)) {
                                okFun(res);
                            }
                        });
                    } else {
                        if (_.isFunction(errFun)) {
                            errFun();
                        }
                    }

                    // Reset submit form
                    self.reloadStepsCreate();
                });

                // Sumbit the form
                iframe.contents().find('#caspioform').submit();
            }

        };

        VsmCrud.updateStep = function (step, isDelete) {
            // Craft url for this process step
            // TODO: Build url and query param properly
            var url = 'https://c0amf816.caspio.com/dp.asp?AppKey=ef404000c4a5d01f3fcb418e8790&cbUI=1&ProcessStepId=' + step.ProcessStepID;

            // Load the form that is used to update the step
            this.reloadStepsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.steps.UPDATE);
                var content = iframe.contents();

                // Set input fields
                content.find('#EditRecordProcessStepSequence').val(step.StepSequence);
                content.find('#EditRecordProcessStepName').val(step.StepName);
                content.find('#EditRecordComments').val(step.StepComments);
                content.find('#EditRecordStepsStatus').val(step.ValueAdding);

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');
                    iframe.contents().find('.cbConfirmationMessages')[0] ? VsmCrud.reloadSteps() : alert('Failed to update step.');
                });

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        VsmCrud.updateStepSequence = function (step, url, Callbacks, reload) {
            // Load the form that is used to update the step
            this.reloadStepsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.steps.UPDATE);
                var content = iframe.contents();

                // Set input fields
                var stepSeqVal = parseInt(step.StepSequence)
                content.find('#EditRecordProcessStepSequence').val(stepSeqVal);

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');

                    if (iframe.contents().find('.cbFormError').length > 0) {
                        if (_.isFunction(Callbacks.onError)) {
                            Callbacks.onError();
                        }
                    }
                    if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                        // Success
                        if (_.isFunction(Callbacks.onSucess)) {
                            //Callbacks.onSucess();
                            if(reload)
                                reloadIFrame(iframes.steps.READ, null, Callbacks.onSucess);
                            else
                                Callbacks.onSucess();
                        }
                    }
                });

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        VsmCrud.deleteStep = function (step) {
            this.updateStep(step, true);
        };

        VsmCrud.reloadSteps = function (fun) {
            reloadIFrame(iframes.steps.READ, null, fun);
        };

        VsmCrud.AddStepsCreateSeq = function (stepSeqID) {
            var iframe = $('iframe').filter('#modal-add');
            if (iframe) {
                // Input fields
                var fieldSequence = iframe.contents().find('#InsertRecordProcessStepSequence');
                var fieldName = iframe.contents().find('#InsertRecordProcessStepName');
                var fieldValueAdding = iframe.contents().find('#InsertRecordStepsStatus');

                // Fill input fields
                fieldSequence.val(stepSeqID);
                //fieldName.val(stepSeqID);
                //fieldValueAdding.val(valueAdding || 'Value Adding');
            }
        };

        VsmCrud.reloadStepsUpdate = function (url, fun) {
            reloadIFrame(iframes.steps.UPDATE, url, fun);
        };


        // METRIC CONNECTIONS
        VsmCrud.getMetricConnections = function () {
            var columns = {
                0: 'MetricName',
                1: 'ActualsBefore',
                2: 'Target',
                3: 'Worktype',
                4: 'UoM',
                5: 'TimeCycle',
                6: 'Aspect',
                7: 'Priority',
                8: 'ActualsAfter',
                9: 'MetricsStatus',
                10: 'ProcessStepID',
                11: 'DataValueID',
                12: 'Comments',
                13: 'VSMCollapse',
                14: 'MetricsMaster',
                15: 'Color_Baseline',
                16: 'Color_Achived',
                17: 'FooterReference'

            };
            return getObjectData(iframes.connections.metric.READ, columns);
        }

        VsmCrud.createMetricConnection = function (metricName, processStepID, okFun, errFun) {
            var iframe = $('iframe').filter(iframes.connections.metric.CREATE);
            var content = iframe.contents();

            content.find('[name="InsertRecordMetricName"]').val(metricName);
            if (processStepID)
                content.find('#InsertRecordProcessStepID').val(processStepID);

            // TODO: Add the rest of the editable fields

            iframe.bind('load', function () {
                iframe.unbind('load');
                if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                    // Success
                    VsmCrud.reloadMetricConnections(function () {
                        if (_.isFunction(okFun)) {
                            okFun(_.last(VsmCrud.getMetricConnections()));
                        }
                    });
                } else {
                    if (_.isFunction(errFun)) {
                        errFun();
                    }
                }
                VsmCrud.reloadMetricConnectionsCreate();
            });

            // Sumbit the form
            iframe.contents().find('#caspioform').submit();
        };

        //VsmCrud.updateMetricConnection = function (obj, newProcessStepID) {
        //    updateOrDeleteMetricConnection(obj, newProcessStepID, false);
        //};

        //VsmCrud.deleteMetricConnection = function (obj) {
        //    updateOrDeleteMetricConnection(obj, null, true);
        //};

        

        VsmCrud.reloadMetricConnections = function (fun) {
            reloadIFrame(iframes.connections.metric.READ, null, fun);
        };

        VsmCrud.reloadMetricConnectionsCreate = function () {
            reloadIFrame(iframes.connections.metric.CREATE);
        };

        VsmCrud.reloadMetricConnectionsUpdate = function (url, fun) {
            reloadIFrame(iframes.connections.metric.UPDATE, url, fun);
        };

        // CAUSE CONNECTIONS
        VsmCrud.getCauseConnections = function () {
            var columns = {
                0: 'CauseName',
                1: 'Priority',
                2: 'ProcessStepID',
                3: 'CausesStatus',
                4: 'CauseImpactID',
                5: 'Comments',
                6: 'VSMCollapse',
                7: 'FooterReference'
            };
            return getObjectData(iframes.connections.cause.READ, columns);
        };

        VsmCrud.createCauseConnection = function (causeName, processStepID, okFun, errFun) {
            var iframe = $('iframe').filter(iframes.connections.cause.CREATE);
            var content = iframe.contents();

            if (processStepID)
                content.find('#InsertRecordProcessStepID').val(processStepID);
            content.find('[name="InsertRecordCauseName"]').val(causeName);
            // TODO: Add the rest of the editable fields

            iframe.bind('load', function () {
                iframe.unbind('load');
                if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                    // Success
                    VsmCrud.reloadCauseConnections(function () {
                        if (_.isFunction(okFun)) {
                            okFun(_.last(VsmCrud.getCauseConnections()));
                        }
                    });
                } else {
                    if (_.isFunction(errFun)) {
                        errFun();
                    }
                }
                VsmCrud.reloadCauseConnectionsCreate();
            });

            // Sumbit the form
            iframe.contents().find('#caspioform').submit();
        };

        VsmCrud.updateCauseConnection = function (obj, newProcessStepID) {
            updateOrDeleteCauseConnection(obj, newProcessStepID, false);
        };

        VsmCrud.deleteCauseConnection = function (obj) {
            updateOrDeleteCauseConnection(obj, null, true);
        };

        VsmCrud.reloadCauseConnections = function (fun) {
            reloadIFrame(iframes.connections.cause.READ, null, fun);
        };

        VsmCrud.reloadCauseConnectionsCreate = function () {
            reloadIFrame(iframes.connections.cause.CREATE);
        };

        VsmCrud.reloadCauseConnectionsUpdate = function (url, fun) {
            reloadIFrame(iframes.connections.cause.UPDATE, url, fun);
        };

        // SOLUTION CONNECTIONS
        VsmCrud.getSolutionConnections = function () {
            var columns = {
                0: 'SolutionName',
                1: 'Priority',
                2: 'SolutionStageName',
                3: 'ProcessStepID',
                4: 'SolutionImpactID',
                5: 'Comments',
                6: 'VSMCollapse',
                7: 'FooterReference'
            };
            return getObjectData(iframes.connections.solution.READ, columns);
        };

        VsmCrud.createSolutionConnection = function (solutionName, processStepID, okFun, errFun) {
            var iframe = $('iframe').filter(iframes.connections.solution.CREATE);
            var content = iframe.contents();

            if (processStepID)
                content.find('#InsertRecordProcessStepID').val(processStepID);
            content.find('[name="InsertRecordSolutionName"]').val(solutionName);
            // TODO: Add the rest of the editable fields

            iframe.bind('load', function () {
                iframe.unbind('load');
                if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                    // Success
                    VsmCrud.reloadSolutionConnections(function () {
                        if (_.isFunction(okFun)) {
                            okFun(_.last(VsmCrud.getSolutionConnections()));
                        }
                    });
                } else {
                    if (_.isFunction(errFun)) {
                        errFun();
                    }
                }
                VsmCrud.reloadSolutionConnectionsCreate();
            });

            // Sumbit the form
            iframe.contents().find('#caspioform').submit();
        };

        VsmCrud.updateSolutionConnection = function (obj, newProcessStepID) {
            updateOrDeleteSolutionConnection(obj, newProcessStepID, false);
        };

        VsmCrud.deleteSolutionConnection = function (obj, newProcessStepID) {
            updateOrDeleteSolutionConnection(obj, newProcessStepID, true);
        };

        VsmCrud.reloadSolutionConnections = function (fun) {
            reloadIFrame(iframes.connections.solution.READ, null, fun);
        };

        VsmCrud.reloadSolutionConnectionsCreate = function () {
            reloadIFrame(iframes.connections.solution.CREATE);
        };

        VsmCrud.reloadSolutionConnectionsUpdate = function (url, fun) {
            reloadIFrame(iframes.connections.solution.UPDATE, url, fun);
        };


        //DELETE CONNECTIONS
        VsmCrud.deleteMetricConnection = function (url, Callbacks) {
            deleteConnection(iframes.connections.metric.UPDATE, iframes.connections.metric.READ, url, Callbacks);
        };

        VsmCrud.deleteCauseConnection = function (url, Callbacks) {
            deleteConnection(iframes.connections.cause.UPDATE, iframes.connections.cause.READ, url, Callbacks);
        };

        VsmCrud.deleteSolutionConnection = function (url, Callbacks) {
            deleteConnection(iframes.connections.solution.UPDATE, iframes.connections.solution.READ, url, Callbacks);
        };

        // PRIVATE FUNCTIONS
        var getArrayData = function (id) {
            var res = [];
            var elements = $('iframe').filter(id).contents().find('.cbResultSetData');
            for (var i = 0; i < elements.length; i++) {
                res.push(elements[i].innerText);
            }
            return res;
        };

        var isEmpty = function(value) {
            return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
        }

        var getObjectData = function (id, definition) {
            var res = [];
            $('iframe').filter(id).contents().find('.cbResultSetDataRow').each(function (elem) {
                var elements = $(this).find('.cbResultSetData');
                var obj = {};
                for (var i in definition) {
            
                    if (definition[i] == "StepSequence") {
                        
                        var stepSeqVal = 0;
                        if (!isEmpty(elements[i].innerText)) {
                            stepSeqVal = parseInt(elements[i].innerText);
                            obj[definition[i]] = stepSeqVal;
                        }
                    }
                    else if (definition[i] == "VSMCollapse") {
                        var val = false;
                        if(!isEmpty(elements[i].innerText)) {
                           var text = elements[i].innerText;
                           if(text == "Yes")
                               val = true;
                        }
                        obj["Collapse"] = val;
                    }
                    else {
                        obj[definition[i]] = elements[i].innerText;
                    }
                }
                res.push(obj);
            });

            return res;
        };

        var reloadIFrame = function (id, url, fun) {

            var iframe = $(id);
            iframe.bind('load', function () {
                iframe.unbind('load');
                if (_.isFunction(fun)) {
                    fun();
                }
            });

            // Reload the iframe with its origin url or the one passed in
            $(id).attr('src', function (i, val) { return url || val; });
        };

        VsmCrud.updateMetricConnection = function (obj, url, Callbacks, reload, isFlagUpdate, isDelete) {

            // Load the form that is used to update the step
            VsmCrud.reloadMetricConnectionsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.connections.metric.UPDATE);
                var content = iframe.contents();

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }
                else {
                    if (isFlagUpdate) {
                        content.find('#EditRecordImportanceScore').val(obj.Priority);
                    }
                    else {
                        if (obj.Collapse)
                            content.find('#EditRecordVSMCollapse').prop("checked", true);
                        else
                            content.find('#EditRecordVSMCollapse').prop("checked", false);
                    }
                }

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');


                    if (iframe.contents().find('.cbFormError').length > 0) {
                        if (_.isFunction(Callbacks.onError)) {
                            Callbacks.onError();
                        }
                    }

                    if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                        // Success
                        if (_.isFunction(Callbacks.onSucess)) {
                            //Callbacks.onSucess();
                            if (reload)
                                reloadIFrame(iframes.connections.metric.READ, null, Callbacks.onSucess);
                            else
                                Callbacks.onSucess();
                        }
                    }
                });

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        var updateOrDeleteMetricConnection = function (obj, newProcessStepID, isDelete) {
            // Craft url for this process step
            // TODO: Build url and query param properly
            var url = 'https://c0amf816.caspio.com/dp.asp?AppKey=ef404000267dce20695d495ba604&cbUI=1&DataValueID=' + obj.DataValueID;

            // Load the form that is used to update the step
            VsmCrud.reloadMetricConnectionsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.connections.metric.UPDATE);
                var content = iframe.contents();

                // Set input fields
                if (newProcessStepID) {
                    content.find('#EditRecordProcessStepID').val(newProcessStepID);
                }
                content.find('[name="EditRecordTransactionTypeName"]').val(obj.WorkType);
                content.find('#EditRecordProjectTarget').val(obj.Target);
                content.find('#EditRecordActualsBeforeCycle1').val(obj.ActualsBefore);
                content.find('#EditRecordActualsAfter1').val(obj.ActualsAfter);
                content.find('#EditRecordImportanceScore').val(obj.Priority);
                content.find('#EditRecordAspect').val(obj.Aspect);
                content.find('#EditRecordMetricsStatus').val(obj.MetricsStatus);
                content.find('[name="EditRecordUnitOfMeasureName"]').val(obj.UoM);
                content.find('#EditRecordTimeCycle').val(obj.TimeCycle);

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');
                    iframe.contents().find('.cbConfirmationMessages')[0] ? VsmCrud.reloadMetricConnections() : alert('Failed to update metric connection.');
                });

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        VsmCrud.updateCauseConnection = function (obj, url, Callbacks, reload, isFlagUpdate, isDelete) {

            // Load the form that is used to update the step
            VsmCrud.reloadMetricConnectionsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.connections.metric.UPDATE);
                var content = iframe.contents();

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }
                else {
                    if (isFlagUpdate) {
                        content.find('#EditRecordPriority').val(obj.Priority);
                    }
                    else {
                        if (obj.Collapse)
                            content.find('#EditRecordVSMCollapse').prop("checked", true);
                        else
                            content.find('#EditRecordVSMCollapse').prop("checked", false);
                    }
                }

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');


                    if (iframe.contents().find('.cbFormError').length > 0) {
                        if (_.isFunction(Callbacks.onError)) {
                            Callbacks.onError();
                        }
                    }

                    if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                        // Success
                        if (_.isFunction(Callbacks.onSucess)) {
                            //Callbacks.onSucess();
                            if (reload)
                                reloadIFrame(iframes.connections.metric.READ, null, Callbacks.onSucess);
                            else
                                Callbacks.onSucess();
                        }
                    }
                });

                // Submit form
                content.find('#caspioform').submit();
            });
        };
        var updateOrDeleteCauseConnection = function (obj, newProcessStepID, isDelete) {
            // Craft url for this process step
            // TODO: Build url and query param properly
            var url = 'https://c0amf816.caspio.com/dp.asp?AppKey=ef4040001342ebc428d64d5bbb55&cbUI=1&CauseImpactID=' + obj.CauseImpactID;

            // Load the form that is used to update the step
            VsmCrud.reloadCauseConnectionsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.connections.cause.UPDATE);
                var content = iframe.contents();

                // Set input fields
                if (newProcessStepID) {
                    content.find('#EditRecordProcessStepID').val(newProcessStepID);
                }
                content.find('#EditRecordPriority').val(obj.Priority);
                content.find('#EditRecordCausesStatus').val(obj.CausesStatus);

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');
                    iframe.contents().find('.cbConfirmationMessages')[0] ? VsmCrud.reloadCauseConnections() : alert('Failed to update cause connection.');
                });

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        VsmCrud.updateSolutionConnection = function (obj, url, Callbacks, reload, isFlagUpdate, isDelete) {

            // Load the form that is used to update the step
            VsmCrud.reloadMetricConnectionsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.connections.metric.UPDATE);
                var content = iframe.contents();

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }
                else {
                    if (isFlagUpdate) {
                        content.find('#EditRecordPriority').val(obj.Priority);
                    }
                    else {
                        if (obj.Collapse)
                            content.find('#EditRecordVSMCollapse').prop("checked", true);
                        else
                            content.find('#EditRecordVSMCollapse').prop("checked", false);
                    }
                }

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');


                    if (iframe.contents().find('.cbFormError').length > 0) {
                        if (_.isFunction(Callbacks.onError)) {
                            Callbacks.onError();
                        }
                    }

                    if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                        // Success
                        if (_.isFunction(Callbacks.onSucess)) {
                            //Callbacks.onSucess();
                            if (reload)
                                reloadIFrame(iframes.connections.metric.READ, null, Callbacks.onSucess);
                            else
                                Callbacks.onSucess();
                        }
                    }
                });

                // Submit form
                content.find('#caspioform').submit();
            });
        };
        var updateOrDeleteSolutionConnection = function (obj, newProcessStepID, isDelete) {
            // Craft url for this process step
            // TODO: Build url and query param properly
            var url = 'https://c0amf816.caspio.com/dp.asp?AppKey=ef40400025a4f9a6416045669619&cbUI=1&SolutionImpactID=' + obj.SolutionImpactID;

            // Load the form that is used to update the step
            VsmCrud.reloadSolutionConnectionsUpdate(url, function () {
                var iframe = $('iframe').filter(iframes.connections.solution.UPDATE);
                var content = iframe.contents();

                // Set input fields
                // Set input fields
                if (newProcessStepID) {
                    content.find('#EditRecordProcessStepID').val(newProcessStepID);
                }
                content.find('#EditRecordPriority').val(obj.Priority);
                //content.find('#EditRecordSolutionStatus').val(obj.SolutionsStatus);

                // Set up callback
                iframe.bind('load', function () {
                    iframe.unbind('load');
                    iframe.contents().find('.cbConfirmationMessages')[0] ? VsmCrud.reloadSolutionConnections() : alert('Failed to update solution connection.');
                });

                if (isDelete) {
                    content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');
                }

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        var deleteConnection = function (type, loadType, url, Callbacks) {

            // Load the form that is used to update the step
            reloadIFrame(type, url, function () {
                var iframe = $('iframe').filter(type);
                var content = iframe.contents();

                iframe.bind('load', function () {
                    iframe.unbind('load');

                    if (iframe.contents().find('.cbFormError').length > 0) {
                        if (_.isFunction(Callbacks.onError)) {
                            Callbacks.onError();
                        }
                    }
                    if (iframe.contents().find('.cbConfirmationMessages')[0]) {
                        // Success
                        if (_.isFunction(Callbacks.onSucess)) {
                            //Callbacks.onSucess();
                            reloadIFrame(loadType, null, Callbacks.onSucess);
                        }
                    }
                });

                content.find('#caspioform').append('<input type="hidden" name="Mod0DeleteRecord" value="Delete" />');

                // Submit form
                content.find('#caspioform').submit();
            });
        };

        var iframes = {
            metrics: {
                READ: "#metrics-vsm-read"
            },
            causes: {
                READ: "#causes-vsm-read"
            },
            solutions: {
                READ: "#solutions-vsm-read"
            },
            steps: {
                READ: "#steps-vsm-read",
                CREATE: "#steps-vsm-create",
                UPDATE: "#steps-vsm-update"
            },
            connections: {
                metric: {
                    READ: "#metric-connections-vsm-read",
                    CREATE: '#metric-connections-vsm-create',
                    UPDATE: '#metric-connections-vsm-update',
                },
                cause: {
                    READ: '#cause-connections-vsm-read',
                    CREATE: '#cause-connections-vsm-create',
                    UPDATE: '#cause-connections-vsm-update'
                },
                solution: {
                    READ: '#solution-connections-vsm-read',
                    CREATE: '#solution-connections-vsm-create',
                    UPDATE: '#solution-connections-vsm-update'
                },
            },
            footer: {
                READ: "#footers-vsm-read"
            }
        };

        return VsmCrud;
    }

    // Define globally if it doesn't already exist
    if(typeof(VsmCrud) === 'undefined'){
        window.VsmCrud = define_VsmCrud();
    }
    else{
        console.log("VsmCrud already defined.");
    }
})(window);
