define(["app", "js/about/aboutView"], function (app, View) {
    var $ = jQuery;
    var $$ = Dom7;

    var bindings = [];

    function init() {
        app.f7.closePanel(true);
        View.fillImage();
        View.render({
            bindings: bindings
        });
    }

    return {
        init: init
    };
});