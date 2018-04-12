require.config({
    paths: {
        handlebars: "lib/handlebars-v4.0.11",
        config: "js/life_lighter_config",
        text: "lib/text",
        hbs: "lib/hbs"
    },
    shim: {
        handlebars: {
            exports: "Handlebars"
        }
    }
});
define('app', ['js/router', 'js/life_lighter_handlebars'], function (Router, hbshelper) {
    Router.init();
    var f7 = new Framework7({
        modalTitle: 'Life Lighter',
        animateNavBackIcon: true,
		pushState: true,
        swipePanel: 'left',
        text: 'go up',
        ignorePages: ['index'] // defaults to []
    });
    var mainView = f7.addView('.view-main', {
        dynamicNavbar: true
    });
    return {
        f7: f7,
        mainView: mainView,
        router: Router,
        helpers: hbshelper
    };
});