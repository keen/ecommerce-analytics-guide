$(document).ready(function() {
    if (hasVisited())
        return;

    setVisitedCookie();
    sendVisitEvent();
});


function hasVisited() {
    return getFirstVisitCookie();
}

function getFirstVisitCookie() {
    return Cookies.get(window._VISIT_COOKIE);
}

function getFirstVisitedDateCookie() {
    var value = Cookies.get(window._VISIT_COOKIE_DATE);

    if (value)
        return new Date(value);

    return null;
}

function setVisitedCookie() {
    var genSub = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };

    var guid = genSub() + genSub() + "-" + genSub() + "-" +
      genSub() + "-" + genSub() + "-" + genSub() + genSub() + genSub();

    Cookies.set(window._VISIT_COOKIE, guid);
    Cookies.set(window._VISIT_COOKIE_DATE, (new Date()).toISOString());
}

function sendVisitEvent() {
    var visitEvent = {
        path: location.pathname,
        referrer: document.referrer
    };

    if (location.search && location.search.length) {
        var queryString = new QS();
        var params = queryString.getAll();
        visitEvent.params = params;
    }

    Keen.ready(function() {
        window._addEvent("first_visits", visitEvent, function(err, res) {

        }, "First visit using this browser. (No cookie was set before)");

    });
}