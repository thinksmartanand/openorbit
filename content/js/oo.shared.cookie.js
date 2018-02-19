(function(oo, $, undefined) {
    (function(cookie) {

        cookie.delete = function(name) {
            $.jCookie(name, null);
        };
        cookie.set = function(name, value, options) {
            if (typeof options != "undefined") {
                $.jCookie(name, value, options);
            } else {
                $.jCookie(name, value);
            }
        };
        cookie.setSessionCookie = function(name, value) {
            $.jCookie(name, value, { expires: null, path: '/', domain: oo.WebsiteServer(), secure: true });
        };
        cookie.update = function(name, value, options) {
            this.set(name, value, options); //nb. same as set due to nature of cookie handling.
        };
        cookie.updateSessionCookie = function(name, value) {
            this.setSessionCookie(name, value);
        };
        cookie.read = function(name) {
            return $.jCookie(name);
        };

    }(oo.cookie = oo.cookie || {}));
}(window.oo = window.oo || {}, jQuery));



/*
if (var myDest = oo.cookie.read('destination') != null) {
    window.location.href = "[@app:INSOL][@app:INSTANCE]" + oo.common.getUrl(myDest);
}
    */