(function(oo, $, undefined) {
    (function(track) {

        (function(intercom) {
            var _baseIntercomSettings = {
                    app_id:         "d4gozd08",
                    "oo_instance":  oo.WebsitePlatform(),
                    name:           "",
                    user_id:        "",
                    email:          "",
                    created_at:     "",
                    "plan_type":    ""
                };

            var attachJS = function() {
                    var w = window;
                    var d = document;
                    var i = function () {
                        i.c(arguments)
                    };
                    i.q = [];
                    i.c = function (args) {
                        i.q.push(args)
                    };
                    w.Intercom = i;
                    function l() {
                        var s = d.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = 'https://widget.intercom.io/widget/d4gozd08';
                        var x = d.getElementsByTagName('script')[0];
                        x.parentNode.insertBefore(s, x);

                        setupUser();

                        oo.track.setIsLoaded();
                    }

                    if (w.attachEvent) {
                        w.attachEvent('onload', l);
                    } else {
                        w.addEventListener('load', l, false);
                    }
                },
                setupUser = function() {
                    oo.log("oo.track.intercom.setupUser: setting up user = " + JSON.stringify(_baseIntercomSettings));
                    window.Intercom('reattach_activator');
                    window.Intercom('boot', _baseIntercomSettings);
                };

            intercom.isReady = function() {
                if (typeof window.Intercom === "function") {
                    oo.log("oo.track.intercom.isReady: is ready.");
                    return true;
                } else {
                    oo.log("oo.track.intercom.isReady: not ready.");
                    return false;
                }
            };

            intercom.updateUser = function(myObj) {
                if (intercom.isReady()) {
                    window.Intercom('update', myObj);
                }
            };

            intercom.getNewMessages = function() {
                if (intercom.isReady()) {
                    window.Intercom('update');
                }
            };

            intercom.sendEvent = function(eventName, eventMetaData) {
                if (intercom.isReady()) {
                    if (typeof eventMetaData != "undefined") {
                        oo.log("oo.track.intercom.sendEvent: sending event with eventname = " + eventName + " eventMetaData = " + JSON.stringify(eventMetaData));
                        window.Intercom('trackEvent', eventName, eventMetaData);
                    } else {
                        oo.log("oo.track.intercom.sendEvent: sending event with eventname = " + eventName + " and no event meta data.");
                        window.Intercom('trackEvent', eventName);
                    }
                } else {
                    oo.log("oo.track.intercom.sendEvent: intercom not ready.");
                }
            };

            intercom.stop = function() {
                if (isReady()) {
                    window.Intercom('shutdown');
                }
            };

            intercom.init = function(usrObj) {

                // setup base intercom settings object..
                _baseIntercomSettings.name = usrObj["fullName"];
                _baseIntercomSettings.user_id = usrObj["id"];
                _baseIntercomSettings.email = usrObj["email"];
                _baseIntercomSettings.created_at = usrObj["createdOn"];
                _baseIntercomSettings.plan_type = usrObj["plan"];

                // load intercom..
                if (!intercom.isReady()) {
                    attachJS();
                }

            };

        }(track.intercom = track.intercom || {}));


        var _loaded = false,
            _q = [], // for queuing tracking requests made prior to initialisation of user object.
            _usr = { // expected template for user object initialised by track.init()
                fullName:   "",
                id:         "",
                email:      "",
                createdOn:  "", // Signup date as a Unix timestamp
                plan:       ""
            };

        var clearQueue = function() {
                if (_q.length > 0) {
                    oo.log("oo.track.clearQueue: clearing queue of length = " + _q.length);
                    var newTrack;
                    while (_q.length > 0) {
                        newTrack = _q.shift();
                        //oo.log("oo.track.clearQueue: attempting to run queued tracking - method = " + newTrack["method"] + " args = " + newTrack["args"].toString());
                        newTrack["method"].apply(oo.track, newTrack.args);
                    }
                    oo.log("oo.track.clearQueue: cleared queue.");
                }
            },

            getUsr = function(param) {
                myValue = _usr[param];
                if (typeof myValue != "undefined") {
                    return myValue;
                } else {
                    return "";
                }
            };

        track.me = function(trackingType, trackingValue) {
            // track as appropriate for each trackingType..
            // nb. trackingValue can be anything that the specific trackingType is expecting.

            if (_loaded) {
if(trackingValue !== "")
{
               var userlogurl= "https://"+oo.ServerName()+"/dp.asp?AppKey="+oo.AppKey('UserLog')+"&PageName="+oo.common.getCurrentPageName()+"&Action="+trackingValue;
document.getElementById('frameUserLog').src = userlogurl;
}

//alert(document.getElementById('frameUserLog').src);
                oo.log("oo.track.me: pre tracking type switch with trackingType = " + trackingType);
                switch(trackingType) {
                    case 'projectdetails-section-show':
                        // spark off intercom call..
                        var myPage = oo.common.getCurrentPageName(),
                            myProjectId = oo.common.getCurrentProjectId(),
                            myInstance = oo.WebsitePlatform(),
                            myMetaData = {
                                // extra intercom variables to be passed in..
                                "page":         myPage,
                                "section":      trackingValue,
                                "project_id":   myProjectId,
                                "oo_instance":  myInstance
                            };
                        oo.log("oo.track.me: tracking " + trackingType + " with object = " + JSON.stringify(myMetaData));
                        track.intercom.sendEvent(myPage + " - " + trackingValue, myMetaData);
                        break;

                }
            } else {
                var newTrack = { method: oo.track.me, args: [trackingType, trackingValue] };
                //var newTrack = function() { oo.track.me(trackingType, trackingValue); };
                oo.log("oo.track.me: not loaded yet, so queuing tracking request. newTrack = " + JSON.stringify(newTrack));
                _q.push(newTrack);
            }

        };

        track.stop = function() {
            track.intercom.stop();
        };

        track.setIsLoaded = function() {
            _loaded = true;
            clearQueue();
        };

        track.init = function(usrObj) {
//code added by mj to tarck user in caspio
var userlogurl ="https://"+oo.ServerName()+"/dp.asp?AppKey="+oo.AppKey('UserLog')+"&PageName="+oo.common.getCurrentPageName()+"&Action="+oo.common.getCurrentPageName();
//alert(userlogurl);
document.getElementById('frameUserLog').src = userlogurl;
//END
            oo.log("oo.track.init: initialising tracking object = " + JSON.stringify(usrObj));

            $.extend(_usr, usrObj);

            track.intercom.init(_usr);

        };

    }(oo.track = oo.track || {}));
}(window.oo = window.oo || {}, jQuery));

